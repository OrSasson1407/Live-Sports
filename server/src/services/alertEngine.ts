// server/src/services/alertEngine.ts
import { EventEmitter } from 'events';
import { streamEvents } from './mockSportsStream';
// UPGRADE: Importing our official sports interfaces
import { GameTick, AlertRule } from '../types/ticker';

export const alertEvents = new EventEmitter();

// In-memory store for active alerts
let activeAlerts: AlertRule[] = [];

// API to add a new alert
export function addAlert(rule: Omit<AlertRule, 'id' | 'isActive'>) {
  const newAlert: AlertRule = {
    ...rule,
    id: Math.random().toString(36).substring(2, 9), // Quick auto-generated ID
    isActive: true,
  };
  activeAlerts.push(newAlert);
  console.log(`🔔 Alert set for: ${newAlert.gameId} (${newAlert.condition})`);
  return newAlert;
}

// API to remove an alert
export function removeAlert(id: string) {
  activeAlerts = activeAlerts.filter(alert => alert.id !== id);
}

// The core engine
export function startAlertEngine() {
  console.log('🛡️ Alert Engine started');

  streamEvents.on('tick', (tick: GameTick) => {
    // Find alerts matching this specific game
    const relevantAlerts = activeAlerts.filter(
      a => a.isActive && a.gameId === tick.gameId
    );

    relevantAlerts.forEach(alert => {
      let isTriggered = false;

      // UPGRADE: Sports-specific logic! 
      // E.g., Alert me if the total points scored in the game goes over 200
      if (alert.condition === 'score_above' && alert.threshold !== undefined) {
        const totalScore = tick.homeScore + tick.awayScore;
        if (totalScore >= alert.threshold) {
          isTriggered = true;
        }
      } 
      // E.g., Alert me when the game officially ends
      else if (alert.condition === 'game_end' && tick.status === 'finished') {
        isTriggered = true;
      }

      if (isTriggered) {
        // 1. Emit the alert event
        alertEvents.emit('triggered', {
          alertId: alert.id,
          gameId: alert.gameId,
          message: `🚨 ${tick.homeTeam} vs ${tick.awayTeam}: Alert Condition Met!`
        });

        // 2. Deactivate the alert so it doesn't spam
        alert.isActive = false; 
        console.log(`🚨 ALERT TRIGGERED: ${alert.gameId}`);
      }
    });
  });
}
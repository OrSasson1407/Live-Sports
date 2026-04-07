import { EventEmitter } from 'events';
import { streamEvents } from './realSportsStream';
import { GameTick, AlertRule } from '../types/ticker';

export const alertEvents = new EventEmitter();

let activeAlerts: AlertRule[] = [];

export function addAlert(rule: Omit<AlertRule, 'id' | 'isActive'>) {
  const newAlert: AlertRule = {
    ...rule,
    id: Math.random().toString(36).substring(2, 9),
    isActive: true,
  };
  activeAlerts.push(newAlert);
  console.log(`🔔 Alert set for: ${newAlert.gameId} (${newAlert.condition})`);
  return newAlert;
}

export function removeAlert(id: string) {
  activeAlerts = activeAlerts.filter(alert => alert.id !== id);
}

export function startAlertEngine() {
  console.log('🛡️ Alert Engine started');

  streamEvents.on('tick', (tick: GameTick) => {
    const relevantAlerts = activeAlerts.filter(
      a => a.isActive && a.gameId === tick.gameId
    );

    relevantAlerts.forEach(alert => {
      let isTriggered = false;

      if (alert.condition === 'score_above' && alert.threshold !== undefined) {
        const totalScore = tick.homeScore + tick.awayScore;
        if (totalScore >= alert.threshold) isTriggered = true;
      } else if (alert.condition === 'game_end' && tick.status === 'finished') {
        isTriggered = true;
      }

      if (isTriggered) {
        alertEvents.emit('triggered', {
          alertId: alert.id,
          gameId: alert.gameId,
          message: `🚨 ${tick.homeTeam} vs ${tick.awayTeam}: Alert Condition Met!`
        });
        alert.isActive = false;
        console.log(`🚨 ALERT TRIGGERED: ${alert.gameId}`);
      }
    });
  });
}

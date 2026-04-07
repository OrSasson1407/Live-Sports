import { create } from 'zustand';

export interface Tick {
  symbol: string;
  price: number;
  timestamp: number;
}

interface TickerState {
  isConnected: boolean;
  ticks: Record<string, Tick>; // e.g., { "BTCUSDT": { price: 65000, ... } }
  setConnected: (status: boolean) => void;
  updateTick: (tick: Tick) => void;
}

export const useTickerStore = create<TickerState>((set) => ({
  isConnected: false,
  ticks: {},
  setConnected: (status) => set({ isConnected: status }),
  
  // This gets called hundreds of times a minute, so we keep it lightweight
  updateTick: (tick) => 
    set((state) => ({
      ticks: {
        ...state.ticks,
        [tick.symbol]: tick,
      },
    })),
}));
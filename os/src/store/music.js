import { create } from "zustand";

// The Control Center's Sound slider. The site plays no audio of its own, so
// this only remembers where the visitor left it.
const useSoundStore = create((set) => ({
  volume: 60,
  setVolume: (volume) => set({ volume }),
}));

export default useSoundStore;

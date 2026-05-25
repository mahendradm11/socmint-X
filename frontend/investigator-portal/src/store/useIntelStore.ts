import { create } from "zustand";

type IntelState = {
  focusMode: boolean;
  selectedNodeId: string | null;
  investigationFilter: string;
  setFocusMode: (v: boolean) => void;
  setSelectedNode: (id: string | null) => void;
  setInvestigationFilter: (f: string) => void;
};

export const useIntelStore = create<IntelState>((set) => ({
  focusMode: false,
  selectedNodeId: null,
  investigationFilter: "all",
  setFocusMode: (focusMode) => set({ focusMode }),
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  setInvestigationFilter: (investigationFilter) => set({ investigationFilter }),
}));

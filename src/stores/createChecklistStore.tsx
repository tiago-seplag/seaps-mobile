import { create } from "zustand";

type TChecklist = Partial<Checklist>;

interface State {
  checklist: TChecklist;
  setChecklist: (
    checklist: TChecklist | ((prev: TChecklist) => TChecklist)
  ) => void;
}

export const useChecklistStore = create<State>((set) => ({
  checklist: {},

  setChecklist: (checklist) =>
    set((state) => ({
      checklist:
        typeof checklist === "function"
          ? checklist(state.checklist)
          : checklist,
    })),
}));

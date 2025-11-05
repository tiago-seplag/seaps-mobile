import { create } from "zustand";

type TProperty = Partial<Property>;

interface State {
  property: TProperty;
  setProperty: (property: TProperty | ((prev: TProperty) => TProperty)) => void;
}

export const usePropertyStore = create<State>((set) => ({
  property: {},

  setProperty: (property) =>
    set((state) => ({
      property:
        typeof property === "function" ? property(state.property) : property,
    })),
}));

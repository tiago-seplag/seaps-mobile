import React, { Dispatch, useState } from "react";

type TChecklist = Partial<Checklist>;

const ChecklistContext = React.createContext<{
  checklist?: TChecklist;
  setChecklist: Dispatch<any>;
  reset: () => void;
}>({
  checklist: undefined,
  setChecklist: () => null,
  reset: () => null,
});

export function useCreateChecklist() {
  const context = React.useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklist must be used within a ChecklistProvider");
  }
  return context;
}

export function ChecklistProvider(props: React.PropsWithChildren) {
  const [checklist, setChecklist] = useState<Checklist | undefined>();

  return (
    <ChecklistContext.Provider
      value={{
        checklist,
        setChecklist,
        reset: () => setChecklist(undefined),
      }}
    >
      {props.children}
    </ChecklistContext.Provider>
  );
}

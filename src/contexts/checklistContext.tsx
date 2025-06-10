import React, { Dispatch, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

interface ChecklistForm {
  model_id: string;
  organization_id: string;
  property_id: string;
  user_id: string;
}

const ChecklistContext = React.createContext<{
  checklist: any;
  setChecklist: Dispatch<any>;
  form: UseFormReturn<ChecklistForm, any, undefined>;
  reset: () => void;
}>({
  checklist: null,
  form: {} as any,
  setChecklist: () => null,
  reset: () => null,
});

export function useChecklistForm() {
  const context = React.useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklist must be used within a ChecklistProvider");
  }
  return context;
}

export function ChecklistProvider(props: React.PropsWithChildren) {
  const form = useForm<ChecklistForm>();

  const [checklist, setChecklist] = useState<Checklist | undefined>();

  return (
    <ChecklistContext.Provider
      value={{
        checklist,
        form,
        setChecklist,
        reset: () => setChecklist(undefined),
      }}
    >
      {props.children}
    </ChecklistContext.Provider>
  );
}

export type StepIcon = "search" | "click" | "view" | "action";

export interface Step {
  step: string;
  description: string;
  icon: StepIcon;
  shouldFail?: boolean; // ✅ shared optional flag
}

export interface ExecutionWorkflow {
  id: string;
  title: string;
  steps: Step[];
}

import ExecutionBlock from "./ExecutionBlock";

interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
  shouldFail?: boolean;
}

export interface ExecutionWorkflow {
  id: string;
  title: string;
  steps: Step[];
}

const AutonomousWorkflow = ({
  workflows,
}: {
  workflows: ExecutionWorkflow[];
}) => {
  /**
   * 🔥 AUTONOMOUS ONLY CHANGE
   * Flatten all workflow steps → single execution stream
   * Guided remains untouched elsewhere.
   */
  const allSteps = workflows.flatMap((wf) => wf.steps);

  return (
    <ExecutionBlock
      title="Autonomous execution"
      steps={allSteps}
      mode="autonomous"
    />
  );
};

export default AutonomousWorkflow;

import WorkflowCard from "./WorkflowCard";

interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
}

interface AutonomousWorkflow {
  id: string;
  title: string;
  steps: Step[];
}

const AutonomousWorkflowCard = ({
  workflows,
}: {
  workflows: AutonomousWorkflow[];
}) => {
  return (
    <div className="space-y-6">
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          title={workflow.title}
          steps={workflow.steps}
          mode="autonomous"
        />
      ))}
    </div>
  );
};

export default AutonomousWorkflowCard;

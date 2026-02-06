import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import StepRow, { StepStatus } from "./StepRow";

interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
}

interface WorkflowCardProps {
  title: string;
  steps: Step[];
  mode: "guided" | "autonomous";
}

const WorkflowCard = ({ title, steps, mode }: WorkflowCardProps) => {
  const [phase, setPhase] = useState<
    "planning" | "executing" | "complete"
  >(mode === "autonomous" ? "planning" : "executing");

  const [currentStep, setCurrentStep] = useState(0);
  const [statuses, setStatuses] = useState<StepStatus[]>(
    steps.map(() => "pending")
  );

  useEffect(() => {
    setStatuses(steps.map(() => "pending"));
    setCurrentStep(0);
    setPhase(mode === "autonomous" ? "planning" : "executing");
  }, [steps, mode]);

  useEffect(() => {
    if (mode !== "autonomous" || phase !== "planning") return;
    const t = setTimeout(() => setPhase("executing"), 1000);
    return () => clearTimeout(t);
  }, [mode, phase]);

  useEffect(() => {
    if (phase !== "executing") return;
    if (currentStep >= steps.length) {
      setPhase("complete");
      return;
    }

    setStatuses((s) => {
      const next = [...s];
      next[currentStep] = "executing";
      return next;
    });

    const t = setTimeout(() => {
      setStatuses((s) => {
        const next = [...s];
        next[currentStep] = "completed";
        return next;
      });
      setCurrentStep((i) => i + 1);
    }, 800);

    return () => clearTimeout(t);
  }, [phase, currentStep, steps.length]);

  return (
    <div className="rounded-sm border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900">
          {phase === "planning"
            ? "Planning execution"
            : phase === "executing"
            ? "Running workflow"
            : "Execution complete"}
        </p>
        <p className="text-xs text-slate-500">
          Test flow · {title}
        </p>
      </div>

      {phase === "planning" && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Preparing execution graph
        </div>
      )}

      <div className="space-y-2">
        {steps.map((step, i) => (
          <StepRow
            key={i}
            step={`Step ${i + 1}`}
            title={step.step}
            description={step.description}
            icon={step.icon}
            status={statuses[i]}
          />
        ))}
      </div>

      {phase === "complete" && (
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700">
          <Check className="w-4 h-4" />
          Workflow finished successfully
        </div>
      )}
    </div>
  );
};

export default WorkflowCard;

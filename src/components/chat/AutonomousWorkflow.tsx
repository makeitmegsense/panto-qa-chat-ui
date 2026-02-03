import { useState } from "react";
import ExecutionBlock from "./ExecutionBlock";
import {
  Check,
  Loader2,
  ChevronDown,
  Brain,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
}

export interface ExecutionWorkflow {
  id: string;
  title: string;
  steps: Step[];
}

interface Props {
  workflows: ExecutionWorkflow[];
}

const AutonomousWorkflow = ({ workflows }: Props) => {
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative space-y-8">
      {/* Vertical rail */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[#019D91]/20" />

      {/* Header */}
      <div className="ml-10">
        <p className="text-sm font-semibold text-slate-900">
          Autonomous QA execution pipeline
        </p>
        <p className="text-xs text-slate-500">
          Each phase is planned, executed, and validated by AI
        </p>
      </div>

      {workflows.map((workflow, index) => {
        const isActive = index === activeWorkflowIndex;
        const isCompleted = index < activeWorkflowIndex;
        const isExpanded = expanded[workflow.id];

        return (
          <div
            key={workflow.id}
            className={cn(
              "relative ml-10 transition-all duration-500 ease-out",
              isCompleted && "opacity-90"
            )}
          >
            {/* Phase node */}
            <div className="absolute -left-10 top-4">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                  isCompleted && "bg-[#019D91] text-white",
                  isActive &&
                    "bg-[#019D91] text-white animate-pulse",
                  !isActive &&
                    !isCompleted &&
                    "bg-slate-200"
                )}
              >
                {isCompleted && <Check className="w-4 h-4" />}
                {isActive && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            </div>

            {/* Phase card */}
            <div className="rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-[0_20px_60px_rgba(1,157,145,0.12)] p-5">
              {/* Phase header */}
              <button
                onClick={() => toggleExpand(workflow.id)}
                className="w-full flex items-start justify-between gap-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {workflow.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isCompleted
                      ? "Phase completed successfully"
                      : isActive
                      ? "AI is executing this phase"
                      : "Queued for execution"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* AI signals */}
                  {isActive && (
                    <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-[#F3FBFA] text-[#019D91] border border-[#019D91]/30">
                      <Brain className="w-3.5 h-3.5" />
                      High confidence
                    </span>
                  )}

                  {isCompleted && (
                    <span className="flex items-center gap-1.5 text-xs text-[#019D91]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}

                  {/* Expand chevron */}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#019D91]/20 to-transparent" />

              {/* Active execution */}
              {isActive && (
                <div className="animate-in fade-in slide-in-from-top-3 duration-400">
                  <ExecutionBlock
                    title={workflow.title}
                    steps={workflow.steps}
                    mode="autonomous"
                    onComplete={() =>
                      setActiveWorkflowIndex((prev) => prev + 1)
                    }
                  />
                </div>
              )}

              {/* Expandable step summary (after / before execution) */}
              {!isActive && isExpanded && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-xs font-medium text-slate-700">
                    Steps executed in this phase
                  </p>

                  <ul className="space-y-2">
                    {workflow.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#019D91]" />
                        <span>{step.step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AutonomousWorkflow;

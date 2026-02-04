import { useState } from "react";
import ExecutionBlock from "./ExecutionBlock";
import {
  Check,
  Loader2,
  ChevronDown,
  Brain,
  Sparkles,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [failedWorkflowIndex, setFailedWorkflowIndex] =
    useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    {}
  );

  return (
    <div className="relative space-y-8">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[#019D91]/20" />

      {workflows.map((wf, index) => {
        const isFailed = index === failedWorkflowIndex;

        // 🔑 CRITICAL FIX
       const isActive =
  index === activeWorkflowIndex &&
  (failedWorkflowIndex === null ||
    failedWorkflowIndex === index);

        const isCompleted =
          index < activeWorkflowIndex &&
          failedWorkflowIndex === null;

        const isExpanded = expanded[wf.id] || isFailed;

        return (
          <div key={wf.id} className="ml-10 relative">
            {/* Node */}
            <div className="absolute -left-10 top-4">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center",
                  isCompleted && "bg-[#019D91] text-white",
                  isActive &&
                    !isFailed &&
                    "bg-[#019D91] text-white animate-pulse",
                  isFailed && "bg-red-500 text-white",
                  !isActive &&
                    !isCompleted &&
                    !isFailed &&
                    "bg-slate-200"
                )}
              >
                {isCompleted && <Check className="w-4 h-4" />}
                {isActive && !isFailed && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isFailed && <XCircle className="w-4 h-4" />}
              </div>
            </div>

            {/* Card */}
            <div
              className={cn(
                "rounded-2xl border p-5 shadow",
                isFailed
                  ? "border-red-200 bg-red-50/40"
                  : "border-slate-200 bg-white"
              )}
            >
              {/* Header */}
              <button
                className="w-full flex justify-between text-left"
                onClick={() =>
                  setExpanded((p) => ({
                    ...p,
                    [wf.id]: !p[wf.id],
                  }))
                }
              >
                <div>
                  <p className="font-semibold text-sm">
                    {wf.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isFailed
                      ? "Phase failed"
                      : isCompleted
                      ? "Phase completed"
                      : isActive
                      ? "Executing"
                      : "Queued"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <span className="text-xs text-[#019D91] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                  {isFailed && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5" />
                      Failed
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </div>
              </button>

              <div className="my-4 h-px bg-[#019D91]/20" />

              {/* 🔥 SINGLE ExecutionBlock ONLY */}
              {isActive && (
                <ExecutionBlock
                  title={wf.title}
                  steps={wf.steps}
                  mode="autonomous"
                  onComplete={() =>
                    setActiveWorkflowIndex((i) => i + 1)
                  }
                  onFail={() => {
                    setFailedWorkflowIndex(index);
                    setExpanded((p) => ({
                      ...p,
                      [wf.id]: true,
                    }));
                  }}
                />
              )}

              {/* Step summary */}
              {!isActive && isExpanded && (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {wf.steps.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mt-2",
                          isFailed
                            ? "bg-red-500"
                            : "bg-[#019D91]"
                        )}
                      />
                      {s.step}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AutonomousWorkflow;

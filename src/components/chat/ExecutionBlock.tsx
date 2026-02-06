import { useState, useEffect } from "react";
import ExecutionStep, { StepStatus } from "./ExecutionStep";
import ExecutionLogRow from "./ExecutionLogRow";
import {
  Check,
  Loader2,
  XCircle,
  Target,
  Zap,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
  shouldFail?: boolean;
}

interface ExecutionBlockProps {
  title: string;
  steps: Step[];
  mode: "guided" | "autonomous";
  onComplete?: () => void;
  onFail?: () => void;
}

type LogEntry = {
  step: number;
  goal: string;
  action: string;
};

/* ================= EXECUTION PLAN ================= */

const PLAN_STEPS = [
  "Fetching image and XML",
  "Searching required element",
  "Executing action on device",
  "Validating action",
];

function generateLogsForStep(stepIndex: number): LogEntry[] {
  switch (stepIndex) {
    case 0:
      return [
        {
          step: 1,
          goal: "Open the Walmart application.",
          action:
            "Opening the Walmart app using the assumed package name 'com.application.walmart'.",
        },
        {
          step: 2,
          goal:
            "Wait for the Walmart app to fully load and display its main interface, then take a screenshot.",
          action:
            "Sleeping for 5 seconds to allow the Walmart app to load, then taking a new screenshot.",
        },
      ];

    case 1:
      return [
        {
          step: 3,
          goal: "Search for the product 'Orange' using the search bar.",
          action:
            "Typing 'Orange' into the search field and submitting the query.",
        },
      ];

    case 2:
      return [
        {
          step: 4,
          goal: "Attempt to tap the 'Add to Cart' button.",
          action:
            "Detected that the 'Add to Cart' button is disabled and cannot be interacted with.",
        },
      ];

    case 3:
      return [
        {
          step: 5,
          goal: "Validate whether the item was successfully added.",
          action: "Validation failed because the action could not be completed.",
        },
      ];

    default:
      return [];
  }
}

/* ================= COMPONENT ================= */

const ExecutionBlock = ({
  title,
  steps,
  mode,
  onComplete,
  onFail,
}: ExecutionBlockProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [phase, setPhase] = useState<"executing" | "complete" | "failed">(
    "executing"
  );
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);

  /* 🆕 retry state */
  const [retryCount, setRetryCount] = useState(0);
  const MAX_AUTO_RETRY = mode === "autonomous" ? 3 : 1;

  /* collapse + timing */
  const [collapsed, setCollapsed] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const hasError = stepStatuses.includes("error");

  /* ===== Reset / Manual Retry ===== */
  const resetExecution = () => {
    setStepStatuses(steps.map(() => "pending"));
    setAllLogs([]);
    setCurrentStep(0);
    setPhase("executing");
    setRetryCount(0);
    setCollapsed(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    resetExecution();
  }, [steps, mode]);

  /* ===== Step execution ===== */
  useEffect(() => {
    if (phase !== "executing") return;
    if (currentStep >= PLAN_STEPS.length) return;

    setStepStatuses((s) => {
      const next = [...s];
      next[currentStep] = "executing";
      return next;
    });

    const timer = setTimeout(() => {
      const shouldFail = steps[currentStep]?.shouldFail;

      /* ❌ FAILURE */
      if (shouldFail) {
        if (retryCount < MAX_AUTO_RETRY) {
          setRetryCount((r) => r + 1);

          setAllLogs((prev) => [
            ...prev,
            {
              step: prev.length + 1,
              goal: `Retrying step ${currentStep + 1}`,
              action: `Automatic retry attempt ${retryCount + 1}`,
            },
          ]);

          return;
        }

        setStepStatuses((s) => {
          const next = [...s];
          next[currentStep] = "error";
          return next;
        });

        setPhase("failed");
        onFail?.();
        return;
      }

      /* ✅ SUCCESS */
      setStepStatuses((s) => {
        const next = [...s];
        next[currentStep] = "completed";
        return next;
      });

      setAllLogs((prev) => [...prev, ...generateLogsForStep(currentStep)]);

      if (currentStep < PLAN_STEPS.length - 1) {
        setCurrentStep((i) => i + 1);
      } else {
        setPhase("complete");
        onComplete?.();
      }
    }, mode === "guided" ? 900 : 2200);

    return () => clearTimeout(timer);
  }, [currentStep, phase, retryCount, steps, mode, onComplete, onFail]);

  /* ===== Auto-collapse on finish ===== */
  useEffect(() => {
    if (phase === "complete" || phase === "failed") {
      setCollapsed(true);
    }
  }, [phase]);

  const completedCount = stepStatuses.filter((s) => s === "completed").length;
  const totalSteps = allLogs.length;
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  /* ================= UI ================= */

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
      {/* ===== HEADER ===== */}
      {(phase === "complete" || phase === "failed") && (
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "w-full px-4 py-3 flex items-center justify-between border-b transition",
            phase === "complete"
              ? "bg-emerald-50/70 hover:bg-emerald-50"
              : "bg-red-50/70 hover:bg-red-50"
          )}
        >
          <div className="flex items-center gap-2">
            {phase === "complete" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}

            <span
              className={cn(
                "text-sm font-semibold",
                phase === "complete" ? "text-emerald-700" : "text-red-600"
              )}
            >
              {phase === "complete"
                ? "Execution completed"
                : "Execution failed"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{duration}s</span>
            <span>{totalSteps} steps</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                !collapsed && "rotate-180"
              )}
            />
          </div>
        </button>
      )}

      {/* ===== BODY ===== */}
      {!collapsed && (
        <div className="p-5 space-y-6">
          {/* Execution Plan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#019D91]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Execution Plan
              </span>
            </div>

            <div className="space-y-3">
              {PLAN_STEPS.map((label, i) => (
                <ExecutionStep
                  key={i}
                  step={label}
                  description=""
                  status={
                    stepStatuses[i] === "error"
                      ? "error"
                      : i < completedCount
                      ? "completed"
                      : i === currentStep && phase === "executing"
                      ? "executing"
                      : "pending"
                  }
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Execution Details */}
          {mode === "autonomous" && (
            <div className="pt-5 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Execution Details
                </span>
              </div>

              <div className="space-y-3">
                {allLogs.map((log, i) => (
                  <ExecutionLogRow
                    key={i}
                    stepNumber={log.step}
                    goal={log.goal}
                    action={log.action}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Failure + Manual Retry */}
          {phase === "failed" && (
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-red-600 font-medium">
                Execution failed during validation.
              </p>

              <button
                onClick={resetExecution}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-red-200 bg-white hover:bg-red-50 text-red-600 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry manually
              </button>
            </div>
          )}

          {/* Completion */}
          {phase === "complete" && (
            <div className="pt-5 border-t border-slate-200">
              <p className="text-sm text-emerald-600 font-semibold">
                Task completed successfully in {duration}s.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalSteps} execution steps recorded.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionBlock;

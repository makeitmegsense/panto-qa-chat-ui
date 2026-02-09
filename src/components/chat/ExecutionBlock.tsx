"use client";

import { useState, useEffect, useRef } from "react";
import {
  Check,
  XCircle,
  Target,
  ChevronDown,
  RotateCcw,
  Camera,
  Search,
  MousePointerClick,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

export type StepStatus = "pending" | "executing" | "completed" | "error";

interface Step {
  step: string;
  description: string;
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

/* ================= CONSTANTS ================= */

const PLAN_STEPS = [
  "Fetching image and XML",
  "Searching required element",
  "Executing action on device",
  "Validating action",
];

const STEP_ICONS = [
  Camera,
  Search,
  MousePointerClick,
  BadgeCheck,
];

/* ================= MOCK LOGS ================= */

function generateLogsForStep(stepIndex: number): LogEntry[] {
  switch (stepIndex) {
    case 0:
      return [
        {
          step: 1,
          goal: "Open the Walmart application.",
          action: "Launching application using package name com.application.walmart.",
        },
        {
          step: 2,
          goal: "Capture UI snapshot.",
          action: "Waiting 5 seconds, then capturing screenshot and XML.",
        },
      ];

    case 1:
      return [
        {
          step: 3,
          goal: "Locate search input.",
          action: "Detected search bar using accessibility tree.",
        },
        {
          step: 4,
          goal: "Focus search field.",
          action: "Input cursor placed successfully.",
        },
      ];

    case 2:
      return [
        {
          step: 5,
          goal: "Tap Add to Cart.",
          action: "Element found but disabled — tap interaction aborted.",
        },
      ];

    case 3:
      return [
        {
          step: 6,
          goal: "Verify cart state.",
          action: "Validation failed — cart count unchanged.",
        },
      ];

    default:
      return [];
  }
}

/* ================= STEP UI ================= */

const ExecutionStep = ({
  step,
  icon,
  status,
  logs,
  failureReason,
}: {
  step: string;
  icon: React.ReactNode;
  status: StepStatus;
  logs: LogEntry[];
  failureReason?: string;
}) => (
  <div className="space-y-2">
    {/* Step box */}
    <div
      className={cn(
        "flex items-start gap-3 rounded-md px-3 py-2 text-sm border transition-colors",
        status === "completed" && "bg-green-50 border-green-200 text-green-700",
        status === "executing" && "bg-blue-50 border-blue-200 text-blue-700",
        status === "error" && "bg-red-50 border-red-200 text-red-700",
        status === "pending" && "bg-slate-50 border-slate-200 text-slate-600"
      )}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="font-medium leading-snug flex-1">{step}</div>

      {status === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
    </div>

    {/* Failure reason */}
    {failureReason && (
      <div className="ml-6 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
        {failureReason}
      </div>
    )}

    {/* Logs */}
    {logs.length > 0 && (
      <div className="ml-6 space-y-1">
        {logs.map((log, i) => (
          <div
            key={i}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
          >
            <div className="font-medium text-slate-700">
              Step {log.step}: {log.goal}
            </div>
            <div className="mt-0.5 text-slate-500">{log.action}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ================= EXECUTION BLOCK ================= */

const ExecutionBlock = ({
  title,
  steps,
  mode,
  onComplete,
  onFail,
}: ExecutionBlockProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [logsPerStep, setLogsPerStep] = useState<LogEntry[][]>([]);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  const [phase, setPhase] = useState<"executing" | "complete" | "failed">("executing");
  const [retryCount, setRetryCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const stoppedRef = useRef(false);
  const initializedRef = useRef(false);

  const MAX_AUTO_RETRY = mode === "autonomous" ? 3 : 1;

  /* ===== INIT ===== */
  const resetExecution = () => {
    stoppedRef.current = false;

    setStepStatuses(PLAN_STEPS.map(() => "pending"));
    setLogsPerStep(PLAN_STEPS.map(() => []));
    setFailureReason(null);

    setCurrentStep(0);
    setPhase("executing");
    setRetryCount(0);
    setCollapsed(false);
    setStartTime(Date.now());

    initializedRef.current = true;
  };

  useEffect(() => {
    if (!initializedRef.current) resetExecution();
  }, [steps, mode]);

  /* ===== EXECUTION LOOP ===== */
  useEffect(() => {
    if (phase !== "executing") return;
    if (currentStep >= PLAN_STEPS.length) return;
    if (stoppedRef.current) return;

    setStepStatuses((s) => {
      const next = [...s];
      next[currentStep] = "executing";
      return next;
    });

    const timer = setTimeout(() => {
      if (stoppedRef.current) return;

      const shouldFail = steps[currentStep]?.shouldFail;

      /* ❌ FAILURE */
      if (shouldFail) {
        if (retryCount < MAX_AUTO_RETRY) {
          setRetryCount((r) => r + 1);
          return;
        }

        stoppedRef.current = true;

        setStepStatuses((s) => {
          const next = [...s];
          next[currentStep] = "error";
          return next;
        });

        setFailureReason("Validation failed — element disabled or action blocked.");
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

      if (mode === "autonomous") {
        setLogsPerStep((prev) => {
          const next = [...prev];
          next[currentStep] = generateLogsForStep(currentStep);
          return next;
        });
      }

      if (currentStep < PLAN_STEPS.length - 1) {
        setCurrentStep((i) => i + 1);
      } else {
        stoppedRef.current = true;
        setPhase("complete");
        onComplete?.();
      }
    }, mode === "guided" ? 900 : 2000);

    return () => clearTimeout(timer);
  }, [currentStep, phase, retryCount, mode, steps, onComplete, onFail]);

  /* ===== AUTO COLLAPSE ===== */
  useEffect(() => {
    if (phase !== "executing") setCollapsed(true);
  }, [phase]);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  /* ================= UI ================= */

  return (
    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      {(phase === "complete" || phase === "failed") && (
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full px-4 py-3 flex items-center justify-between border-b hover:bg-emerald-50/40 transition"
        >
          <div className="flex items-center gap-2">
            {phase === "complete" ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                phase === "complete" ? "text-green-600" : "text-red-600"
              )}
            >
              {phase === "complete" ? "Execution completed" : "Execution failed"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{duration}s</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", !collapsed && "rotate-180")}
            />
          </div>
        </button>
      )}

      {!collapsed && (
        <div className="p-4 space-y-6">
          {/* PLAN + INLINE LOGS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold uppercase text-slate-700">
                Execution Plan
              </span>
            </div>

            <div className="space-y-3">
              {PLAN_STEPS.map((label, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <ExecutionStep
                    key={i}
                    step={label}
                    icon={<Icon className="w-4 h-4" />}
                    status={stepStatuses[i] ?? "pending"}
                    logs={logsPerStep[i] ?? []}
                    failureReason={stepStatuses[i] === "error" ? failureReason ?? undefined : undefined}
                  />
                );
              })}
            </div>
          </div>

          {/* FAILURE RETRY */}
          {phase === "failed" && (
            <button
              onClick={resetExecution}
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry manually
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionBlock;

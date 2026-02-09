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
  Terminal,
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
          action:
            "Launching application using package name com.application.walmart.",
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
      ];

    case 2:
      return [
        {
          step: 4,
          goal: "Tap Add to Cart.",
          action: "Element found but disabled — tap interaction aborted.",
        },
      ];

    case 3:
      return [
        {
          step: 5,
          goal: "Verify cart state.",
          action: "Validation failed — cart count unchanged.",
        },
      ];

    default:
      return [];
  }
}

/* ================= SMALL UI ================= */

const ExecutionStep = ({
  step,
  icon,
  status,
}: {
  step: string;
  icon: React.ReactNode;
  status: StepStatus;
}) => (
  <div
    className={cn(
      "relative flex items-start gap-3 rounded-md px-3 py-2 text-sm border transition-colors",
      status === "completed" &&
        "bg-green-50 border-green-200 text-green-700",
      status === "executing" &&
        "bg-blue-50 border-blue-200 text-blue-700",
      status === "error" &&
        "bg-red-50 border-red-200 text-red-700",
      status === "pending" &&
        "bg-slate-50 border-slate-200 text-slate-600"
    )}
  >
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="font-medium leading-snug">{step}</div>
  </div>
);

const ExecutionLogRow = ({
  stepNumber,
  goal,
  action,
}: LogEntry) => (
  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs">
    <div className="font-medium text-slate-700">
      Step {stepNumber}: {goal}
    </div>
    <div className="mt-0.5 text-slate-500">{action}</div>
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
  const [phase, setPhase] = useState<"executing" | "complete" | "failed">(
    "executing"
  );
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  /** 🔒 prevents infinite loop */
  const stoppedRef = useRef(false);

  /** 🔒 prevents unwanted re-init */
  const initializedRef = useRef(false);

  const MAX_AUTO_RETRY = mode === "autonomous" ? 3 : 1;

  /* ===== INIT ===== */
  useEffect(() => {
    if (initializedRef.current) return;

    stoppedRef.current = false;

    setStepStatuses(steps.map(() => "pending"));
    setAllLogs([]);
    setCurrentStep(0);
    setPhase("executing");
    setRetryCount(0);
    setCollapsed(false);
    setStartTime(Date.now());

    initializedRef.current = true;
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
          const nextRetry = retryCount + 1;
          setRetryCount(nextRetry);

          setAllLogs((l) => [
            ...l,
            {
              step: l.length + 1,
              goal: `Retrying step ${currentStep + 1}`,
              action: `Auto retry attempt ${nextRetry}`,
            },
          ]);

          return;
        }

        stoppedRef.current = true;

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

      if (mode === "autonomous") {
        setAllLogs((l) => [...l, ...generateLogsForStep(currentStep)]);
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
                phase === "complete"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {phase === "complete"
                ? "Execution completed"
                : "Execution failed"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{duration}s</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                !collapsed && "rotate-180"
              )}
            />
          </div>
        </button>
      )}

      {!collapsed && (
        <div className="p-4 space-y-6">
          {/* PLAN */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold uppercase text-slate-700">
                Execution Plan
              </span>
            </div>

            <div className="relative space-y-2 pl-4">
              <div className="absolute left-1 top-0 bottom-0 w-px bg-slate-200" />
              {PLAN_STEPS.map((label, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <ExecutionStep
                    key={i}
                    step={label}
                    icon={<Icon className="w-4 h-4" />}
                    status={stepStatuses[i] ?? "pending"}
                  />
                );
              })}
            </div>
          </div>

          {/* DETAILS → autonomous only */}
          {mode === "autonomous" && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold uppercase text-slate-700">
                  Execution Details
                </span>
              </div>

              <div className="rounded-md bg-slate-50 border border-slate-200 p-3 space-y-2">
                {allLogs.map((log, i) => (
                  <ExecutionLogRow key={i} {...log} />
                ))}
              </div>
            </div>
          )}

          {phase === "failed" && (
            <button
              onClick={() => {
                initializedRef.current = false;
                setCollapsed(false);
              }}
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

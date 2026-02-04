import { useState, useEffect } from "react";
import ExecutionStep, { StepStatus } from "./ExecutionStep";
import {
  Check,
  Loader2,
  Brain,
  Compass,
  XCircle,
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

const MAX_RETRIES = {
  guided: 1,
  autonomous: 2,
};

const ExecutionBlock = ({
  title,
  steps,
  mode,
  onComplete,
  onFail,
}: ExecutionBlockProps) => {
  const [currentStep, setCurrentStep] = useState(
    mode === "autonomous" ? -1 : 0
  );
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [phase, setPhase] = useState<
    "planning" | "executing" | "complete" | "failed"
  >(mode === "autonomous" ? "planning" : "executing");

  const [retryCount, setRetryCount] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  const hasError = stepStatuses.includes("error");

  /* ===================== RESET ===================== */
  useEffect(() => {
    setStepStatuses(steps.map(() => "pending"));
    setRetryCount(0);

    if (mode === "guided") {
      setCurrentStep(0);
      setPhase("executing");
    } else {
      setCurrentStep(steps.length ? 0 : -1);
      setPhase(steps.length ? "executing" : "planning");
    }
  }, [steps, mode, retryKey]);

  /* ===================== STEP EXECUTION ===================== */
  useEffect(() => {
    if (phase !== "executing") return;
    if (currentStep < 0 || currentStep >= steps.length) return;
    if (hasError) return;

    setStepStatuses((prev) => {
      const next = [...prev];
      next[currentStep] = "executing";
      return next;
    });

    const timer = setTimeout(() => {
      const step = steps[currentStep];
      const maxRetries = MAX_RETRIES[mode];

      if (step.shouldFail) {
        if (retryCount < maxRetries) {
          setRetryCount((r) => r + 1);
          setStepStatuses((prev) => {
            const next = [...prev];
            next[currentStep] = "pending";
            return next;
          });
          return;
        }

        setStepStatuses((prev) => {
          const next = [...prev];
          next[currentStep] = "error";
          return next;
        });
        return;
      }

      setStepStatuses((prev) => {
        const next = [...prev];
        next[currentStep] = "completed";
        return next;
      });

      setRetryCount(0);

      if (currentStep < steps.length - 1) {
        setCurrentStep((i) => i + 1);
      } else {
        setPhase("complete");
        if (mode === "autonomous") onComplete?.();
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [
    currentStep,
    phase,
    steps,
    retryCount,
    hasError,
    mode,
    onComplete,
  ]);

  /* ===================== FAILURE PROPAGATION ===================== */
  useEffect(() => {
    if (hasError) {
      setPhase("failed");
      if (mode === "autonomous") onFail?.();
    }
  }, [hasError, mode, onFail]);

  /* ===================== MANUAL RETRY ===================== */
  const handleManualRetry = () => {
    setRetryKey((k) => k + 1);
    setPhase("executing");
  };

  /* ===================== PROGRESS ===================== */
  const completedCount = stepStatuses.filter(
    (s) => s === "completed"
  ).length;

  const progress =
    steps.length === 0
      ? 0
      : Math.round((completedCount / steps.length) * 100);

  /* ===================== UI ===================== */
  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-[0_20px_60px_rgba(1,157,145,0.12)] px-5 py-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        {phase === "failed" ? (
          <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-white" />
          </div>
        ) : phase === "complete" ? (
          <div className="w-7 h-7 rounded-full bg-[#019D91] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <Loader2 className="w-5 h-5 text-[#019D91] animate-spin" />
        )}

        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {phase === "failed"
              ? "Test failed"
              : phase === "complete"
              ? "Execution complete"
              : "Execution in progress"}
          </p>
          <p className="text-xs text-slate-500">{title}</p>
        </div>

        {retryCount > 0 && phase === "executing" && (
          <span className="flex items-center gap-2 text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            <RotateCcw className="w-3.5 h-3.5" />
            Retry {retryCount}/{MAX_RETRIES[mode]}
          </span>
        )}

        {phase === "complete" && (
          <span className="flex items-center gap-2 text-xs text-[#019D91]">
            <Brain className="w-3.5 h-3.5" />
            Confident
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4 h-1 w-full bg-[#E6F4F2] rounded-full overflow-hidden">
        <div
          className={cn(
            "h-1 transition-all",
            phase === "failed"
              ? "bg-red-500"
              : "bg-[#019D91]"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((s, i) => (
          <ExecutionStep
            key={i}
            step={s.step}
            description={s.description}
            status={stepStatuses[i]}
            index={i}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Failure + Retry */}
      {phase === "failed" && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-700">
            Execution stopped after retries
          </p>
          <p className="text-xs text-red-600 mt-1">
            The step failed after automated retry attempts.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleManualRetry}
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry phase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionBlock;

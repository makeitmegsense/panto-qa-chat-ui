import { useState, useEffect } from "react";
import ExecutionStep, { StepStatus } from "./ExecutionStep";
import {
  Check,
  Loader2,
  Brain,
  Compass,
  XCircle,
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

  const hasError = stepStatuses.includes("error");

  /* ===================== RESET ===================== */
  useEffect(() => {
    setStepStatuses(steps.map(() => "pending"));

    if (mode === "guided") {
      setCurrentStep(0);
      setPhase("executing");
    } else {
      setCurrentStep(steps.length ? 0 : -1);
      setPhase(steps.length ? "executing" : "planning");
    }
  }, [steps, mode]);

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

      setStepStatuses((prev) => {
        const next = [...prev];

        if (step.shouldFail) {
          next[currentStep] = "error";
          return next;
        }

        next[currentStep] = "completed";
        return next;
      });

      // 🔴 CRITICAL: STOP EVERYTHING ON FAILURE
      if (step.shouldFail) return;

      if (currentStep < steps.length - 1) {
        setCurrentStep((i) => i + 1);
      } else {
        setPhase("complete");
        if (mode === "autonomous") onComplete?.();
      }
    }, 850);

    return () => clearTimeout(timer);
  }, [
    currentStep,
    phase,
    steps,
    hasError,
    mode,
    onComplete,
  ]);

  /* ===================== FAILURE PROPAGATION ===================== */
  useEffect(() => {
    if (hasError) {
      setPhase("failed");
      if (mode === "autonomous") {
        onFail?.();
      }
    }
  }, [hasError, mode, onFail]);

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
          <p className="text-xs text-slate-500">
            {title}
          </p>
        </div>

        {phase === "executing" && (
          <span className="flex items-center gap-2 text-xs px-2 py-0.5 rounded-full bg-[#F3FBFA] text-[#019D91] border border-[#019D91]/30">
            <Compass className="w-3.5 h-3.5" />
            Executing
          </span>
        )}

        {phase === "complete" && (
          <span className="flex items-center gap-2 text-xs text-[#019D91]">
            <Brain className="w-3.5 h-3.5" />
            Confident
          </span>
        )}

        {phase === "failed" && (
          <span className="flex items-center gap-2 text-xs text-red-600">
            <Brain className="w-3.5 h-3.5" />
            Low confidence
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

      {/* Failure explanation */}
      {phase === "failed" && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-700">
            Execution stopped due to failure
          </p>
          <p className="text-xs text-red-600 mt-1">
            The Add to Cart button was not actionable.
          </p>

          <div className="mt-3 bg-white border rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-slate-700">
              AI analysis
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Inventory may be unavailable or a required
              variant was not selected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionBlock;

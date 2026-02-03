import { useState, useEffect } from "react";
import ExecutionStep, { StepStatus } from "./ExecutionStep";
import { Check, Loader2, Brain, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  step: string;
  description: string;
  icon: "search" | "click" | "view" | "action";
}

interface ExecutionBlockProps {
  title: string;
  steps: Step[];
  mode: "guided" | "autonomous";
  onComplete?: () => void;
}

const ExecutionBlock = ({
  title,
  steps,
  mode,
  onComplete,
}: ExecutionBlockProps) => {
  const [currentStep, setCurrentStep] = useState(
    mode === "autonomous" ? -1 : 0
  );

  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const [phase, setPhase] = useState<
    "planning" | "executing" | "complete"
  >(mode === "autonomous" ? "planning" : "executing");

  /* ===================== RESET ===================== */
  useEffect(() => {
    setStepStatuses(steps.map(() => "pending"));
    setIsComplete(false);

    if (mode === "guided") {
      setCurrentStep(0);
      setPhase("executing");
    }

    if (mode === "autonomous") {
      setCurrentStep(steps.length ? 0 : -1);
      setPhase(steps.length ? "executing" : "planning");
    }
  }, [steps, mode]);

  /* ===================== STEP EXECUTION ===================== */
  useEffect(() => {
    if (phase !== "executing") return;
    if (currentStep < 0 || currentStep >= steps.length) return;

    setStepStatuses((prev) => {
      const next = [...prev];
      next[currentStep] = "executing";
      return next;
    });

    const timer = setTimeout(() => {
      setStepStatuses((prev) => {
        const next = [...prev];
        next[currentStep] = "completed";
        return next;
      });

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsComplete(true);
        setPhase("complete");
        if (mode === "autonomous") onComplete?.();
      }
    }, 850);

    return () => clearTimeout(timer);
  }, [currentStep, phase, steps.length, mode, onComplete]);

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
    <div className="rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-[0_20px_60px_rgba(1,157,145,0.12)] px-5 py-4 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        {isComplete ? (
          <div className="w-7 h-7 rounded-full bg-[#019D91] flex items-center justify-center mt-0.5">
            <Check className="w-4 h-4 text-white" />
          </div>
        ) : (
          <Loader2 className="w-5 h-5 text-[#019D91] animate-spin mt-1" />
        )}

        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {isComplete
              ? "Guided execution complete"
              : "Guided execution in progress"}
          </p>

          <p className="text-xs text-slate-500 mt-0.5">
            {isComplete
              ? title
              : `Step ${currentStep + 1} of ${steps.length}`}
          </p>
        </div>

        {/* AI intent (guided-specific) */}
        {!isComplete && (
          <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-[#F3FBFA] text-[#019D91] border border-[#019D91]/30">
            <Compass className="w-3.5 h-3.5" />
            I’ll guide you
          </div>
        )}

        {isComplete && (
          <div className="flex items-center gap-2 text-xs text-[#019D91]">
            <Brain className="w-3.5 h-3.5" />
            Confident result
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="h-1 w-full bg-[#E6F4F2] rounded-full overflow-hidden">
          <div
            className="h-1 bg-[#019D91] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <ExecutionStep
            key={index}
            step={step.step}
            description={step.description}
            status={stepStatuses[index]}
            index={index}
            icon={step.icon}
          />
        ))}
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#019D91] animate-in fade-in duration-300">
          <Check className="w-4 h-4" />
          All steps validated successfully
        </div>
      )}
    </div>
  );
};

export default ExecutionBlock;

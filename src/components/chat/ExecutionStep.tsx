import {
  Check,
  Loader2,
  Circle,
  MousePointer2,
  Search,
  Eye,
  Zap,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "pending" | "executing" | "completed" | "error";

export interface ExecutionStepProps {
  step: string;
  description: string;
  status: StepStatus;
  index: number;
  icon?: "search" | "click" | "view" | "action";
}

const iconMap = {
  search: Search,
  click: MousePointer2,
  view: Eye,
  action: Zap,
};

const ExecutionStep = ({
  step,
  description,
  status,
  index,
  icon = "action",
}: ExecutionStepProps) => {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "relative flex gap-4 py-2 px-3 rounded-sm transition-colors",
        status === "executing" &&
          "bg-[#F3FBFA] ring-1 ring-[#019D91]/30",
        status === "completed" && "opacity-70",
        status === "pending" && "opacity-80",
        status === "error" &&
          "bg-red-50 ring-1 ring-red-200"
      )}
      style={{
        animation: `step-enter 0.3s ease-out ${index * 70}ms forwards`,
      }}
    >
      {/* Vertical rail */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

      {/* Status node */}
      <div className="relative z-10 flex-shrink-0 mt-1">
        <div
          className={cn(
            "w-5 h-5 rounded-sm flex items-center justify-center",
            status === "pending" && "bg-slate-200",
            status === "executing" &&
              "bg-[#019D91] text-white animate-pulse",
            status === "completed" &&
              "bg-[#019D91] text-white",
            status === "error" && "bg-red-500 text-white"
          )}
        >
          {status === "pending" && (
            <Circle className="w-3 h-3 text-slate-400" />
          )}

          {status === "executing" && (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          )}

          {status === "completed" && (
            <Check className="w-3.5 h-3.5" />
          )}

          {status === "error" && (
            <XCircle className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              "w-4 h-4",
              status === "error"
                ? "text-red-500"
                : status === "executing"
                ? "text-[#019D91]"
                : "text-slate-400"
            )}
          />

          <span
            className={cn(
              "text-sm",
              status === "executing"
                ? "font-medium text-slate-900"
                : status === "error"
                ? "font-medium text-red-700"
                : "text-slate-600"
            )}
          >
            {step}
          </span>
        </div>

        <p className="mt-0.5 text-sm text-slate-500">
          {description}
        </p>

        {/* Failure explanation */}
        {status === "error" && (
          <div className="mt-2 rounded-sm bg-red-100 border border-red-200 px-3 py-2 text-xs text-red-700">
            <strong>Failure detected:</strong> The expected action could not be
            completed. The element was not in an actionable state (e.g. disabled,
            hidden, or blocked by validation).
          </div>
        )}
      </div>

      {/* Executing emphasis */}
      {status === "executing" && (
        <div className="absolute inset-x-3 bottom-0 h-px bg-[#019D91]/25" />
      )}
    </div>
  );
};

export default ExecutionStep;

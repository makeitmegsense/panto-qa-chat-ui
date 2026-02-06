import {
  Check,
  Loader2,
  Search,
  MousePointer2,
  Eye,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "pending" | "executing" | "completed";

const iconMap = {
  search: Search,
  click: MousePointer2,
  view: Eye,
  action: Zap,
};

interface StepRowProps {
  step: string;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  status: StepStatus;
}

const StepRow = ({
  step,
  title,
  description,
  icon,
  status,
}: StepRowProps) => {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "relative flex gap-4 py-4 px-3 rounded-sm transition-all",
        status === "executing" &&
          "bg-emerald-50/60 ring-1 ring-emerald-200",
        status === "completed" && "opacity-80"
      )}
    >
      {/* Timeline rail */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

      {/* Status node */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={cn(
            "w-6 h-6 rounded-sm flex items-center justify-center",
            status === "pending" && "bg-slate-200",
            status === "executing" &&
              "bg-emerald-600 text-white animate-pulse",
            status === "completed" && "bg-emerald-600 text-white"
          )}
        >
          {status === "executing" && (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          )}
          {status === "completed" && (
            <Check className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ml-2">
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              "w-4 h-4",
              status === "executing"
                ? "text-emerald-600"
                : "text-slate-400"
            )}
          />
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>
        </div>

        <p className="text-sm text-slate-600 mt-0.5">
          {description}
        </p>
      </div>

      <span className="text-xs text-slate-400 pt-1">
        {step}
      </span>
    </div>
  );
};

export default StepRow;

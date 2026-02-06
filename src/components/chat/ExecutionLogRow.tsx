import { CheckCircle } from "lucide-react";

interface ExecutionLogRowProps {
  stepNumber: number;
  goal: string;
  action: string;
}

const ExecutionLogRow = ({
  stepNumber,
  goal,
  action,
}: ExecutionLogRowProps) => {
  return (
    <div className="flex items-start gap-3 text-xs py-2 px-2 rounded-md text-slate-600">
      {/* Icon */}
      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />

      {/* Content */}
      <div className="space-y-1">
        <p>
          <span className="font-semibold">Step Number:</span> {stepNumber}
        </p>

        <p>
          <span className="font-semibold">Next Goal:</span> {goal}
        </p>

        <p>
          <span className="font-semibold">Actions:</span> {action}
        </p>
      </div>
    </div>
  );
};

export default ExecutionLogRow;

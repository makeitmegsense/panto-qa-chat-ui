import { useEffect } from "react";
import { Search } from "lucide-react";

interface Props {
  onComplete?: () => void;
  duration?: number;
}

export default function PremiumThinkingIndicator({
  onComplete,
  duration = 1800,
}: Props) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onComplete]);

  return (
    <div className="px-6 py-4">
      {/* Container aligned to execution / system blocks */}
      <div className="flex items-center gap-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
        {/* ===== AI Orb (unchanged animation language) ===== */}
        <div className="relative w-10 h-10 flex-shrink-0">
          {/* breathing glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#019D91] to-[#019D91]/60 blur-[4px] opacity-80 animate-[pulse_2.4s_ease-in-out_infinite]" />

          {/* center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>

          {/* orbit ring */}
          <div className="absolute inset-[-6px] rounded-full border border-[#019D91]/25 animate-[spin_6s_linear_infinite]" />
        </div>

        {/* ===== Text + scan ===== */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-800">
            Processing
          </span>

          <div className="flex items-end gap-[4px] h-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-[#019D91]/70"
                style={{
                  height: "100%",
                  animation: `scan 1.2s ease-in-out ${i * 0.12}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scoped animation */}
      <style>{`
        @keyframes scan {
          0%, 100% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
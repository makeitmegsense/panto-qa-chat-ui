import { useEffect } from "react";
import { Search } from "lucide-react";

interface Props {
  /** Called when the thinking animation duration completes */
  onComplete?: () => void;
  /** Total visible duration of the indicator (ms) */
  duration?: number;
}

/**
 * Premium, calm "Processing" thinking indicator used in QA chatbot.
 *
 * Design goals:
 * - Single clear state → "Processing"
 * - Smooth, slow micro‑animation (no jittery motion)
 * - Soft glow + animated scanning lines
 * - Minimal cognitive load
 */
export default function PremiumThinkingIndicator({
  onComplete,
  duration = 1800, // visible but not slow
}: Props) {
  /** Notify parent once animation time finishes */
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(t);
  }, [duration, onComplete]);

  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-sm bg-white/80 backdrop-blur border border-[#019D91]/10 shadow-[0_10px_30px_rgba(1,157,145,0.12)]">
      {/* ===== AI Orb ===== */}
      <div className="relative w-11 h-11 flex-shrink-0">
        {/* soft breathing glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#019D91] to-[#019D91]/60 blur-[4px] opacity-80 animate-[pulse_2.4s_ease-in-out_infinite]" />

        {/* center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>

        {/* subtle orbit ring */}
        <div className="absolute inset-[-6px] rounded-full border border-[#019D91]/25 animate-[spin_6s_linear_infinite]" />
      </div>

      {/* ===== Text + animated scan lines ===== */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-800">
          Processing
        </span>

        {/* scanning lines */}
        <div className="flex items-end gap-[4px] h-4">
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

      {/* ===== Keyframes (scoped) ===== */}
      <style>{`
        @keyframes scan {
          0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

import { motion } from "motion/react";
import { useCallback, useRef } from "react";

const LONG_PRESS_DURATION = 500;

interface Props {
  onExit: () => void;
}

export default function StealthScreen({ onExit }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = useCallback(() => {
    timerRef.current = setTimeout(() => {
      onExit();
    }, LONG_PRESS_DURATION);
  }, [onExit]);

  const cancelPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <motion.div
      data-ocid="stealth.screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black select-none"
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchCancel={cancelPress}
      aria-label="Stealth mode active. Long press to exit."
    >
      <div className="w-full h-full flex items-center justify-center">
        <span
          className="text-white/[0.04] text-[10px] font-mono tracking-widest select-none pointer-events-none"
          aria-hidden="true"
        >
          Monitoring...
        </span>
      </div>
    </motion.div>
  );
}

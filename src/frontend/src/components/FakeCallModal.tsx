import { Phone, PhoneOff } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onDismiss: () => void;
}

export default function FakeCallModal({ onDismiss }: Props) {
  return (
    <motion.div
      data-ocid="fake_call.modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Caller info */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="relative"
        >
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black border-2 border-white/20"
            style={{ background: "oklch(0.20 0.015 250)" }}
          >
            M
          </div>
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center space-y-2"
        >
          <p className="text-white/60 text-base font-semibold tracking-widest uppercase">
            Incoming Call...
          </p>
          <p className="text-white text-5xl font-black tracking-tight">Mom</p>
          <p className="text-white/40 text-sm font-mono tracking-widest">
            Mobile · +91 98765 43210
          </p>
        </motion.div>
      </div>

      {/* Call actions */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pb-16 px-8 flex justify-center gap-20"
      >
        {/* Decline */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            data-ocid="fake_call.decline_button"
            onClick={onDismiss}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="
              w-16 h-16 rounded-full flex items-center justify-center
              bg-red-600 hover:bg-red-700
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
              shadow-lg shadow-red-900/40
            "
            aria-label="Decline call"
          >
            <PhoneOff className="w-7 h-7 text-white" strokeWidth={2.5} />
          </motion.button>
          <span className="text-white/50 text-xs font-mono tracking-wider">
            DECLINE
          </span>
        </div>

        {/* Accept */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            data-ocid="fake_call.accept_button"
            onClick={onDismiss}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="
              w-16 h-16 rounded-full flex items-center justify-center
              bg-green-600 hover:bg-green-700
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400
              shadow-lg shadow-green-900/40
            "
            aria-label="Accept call"
          >
            <Phone className="w-7 h-7 text-white" strokeWidth={2.5} />
          </motion.button>
          <span className="text-white/50 text-xs font-mono tracking-wider">
            ACCEPT
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EyeOff,
  Phone,
  Shield,
  Terminal,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LogEntry } from "../backend.d.ts";
import { useAddLog, useClearLogs, useGetLogs } from "../hooks/useQueries";
import FakeCallModal from "./FakeCallModal";

interface Props {
  isNightMode: boolean;
  onActivateStealth: () => void;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function classifyLog(message: string): "sos" | "warn" | "info" | "system" {
  const m = message.toLowerCase();
  if (m.includes("sos") || m.includes("emergency") || m.includes("alerting"))
    return "sos";
  if (m.includes("⚠️") || m.includes("offline") || m.includes("🔴"))
    return "warn";
  if (m.includes("🟢") || m.includes("online")) return "info";
  return "system";
}

export default function MainScreen({ isNightMode, onActivateStealth }: Props) {
  const [isOffline, setIsOffline] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [localLogs, setLocalLogs] = useState<LogEntry[]>([]);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { data: backendLogs, isLoading: logsLoading } = useGetLogs();
  const { mutateAsync: addLogMutation } = useAddLog();
  const { mutate: clearLogsMutation, isPending: clearing } = useClearLogs();

  // Sync backend logs to local on mount / backend changes
  useEffect(() => {
    if (backendLogs) {
      setLocalLogs(backendLogs);
    }
  }, [backendLogs]);

  const addLog = useCallback(
    async (message: string) => {
      const entry: LogEntry = {
        message,
        timestamp: BigInt(Date.now()) * 1_000_000n,
      };
      // Optimistically add to local state first (newest first)
      setLocalLogs((prev) => [entry, ...prev]);
      try {
        await addLogMutation(message);
      } catch {
        // Keep local even if backend fails
      }
    },
    [addLogMutation],
  );

  const handleNetworkToggle = useCallback(() => {
    setIsOffline((prev) => {
      const next = !prev;
      addLog(
        next ? "🔴 Network offline (Mocked)" : "🟢 Network online (Mocked)",
      );
      return next;
    });
  }, [addLog]);

  const handleSOS = useCallback(() => {
    addLog("⚠️ SOS Triggered! Initiating Escalation Protocol.");

    const t1 = setTimeout(() => {
      if (isOffline) {
        addLog("📨 OFFLINE: Sending encrypted SMS to Trusted Circle.");
      } else {
        addLog("🔔 ONLINE: Pushing high-priority alert to cloud.");
      }
    }, 1000);

    const t2 = setTimeout(() => {
      addLog("🧭 Fetching GPS coordinates...");
      addLog(
        "📍 Location locked: Lat 19.0760, Lon 72.8777. Sharing live feed.",
      );
    }, 3000);

    const t3 = setTimeout(() => {
      addLog("🚨 No user cancellation. Alerting emergency services!");
    }, 5000);

    timerRefs.current.push(t1, t2, t3);
  }, [isOffline, addLog]);

  const handleFakeCall = useCallback(() => {
    addLog("📱 Fake call scheduled in 3 seconds...");
    const t = setTimeout(() => {
      setShowFakeCall(true);
    }, 3000);
    timerRefs.current.push(t);
  }, [addLog]);

  const handleClearLogs = useCallback(() => {
    setLocalLogs([]);
    clearLogsMutation();
  }, [clearLogsMutation]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  const allLogs = localLogs;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Shield className="w-6 h-6 text-sos" strokeWidth={2.5} />
              {isNightMode && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight leading-none">
                AI GUARDIAN
              </h1>
              {isNightMode && (
                <p className="text-[10px] font-mono text-amber leading-none mt-0.5 tracking-widest uppercase">
                  Night Mode Active
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            data-ocid="network.toggle"
            onClick={handleNetworkToggle}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-semibold
              transition-all duration-200 font-mono tracking-tight
              ${
                isOffline
                  ? "border-offline/40 text-offline bg-offline/10 hover:bg-offline/20"
                  : "border-online/40 text-online bg-online/10 hover:bg-online/20"
              }
            `}
            aria-label={
              isOffline ? "Switch to online mode" : "Switch to offline mode"
            }
          >
            {isOffline ? (
              <WifiOff className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <Wifi className="w-4 h-4" strokeWidth={2.5} />
            )}
            <span className="hidden sm:inline">
              {isOffline ? "OFFLINE" : "ONLINE"}
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
        {/* SOS Button */}
        <motion.button
          data-ocid="sos.primary_button"
          onClick={handleSOS}
          className="
            relative w-full rounded-2xl font-black text-sos-foreground
            bg-sos hover:bg-sos-hover
            flex flex-col items-center justify-center gap-2
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sos/50
            sos-pulse
            select-none
          "
          style={{ minHeight: "200px" }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          aria-label="Press for SOS emergency alert"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                backgroundSize: "12px 12px",
              }}
            />
          </div>
          <span className="relative text-6xl font-black tracking-tight leading-none">
            SOS
          </span>
          <span className="relative text-sm font-bold tracking-[0.2em] uppercase opacity-90">
            PRESS FOR EMERGENCY
          </span>
          <span className="relative text-xs font-mono tracking-widest opacity-70">
            ESCALATION PROTOCOL
          </span>
        </motion.button>

        {/* Secondary action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button
            data-ocid="fake_call.button"
            onClick={handleFakeCall}
            className="
              flex items-center justify-center gap-3
              px-5 py-5 rounded-xl border border-online/30
              bg-online/10 hover:bg-online/20
              text-online font-bold text-base
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-online/50
            "
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <Phone className="w-5 h-5" strokeWidth={2.5} />
            <span>Generate Fake Call</span>
          </motion.button>

          <motion.button
            data-ocid="stealth.toggle"
            onClick={onActivateStealth}
            className="
              flex items-center justify-center gap-3
              px-5 py-5 rounded-xl border border-border
              bg-secondary hover:bg-accent
              text-muted-foreground hover:text-foreground font-bold text-base
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            "
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <EyeOff className="w-5 h-5" strokeWidth={2.5} />
            <span>Activate Stealth Mode</span>
          </motion.button>
        </div>

        {/* System Logs */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-terminal-text" />
              <span className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
                System Logs
              </span>
              <span className="text-xs font-mono text-terminal-dim">
                [{allLogs.length}]
              </span>
            </div>
            <button
              type="button"
              data-ocid="clear_logs.button"
              onClick={handleClearLogs}
              disabled={clearing || allLogs.length === 0}
              className="
                flex items-center gap-1.5 px-2.5 py-1 rounded-md
                text-xs font-mono font-semibold tracking-wide
                text-muted-foreground hover:text-offline hover:bg-offline/10
                border border-border hover:border-offline/30
                transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed
              "
              aria-label="Clear all logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
          </div>

          <div
            data-ocid="logs.panel"
            className="
              relative rounded-xl overflow-hidden border border-terminal-text/20
              bg-terminal-bg scanlines
            "
            style={{ minHeight: "220px" }}
          >
            {/* Terminal header bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-terminal-text/15">
              <div className="w-2.5 h-2.5 rounded-full bg-offline/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-online/70" />
              <span className="ml-2 text-[10px] font-mono text-terminal-dim tracking-widest uppercase">
                guardian.log — live feed
              </span>
              <span className="ml-auto text-[10px] font-mono text-terminal-dim cursor-blink">
                ▮
              </span>
            </div>

            {logsLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-4 w-full bg-terminal-text/10"
                  />
                ))}
              </div>
            ) : allLogs.length === 0 ? (
              <div
                data-ocid="logs.empty_state"
                className="flex flex-col items-center justify-center h-40 gap-2"
              >
                <Terminal className="w-8 h-8 text-terminal-dim/40" />
                <p className="font-mono text-sm text-terminal-dim">
                  System initialized. Monitoring environment...
                </p>
                <p className="font-mono text-xs text-terminal-dim/60">
                  — awaiting events —
                </p>
              </div>
            ) : (
              <ScrollArea className="h-48">
                <div className="p-3 space-y-1">
                  <AnimatePresence initial={false}>
                    {allLogs.map((log, index) => (
                      <LogRow
                        key={`${log.timestamp}-${index}`}
                        log={log}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground/50 py-2">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </main>

      {/* Fake Call Modal */}
      <AnimatePresence>
        {showFakeCall && (
          <FakeCallModal onDismiss={() => setShowFakeCall(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function LogRow({ log, index }: { log: LogEntry; index: number }) {
  const type = classifyLog(log.message);
  const colorClass =
    type === "sos"
      ? "text-offline"
      : type === "warn"
        ? "text-amber"
        : type === "info"
          ? "text-online"
          : "text-terminal-text";

  return (
    <motion.div
      data-ocid={`logs.item.${index + 1}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex items-start gap-2 font-mono text-xs leading-relaxed"
    >
      <span className="text-terminal-dim shrink-0 tabular-nums pt-px">
        {formatTimestamp(log.timestamp)}
      </span>
      <span className={`${colorClass} break-all`}>{log.message}</span>
    </motion.div>
  );
}

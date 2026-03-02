import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LogEntry {
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    addLog(message: string): Promise<void>;
    clearLogs(): Promise<void>;
    getLogs(): Promise<Array<LogEntry>>;
}

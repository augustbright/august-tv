import { HealthCheckFn } from "./types";
export declare function iAmHealthy(port: number, healthIndicators?: HealthCheckFn[]): Promise<void>;

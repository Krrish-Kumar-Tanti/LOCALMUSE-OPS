/**
 * Core application types and domain models for LocalMuse Ops
 */

export interface AppConfig {
  name: string;
  description: string;
  version: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

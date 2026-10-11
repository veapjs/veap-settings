/**
 * Settings persistence port.
 */
export interface ISettingsRepository {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Injection token for the settings repository port.
 */
export const SETTINGS_REPOSITORY = Symbol.for("veap:settings:repository");

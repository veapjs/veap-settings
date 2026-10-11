import {
  CACHE_PROVIDER,
  type ICacheProvider,
  Inject,
  Injectable,
} from "@veap/kernel";
import {
  type ISettingsRepository,
  SETTINGS_REPOSITORY,
} from "../contracts/settings.repository";

/**
 * Application service for reading and writing settings.
 *
 * It depends exclusively on ports (ICacheProvider, ISettingsRepository)
 * that are injected through the constructor.
 */
@Injectable()
export class SettingsService {
  constructor(
    @Inject(CACHE_PROVIDER) private cache: ICacheProvider,
    @Inject(SETTINGS_REPOSITORY) private repository: ISettingsRepository,
  ) {}

  /**
   * Get a setting value by key.
   * @param key Setting key (e.g., "system:page")
   * @returns Value as T or null
   */
  public async get<T>(key: string): Promise<T | null> {
    const cacheKey = `settings:${key}`;
    const cached = await this.cache.get<T>(cacheKey);
    if (cached !== null) return cached;

    const value = await this.repository.get<T>(key);
    if (value !== null) {
      await this.cache.set(cacheKey, value);
    }
    return value;
  }

  /**
   * Set a setting value.
   * @param key Setting key
   * @param value JSON value
   */
  public async set(key: string, value: unknown): Promise<void> {
    await this.repository.set(key, value);
    await this.cache.set(`settings:${key}`, value);
  }

  /**
   * Remove a setting by key.
   * @param key Setting key
   */
  public async remove(key: string): Promise<void> {
    await this.repository.delete(key);
    await this.cache.delete(`settings:${key}`);
  }

  /**
   * Clear all settings.
   */
  public async clear(): Promise<void> {
    await this.repository.clear();
    await this.cache.clear();
  }
}

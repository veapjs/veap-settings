import { isDatabaseInitialized } from "@veap/database";
import { type Container, logger, ServiceProvider } from "@veap/kernel";
import { SETTINGS_REPOSITORY } from "../contracts/settings.repository";
import { runSettingsMigrations } from "../migrations";
import { ActiveRecordSettingsRepository } from "../repositories/setting.repository";
import { SettingsService } from "../services/settings.service";

export interface SettingsConfig {
  /**
   * Whether to automatically run settings database migrations during SettingsServiceProvider.boot().
   * Defaults to `true` when database connection is initialized.
   */
  autoMigrate?: boolean;
}

export class SettingsServiceProvider extends ServiceProvider {
  private config?: SettingsConfig;

  constructor(container: Container, config?: SettingsConfig) {
    super(container);
    this.config = config;
  }

  register(): void {
    this.container.register({
      token: SETTINGS_REPOSITORY,
      useClass: ActiveRecordSettingsRepository,
      singleton: true,
    });

    this.container.register({
      token: SettingsService,
      useClass: SettingsService,
      singleton: true,
    });
  }

  async boot(): Promise<void> {
    if (this.config?.autoMigrate !== false && isDatabaseInitialized()) {
      try {
        await runSettingsMigrations();
      } catch (error: any) {
        logger.warn(
          "veap:settings",
          "Automatic settings migration failed or deferred:",
          error?.message || error,
        );
      }
    }
  }
}

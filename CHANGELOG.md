# @veap/settings

## 0.1.3

### Patch Changes

- Updated dependencies []:
  - @veap/kernel@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies []:
  - @veap/kernel@0.1.2

## 0.1.1

### Patch Changes

- Audit and modernization of `@veap/settings`:
  - Native Node.js ESM compliance: added explicit `.js` extensions across all internal module imports and exports (preventing `ERR_MODULE_NOT_FOUND` in standard Node.js module loaders).
  - IoC & Port Tokens: strongly typed `SETTINGS_REPOSITORY` as `Token<ISettingsRepository>` and introduced `SETTINGS_SERVICE: Token<ISettingsService>`.
  - SettingsService API enhancements: added optional `defaultValue` parameter to `get<T>(key, defaultValue)`, `has(key): Promise<boolean>`, and `all(): Promise<Record<string, unknown>>`.
  - Module Augmentation & Composition: added `ApplicationBuilder.prototype.withSettings(config?: SettingsConfig)` and augmented `VeapConfig` with `settings?: SettingsConfig`.
  - Resilient Auto-Migration: enhanced `SettingsServiceProvider.boot()` to respect `SETTINGS_AUTO_MIGRATE` from `ConfigService` / `process.env`.
  - Test coverage expanded: added integration test coverage for database migrations (`runSettingsMigrations()`), IoC token registration, `has()`, `all()`, and `ApplicationBuilder` fluent configuration.
- Updated dependencies []:
  - @veap/database@0.1.1
  - @veap/kernel@0.1.1

## 0.1.0

### Minor Changes

- Initial public scaffold of the Veap settings.

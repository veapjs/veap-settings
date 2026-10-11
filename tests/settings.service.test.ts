import { initDatabase, Schema } from "@veap/database";
import { MemoryCacheProvider } from "@veap/kernel";
import { beforeAll, describe, expect, it } from "vitest";
import { Setting } from "../src/models";
import { ActiveRecordSettingsRepository } from "../src/repositories";
import { SettingsService } from "../src/services";

describe("@veap/settings", () => {
  let settingsService: SettingsService;
  let cache: MemoryCacheProvider;

  beforeAll(async () => {
    initDatabase({
      client: "better-sqlite3",
      connection: { filename: ":memory:" },
      useNullAsDefault: true,
    });

    const schema = new Schema();
    await schema.createTable("settings", (table) => {
      table.uuid("id");
      table.string("key").notNull().unique();
      table.text("value");
      table.timestamp("updated_at");
    });

    cache = new MemoryCacheProvider();
    const repository = new ActiveRecordSettingsRepository();
    settingsService = new SettingsService(cache, repository);
  });

  it("stores and retrieves settings via SettingsService", async () => {
    await settingsService.set("site_name", "Veap Application");

    const value = await settingsService.get<string>("site_name");
    expect(value).toBe("Veap Application");

    // Check that it cached the value
    const cached = await cache.get<string>("settings:site_name");
    expect(cached).toBe("Veap Application");
  });

  it("stores structured JSON objects", async () => {
    const config = { theme: "dark", notifications: true, maxItems: 50 };
    await settingsService.set("app_config", config);

    const retrieved = await settingsService.get<typeof config>("app_config");
    expect(retrieved).toEqual(config);
  });

  it("removes settings and clears cache entry", async () => {
    await settingsService.set("temporary_key", 12345);
    expect(await settingsService.get<number>("temporary_key")).toBe(12345);

    await settingsService.remove("temporary_key");

    expect(await settingsService.get<number>("temporary_key")).toBeNull();
    expect(await cache.get("settings:temporary_key")).toBeNull();
  });

  it("direct ActiveRecord model methods (getValue / setValue)", async () => {
    await Setting.setValue("direct_key", "direct_value");

    const val = await Setting.getValue("direct_key");
    expect(val).toBe("direct_value");

    const fallback = await Setting.getValue("non_existing", "default_fallback");
    expect(fallback).toBe("default_fallback");
  });

  it("clears all settings", async () => {
    await settingsService.clear();

    const siteName = await settingsService.get("site_name");
    expect(siteName).toBeNull();
  });
});

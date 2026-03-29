import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { onboard } from "../commands/onboard.js";
import { configExists, readConfig } from "../config/store.js";
import { resolveAgentJwtEnvFile } from "../config/env.js";

const ORIGINAL_ENV = { ...process.env };

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "paperclip-onboard-"));
}

describe("onboard --yes", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = makeTempDir();
    process.env = { ...ORIGINAL_ENV };
    // Isolate home so defaults don't interact with real ~/.paperclip
    process.env.PAPERCLIP_HOME = tempDir;
    delete process.env.PAPERCLIP_AGENT_JWT_SECRET;
    delete process.env.PAPERCLIP_SECRETS_MASTER_KEY;
    delete process.env.PAPERCLIP_SECRETS_MASTER_KEY_FILE;
    delete process.env.DATABASE_URL;
    delete process.env.PAPERCLIP_DEPLOYMENT_MODE;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("writes a valid config file and exits without starting the server", async () => {
    const configPath = path.join(tempDir, "config.json");

    await onboard({ config: configPath, yes: true });

    expect(configExists(configPath)).toBe(true);

    const config = readConfig(configPath);
    expect(config).not.toBeNull();
    expect(config!.database.mode).toBe("embedded-postgres");
    expect(config!.server.deploymentMode).toBe("local_trusted");
    expect(config!.storage.provider).toBe("local_disk");
    expect(config!.secrets.provider).toBe("local_encrypted");
    expect(config!.auth.baseUrlMode).toBe("auto");
  });

  it("uses DATABASE_URL env var to configure postgres mode", async () => {
    const configPath = path.join(tempDir, "config.json");
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/testdb";

    await onboard({ config: configPath, yes: true });

    const config = readConfig(configPath);
    expect(config).not.toBeNull();
    expect(config!.database.mode).toBe("postgres");
  });

  it("respects PAPERCLIP_DEPLOYMENT_MODE env var", async () => {
    const configPath = path.join(tempDir, "config.json");
    process.env.PAPERCLIP_DEPLOYMENT_MODE = "authenticated";

    await onboard({ config: configPath, yes: true });

    const config = readConfig(configPath);
    expect(config).not.toBeNull();
    expect(config!.server.deploymentMode).toBe("authenticated");
  });

  it("creates a .env file with PAPERCLIP_AGENT_JWT_SECRET on fresh install", async () => {
    const configPath = path.join(tempDir, "config.json");

    await onboard({ config: configPath, yes: true });

    const envFilePath = resolveAgentJwtEnvFile(configPath);
    expect(fs.existsSync(envFilePath)).toBe(true);
    const envContents = fs.readFileSync(envFilePath, "utf-8");
    expect(envContents).toContain("PAPERCLIP_AGENT_JWT_SECRET=");
  });

  it("creates a local secrets key file", async () => {
    const configPath = path.join(tempDir, "config.json");

    await onboard({ config: configPath, yes: true });

    const config = readConfig(configPath);
    const keyFilePath = config!.secrets.localEncrypted?.keyFilePath;
    expect(keyFilePath).toBeTruthy();
    expect(fs.existsSync(keyFilePath!)).toBe(true);
  });

  it("is idempotent: running twice does not throw", async () => {
    const configPath = path.join(tempDir, "config.json");

    await onboard({ config: configPath, yes: true });
    await onboard({ config: configPath, yes: true });

    expect(configExists(configPath)).toBe(true);
  });
});

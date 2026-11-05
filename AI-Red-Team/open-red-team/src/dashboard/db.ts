import Database from "better-sqlite3";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  password_salt: string;
  role: "admin" | "operator";
  must_change_password: number;
  created_at: string;
}

export interface OrtDb {
  db: Database.Database;
  getUser(username: string): UserRow | undefined;
  listUsers(): Array<Pick<UserRow, "id" | "username" | "role" | "must_change_password" | "created_at">>;
  createUser(username: string, password: string, role: "admin" | "operator", mustChange: boolean): void;
  deleteUser(username: string): boolean;
  setPassword(username: string, password: string, mustChange: boolean): void;
  verifyPassword(username: string, password: string): boolean;
  getSetting(key: string): string | undefined;
  setSetting(key: string, value: string): void;
  close(): void;
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

const MIGRATIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator',
    must_change_password INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,
];

export function migrate(db: Database.Database): void {
  const current = db.pragma("user_version", { simple: true }) as number;
  for (let v = current; v < MIGRATIONS.length; v++) {
    db.exec(MIGRATIONS[v]);
    db.pragma(`user_version = ${v + 1}`);
  }
}

export function seed(db: Database.Database): void {
  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
  if (count.n === 0) {
    const salt = randomBytes(16).toString("hex");
    db.prepare(
      "INSERT INTO users (username, password_hash, password_salt, role, must_change_password) VALUES (?, ?, ?, ?, ?)",
    ).run("admin", hashPassword("admin", salt), salt, "admin", 1);
  }
}

export function openDb(path?: string): OrtDb {
  const rawPath = path ?? process.env.ORT_DB_PATH ?? "./data/ort.db";
  const dbPath = rawPath === ":memory:" ? ":memory:" : resolve(rawPath);
  if (dbPath !== ":memory:") mkdirSync(dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  migrate(db);
  seed(db);

  const getUserStmt = db.prepare("SELECT * FROM users WHERE username = ?");

  return {
    db,
    getUser(username: string): UserRow | undefined {
      return getUserStmt.get(username) as UserRow | undefined;
    },
    createUser(username: string, password: string, role: "admin" | "operator", mustChange: boolean): void {
      const salt = randomBytes(16).toString("hex");
      db.prepare(
        "INSERT INTO users (username, password_hash, password_salt, role, must_change_password) VALUES (?, ?, ?, ?, ?)",
      ).run(username, hashPassword(password, salt), salt, role, mustChange ? 1 : 0);
    },
    listUsers(): Array<Pick<UserRow, "id" | "username" | "role" | "must_change_password" | "created_at">> {
      return db
        .prepare("SELECT id, username, role, must_change_password, created_at FROM users ORDER BY id")
        .all() as Array<Pick<UserRow, "id" | "username" | "role" | "must_change_password" | "created_at">>;
    },
    deleteUser(username: string): boolean {
      const info = db.prepare("DELETE FROM users WHERE username = ?").run(username);
      return info.changes > 0;
    },
    setPassword(username: string, password: string, mustChange: boolean): void {
      const salt = randomBytes(16).toString("hex");
      db.prepare(
        "UPDATE users SET password_hash = ?, password_salt = ?, must_change_password = ? WHERE username = ?",
      ).run(hashPassword(password, salt), salt, mustChange ? 1 : 0, username);
    },
    verifyPassword(username: string, password: string): boolean {
      const user = getUserStmt.get(username) as UserRow | undefined;
      if (!user) return false;
      const candidate = Buffer.from(hashPassword(password, user.password_salt), "hex");
      const stored = Buffer.from(user.password_hash, "hex");
      return candidate.length === stored.length && timingSafeEqual(candidate, stored);
    },
    getSetting(key: string): string | undefined {
      const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
        | { value: string }
        | undefined;
      return row?.value;
    },
    setSetting(key: string, value: string): void {
      db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(
        key,
        value,
      );
    },
    close(): void {
      db.close();
    },
  };
}

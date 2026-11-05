import { describe, expect, it } from "vitest";
import { openDb } from "../src/dashboard/db.js";

describe("OrtDb", () => {
  it("seeds the default admin/admin account with forced password change", () => {
    const ort = openDb(":memory:");
    try {
      const admin = ort.getUser("admin");
      expect(admin).toBeDefined();
      expect(admin!.role).toBe("admin");
      expect(admin!.must_change_password).toBe(1);
      expect(ort.verifyPassword("admin", "admin")).toBe(true);
      expect(ort.verifyPassword("admin", "wrong")).toBe(false);
    } finally {
      ort.close();
    }
  });

  it("stores and retrieves settings", () => {
    const ort = openDb(":memory:");
    try {
      expect(ort.getSetting("ORT_SCOPE")).toBeUndefined();
      ort.setSetting("ORT_SCOPE", "pentest of demo.example.com");
      expect(ort.getSetting("ORT_SCOPE")).toBe("pentest of demo.example.com");
      ort.setSetting("ORT_SCOPE", "updated scope");
      expect(ort.getSetting("ORT_SCOPE")).toBe("updated scope");
    } finally {
      ort.close();
    }
  });

  it("setPassword clears the forced-change flag", () => {
    const ort = openDb(":memory:");
    try {
      ort.setPassword("admin", "new-password-123", false);
      expect(ort.verifyPassword("admin", "new-password-123")).toBe(true);
      expect(ort.verifyPassword("admin", "admin")).toBe(false);
      expect(ort.getUser("admin")!.must_change_password).toBe(0);
    } finally {
      ort.close();
    }
  });

  it("creates users with roles", () => {
    const ort = openDb(":memory:");
    try {
      ort.createUser("alice", "alice-pass-123", "operator", true);
      expect(ort.getUser("alice")?.role).toBe("operator");
      expect(ort.getUser("alice")?.must_change_password).toBe(1);
      expect(ort.verifyPassword("alice", "alice-pass-123")).toBe(true);
    } finally {
      ort.close();
    }
  });

  it("lists and deletes users", () => {
    const ort = openDb(":memory:");
    try {
      ort.createUser("alice", "alice-pass-123", "operator", true);
      const users = ort.listUsers();
      expect(users.map((u) => u.username)).toContain("admin");
      expect(users.map((u) => u.username)).toContain("alice");
      expect(ort.deleteUser("alice")).toBe(true);
      expect(ort.deleteUser("alice")).toBe(false);
      expect(ort.getUser("alice")).toBeUndefined();
    } finally {
      ort.close();
    }
  });
});

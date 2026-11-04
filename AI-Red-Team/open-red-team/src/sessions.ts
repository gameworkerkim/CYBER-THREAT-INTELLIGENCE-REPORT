import type { ChatMessage } from "./types.js";

export interface ChatSession {
  id: string;
  operator: string;
  history: ChatMessage[];
  createdAt: number;
  lastUsedAt: number;
  access: number;
}

const DEFAULT_MAX_SESSIONS = 200;
const DEFAULT_IDLE_MS = 12 * 60 * 60 * 1000;

export class SessionStore {
  private sessions = new Map<string, ChatSession>();
  private readonly max: number;
  private readonly idleMs: number;
  private counter = 0;

  constructor(opts?: { max?: number; idleMs?: number }) {
    this.max = opts?.max ?? DEFAULT_MAX_SESSIONS;
    this.idleMs = opts?.idleMs ?? DEFAULT_IDLE_MS;
  }

  create(operator: string): ChatSession {
    this.evict(1);
    const session: ChatSession = {
      id: `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`,
      operator,
      history: [],
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      access: ++this.counter,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): ChatSession | undefined {
    this.evict(0);
    const session = this.sessions.get(id);
    if (!session) return undefined;
    session.lastUsedAt = Date.now();
    session.access = ++this.counter;
    return session;
  }

  reset(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    session.history = [];
    return true;
  }

  size(): number {
    return this.sessions.size;
  }

  private evict(room: number): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.lastUsedAt > this.idleMs) this.sessions.delete(id);
    }
    const limit = this.max - room;
    while (this.sessions.size > limit) {
      let oldestId: string | undefined;
      let oldestAccess = Infinity;
      for (const [id, session] of this.sessions) {
        if (session.access < oldestAccess) {
          oldestAccess = session.access;
          oldestId = id;
        }
      }
      if (oldestId === undefined) break;
      this.sessions.delete(oldestId);
    }
  }
}

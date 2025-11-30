import { randomUUID } from 'crypto';

export interface Session {
    id: string;
    alias: string;
    accessKey: string;
    secretKey: string;
    endpoint: string;
    createdAt: Date;
}

// In-memory store (use Redis for production multi-instance)
const sessions = new Map<string, Session>();

export function createSession(accessKey: string, secretKey: string, endpoint: string): Session {
    const id = randomUUID();
    const alias = `session_${id.replace(/-/g, '').slice(0, 12)}`;

    const session: Session = {
        id,
        alias,
        accessKey,
        secretKey,
        endpoint,
        createdAt: new Date(),
    };

    sessions.set(id, session);
    return session;
}

export function getSession(id: string): Session | undefined {
    return sessions.get(id);
}

export function deleteSession(id: string): boolean {
    return sessions.delete(id);
}

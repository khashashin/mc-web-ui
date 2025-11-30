import { spawn } from 'child_process';
import * as Minio from 'minio';
import { Session } from './session.js';

export interface McResult {
    success: boolean;
    data?: any;
    error?: string;
}

interface IMcClient {
    listBuckets(): Promise<McResult>;
    createBucket(name: string): Promise<McResult>;
    deleteBucket(name: string, force?: boolean): Promise<McResult>;
    listObjects(bucket: string, prefix?: string): Promise<McResult>;
}

class McClientSdk implements IMcClient {
    private client: Minio.Client;

    constructor(session: Session) {
        const url = new URL(session.endpoint);
        const useSSL = url.protocol === 'https:';
        const port = url.port ? parseInt(url.port) : (useSSL ? 443 : 80);

        this.client = new Minio.Client({
            endPoint: url.hostname,
            port: port,
            useSSL: useSSL,
            accessKey: session.accessKey,
            secretKey: session.secretKey
        });
    }

    async listBuckets(): Promise<McResult> {
        try {
            const buckets = await this.client.listBuckets();
            // Map SDK format to match CLI format if necessary, or just return as is
            // CLI: { name: string, creationDate: string, size: number }
            // SDK: { name: string, creationDate: Date }
            const data = buckets.map(b => ({
                name: b.name,
                creationDate: b.creationDate,
                size: 0 // SDK doesn't return size in listBuckets
            }));
            return { success: true, data };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async createBucket(name: string): Promise<McResult> {
        try {
            await this.client.makeBucket(name);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async deleteBucket(name: string, force = false): Promise<McResult> {
        try {
            if (force) {
                // Recursive delete not directly supported by single call in SDK, 
                // need to list and remove objects first.
                // For simplicity in this iteration, we might just try removeBucket
                // and if it fails with non-empty, we error out unless we implement recursive delete.
                // Let's implement a basic recursive delete.
                const objectsList = [];
                const stream = this.client.listObjects(name, '', true);

                for await (const obj of stream) {
                    objectsList.push(obj.name);
                }

                if (objectsList.length > 0) {
                    await this.client.removeObjects(name, objectsList as string[]);
                }
            }
            await this.client.removeBucket(name);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async listObjects(bucket: string, prefix = ''): Promise<McResult> {
        try {
            const objects = [];
            const stream = this.client.listObjects(bucket, prefix, false);
            for await (const obj of stream) {
                objects.push(obj);
            }
            return { success: true, data: objects };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }
}

class McClientCli implements IMcClient {
    private alias: string;

    constructor(session: Session) {
        this.alias = session.alias;
    }

    async listBuckets(): Promise<McResult> {
        return McClientCli.execute(['ls', '--json', this.alias]);
    }

    async createBucket(name: string): Promise<McResult> {
        return McClientCli.execute(['mb', `${this.alias}/${name}`]);
    }

    async deleteBucket(name: string, force = false): Promise<McResult> {
        const args = force
            ? ['rb', '--force', `${this.alias}/${name}`]
            : ['rb', `${this.alias}/${name}`];
        return McClientCli.execute(args);
    }

    async listObjects(bucket: string, prefix = ''): Promise<McResult> {
        const path = prefix
            ? `${this.alias}/${bucket}/${prefix}`
            : `${this.alias}/${bucket}`;
        return McClientCli.execute(['ls', '--json', path]);
    }

    private static execute(args: string[]): Promise<McResult> {
        return new Promise((resolve) => {
            const proc = spawn('mc', args);
            let stdout = '';
            let stderr = '';

            proc.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            proc.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            proc.on('close', (code) => {
                if (code === 0) {
                    const lines = stdout.trim().split('\n').filter(Boolean);
                    const data = lines.map(line => {
                        try {
                            return JSON.parse(line);
                        } catch {
                            return line;
                        }
                    });
                    resolve({ success: true, data });
                } else {
                    resolve({ success: false, error: stderr || 'Command failed' });
                }
            });

            proc.on('error', (err) => {
                resolve({ success: false, error: err.message });
            });
        });
    }
}

export class McClient {
    private client: IMcClient;

    constructor(session: Session) {
        if (process.env.NODE_ENV === 'development') {
            this.client = new McClientSdk(session);
        } else {
            this.client = new McClientCli(session);
        }
    }

    static async verifyCredentials(
        alias: string,
        endpoint: string,
        accessKey: string,
        secretKey: string
    ): Promise<McResult> {
        if (process.env.NODE_ENV === 'development') {
            try {
                const url = new URL(endpoint);
                const useSSL = url.protocol === 'https:';
                const port = url.port ? parseInt(url.port) : (useSSL ? 443 : 80);

                const client = new Minio.Client({
                    endPoint: url.hostname,
                    port: port,
                    useSSL: useSSL,
                    accessKey: accessKey,
                    secretKey: secretKey
                });

                await client.listBuckets();
                return { success: true };
            } catch (err: any) {
                return { success: false, error: err.message };
            }
        } else {
            return new Promise((resolve) => {
                const proc = spawn('mc', [
                    'alias', 'set', alias, endpoint, accessKey, secretKey
                ]);

                proc.on('close', (code) => {
                    if (code === 0) {
                        resolve({ success: true });
                    } else {
                        resolve({ success: false, error: 'Failed to set alias' });
                    }
                });

                proc.on('error', (err) => {
                    resolve({ success: false, error: err.message });
                });
            });
        }
    }

    async listBuckets() { return this.client.listBuckets(); }
    async createBucket(name: string) { return this.client.createBucket(name); }
    async deleteBucket(name: string, force = false) { return this.client.deleteBucket(name, force); }
    async listObjects(bucket: string, prefix = '') { return this.client.listObjects(bucket, prefix); }
}

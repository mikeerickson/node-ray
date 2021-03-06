import { existsSync } from 'fs';
import { Client } from './Client';
import { FileContentsPayload } from './Payloads/FileContentsPayload';
import { ImagePayload } from './Payloads/ImagePayload';
import { NodeMeasurePayload } from './Payloads/NodeMeasurePayload';
import { Ray as BaseRay } from './Ray';
import { SettingsFactory } from './Settings/SettingsFactory';
import { NodeStopwatch } from './Stopwatch/NodeStopwatch';

export class Ray extends BaseRay {
    public static create(client: Client | null = null, uuid: string | null = null): Ray {
        const settings = SettingsFactory.createFromConfigFile();

        return new this(settings, client, uuid);
    }

    public die(status = ''): void {
        if (status.length) {
            console.error(status);
        }

        process.exit(-1);
    }

    public file(filename: string): this {
        const payload = new FileContentsPayload(filename);

        return this.sendRequest(payload);
    }

    public image(location: string): this {
        if (existsSync(location)) {
            location = `file://${location}`;
        }

        const payload = new ImagePayload(location);

        return this.sendRequest(payload);
    }

    protected getStopwatch(name: string): NodeStopwatch {
        return new NodeStopwatch(name);
    }

    protected getMeasurePayload(name: string, event: any): any {
        return new NodeMeasurePayload(name, event);
    }
}

export const ray = (...args: any[]) => {
    return Ray.create().send(...args);
};

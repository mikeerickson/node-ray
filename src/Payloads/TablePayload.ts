import { Payload } from '../Payloads/Payload';
import { ArgumentConverter } from '../ArgumentConverter';

export class TablePayload extends Payload {
    protected values: Record<string | number, unknown> | any[];

    protected label: string;

    public constructor(values: Record<string | number, unknown> | any[], label = 'Table') {
        super();

        this.values = values;

        this.label = label;
    }

    public getType(): string {
        return 'table';
    }

    public getContent(): Record<string, unknown> {
        const values = this.getValues();

        return {
            values: values,
            label: this.label,
        };
    }

    protected getValues(): any {
        if (Array.isArray(this.values)) {
            return this.values.map((item: any) => {
                return ArgumentConverter.convertToPrimitive(item).value;
            });
        }
        const values: Record<string | number, unknown> = {};

        for (const prop in this.values) {
            values[prop] = ArgumentConverter.convertToPrimitive(this.values[prop]).value;
        }

        return values;
    }
}

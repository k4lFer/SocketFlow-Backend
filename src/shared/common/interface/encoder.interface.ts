export abstract class IEncoder
{
    abstract encode(value: string): Promise<string>;
    abstract compare(value: string, encodedValue: string): Promise<boolean>;
}
export class Chat {
  constructor(
    public readonly id: string,
    public readonly isGroup: boolean,
    public readonly members: string[],
    public readonly name?: string,
    public readonly createdAt?: Date
  ) {}
}

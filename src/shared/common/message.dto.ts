export class MessageDto
{
    type: string;
    content: string | string[];
    constructor(type: string, content: string | string[])
    {
        this.type = type;
        this.content = content;
    }
}
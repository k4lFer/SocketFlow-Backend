export class UserCreateInput {
    username: string;
    email: string;
    password: string;
    firstName?: string | null;
    lastName?: string | null;
}
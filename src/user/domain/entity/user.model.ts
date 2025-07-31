export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public email: string,
    public password: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public bio?: string | null 
  ) {}

  static create(data: {
    username: string;
    email: string;
    password: string;
    firstName?: string | null;
    lastName?: string | null;
  }): User {
    return new User(
      crypto.randomUUID(),
      data.username,
      data.email,
      data.password,
      data.firstName ?? null,
      data.lastName ?? null,
      null, // bio
    );
  }
  // Methoad Patch by bio, username, lastname, firstname and email
  static patch(user: User, data: Partial<User>): User {
    return new User(
      user.id,
      data.username ?? user.username,
      data.email ?? user.email,
      user.password, // no se modifica el password
      data.firstName ?? user.firstName,
      data.lastName ?? user.lastName,
      data.bio ?? user.bio
    );
  }


}

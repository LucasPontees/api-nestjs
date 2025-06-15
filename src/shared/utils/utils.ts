import * as bcrypt from 'bcrypt';

export class Utils {
  public static generateUUID(): string {
    return crypto.randomUUID();
  }

  public static encryptPassword(password: string): string {
    const salt = this.generateSalt();
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  }

  public static comparePasswords(
    password: string,
    hashedPassword: string,
  ): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  public static generateSalt(): string {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    return salt;
  }
}

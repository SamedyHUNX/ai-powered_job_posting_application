import bcrypt from 'bcrypt';

export function capitalizeString(string: String) {
  if (typeof string !== 'string' || string.length === 0) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = Number(process.env.SALT) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

import { compare, hash } from 'bcrypt';

export async function newUser(registerUser: RegisterUser): Promise<User> {
    try {
        const hashedPassword = await hash(registerUser.password, 10);

        return {
            username: registerUser.username,
            passwordHash: hashedPassword,
        };
    } catch {
        throw new Error('create new user failed');
    }
}

export function validatePassword(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
}

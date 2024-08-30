import { compare, hash } from 'bcrypt';

async function newUser(registerUser: RegisterUser): Promise<User> {
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

function validatePassword(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
}

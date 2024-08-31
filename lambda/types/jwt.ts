import * as jwt from 'jsonwebtoken';

export function createToken(user: User): string {
    const claims: jwt.JwtPayload = {
        user: user.username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const token = jwt.sign(claims, 'secret', {
        expiresIn: '1h',
        algorithm: 'HS256',
    });

    return token;
}

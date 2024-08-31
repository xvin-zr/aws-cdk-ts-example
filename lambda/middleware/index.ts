import {
    APIGatewayProxyEventHeaders,
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
} from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

type NextFunc = (req: APIGatewayProxyEventV2) => APIGatewayProxyResultV2;

export function validateJWTMiddleware(next: NextFunc): NextFunc {
    return function (req: APIGatewayProxyEventV2) {
        // extract token from headers
        const tokenStr = extractTokenFromHeaders(req.headers);
        if (!tokenStr) {
            return {
                statusCode: 401,
                body: 'Missing Auth Token',
            };
        }

        // parse our token for its payload
        try {
            const token = parseToken(tokenStr);
            const expires = token.exp ?? 0;
            if (expires < Date.now() / 1000) {
                return {
                    statusCode: 401,
                    body: 'Token expired',
                };
            }

            return next(req);
        } catch {
            return {
                statusCode: 401,
                body: 'User unauthorized',
            };
        }
    };
}

function extractTokenFromHeaders(headers: APIGatewayProxyEventHeaders): string {
    const authHeader = headers['Authorization'];

    const splitToken = authHeader?.split('Bearer ') ?? [];
    if (splitToken.length !== 2) {
        return '';
    }

    return splitToken[1];
}

function parseToken(tokenStr: string): jwt.JwtPayload {
    try {
        // parse token
        const token = jwt.verify(tokenStr, 'secret') as jwt.JwtPayload;
        return token;
    } catch {
        throw new Error('Invalid Token');
    }
}

import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResult,
    APIGatewayProxyResultV2,
} from 'aws-lambda';
import { loginUser, registerUserHandler } from './api';
import { validateJWTMiddleware } from './middleware';

/**
 * Take in a payload and something with it
 */
// async function handleRequest(event: MyEvent) {
//     if (!event.username) {
//         return {
//             statusCode: 400,
//             headers: { 'Content-Type': 'text/plain' },
//             body: JSON.stringify({
//                 message: `username cannot be empty`,
//             }),
//         };
//     }

//     return {
//         statusCode: 200,
//         headers: { 'Content-Type': 'text/plain' },
//         body: JSON.stringify({
//             message: `Successfully called by ${event.username}`,
//         }),
//     };
// }

// export { registerUserHandler } from './api';

export async function handleRequest(
    req: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    switch (req.rawPath) {
        case '/register':
            return await registerUserHandler(req);
        case '/login':
            return await loginUser(req);
        case '/protected':
            return validateJWTMiddleware(protectedHandler)(req);
        default:
            return {
                statusCode: 404,
                body: 'Not Found',
            };
    }
}

function protectedHandler(
    req: APIGatewayProxyEventV2
): APIGatewayProxyResultV2 {
    return {
        statusCode: 200,
        body: 'This is a secret path',
    };
}

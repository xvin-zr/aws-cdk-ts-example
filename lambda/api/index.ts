import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import ddb from '../database';
import { createToken } from '../types/jwt';
import { newUser, validatePassword } from '../types/new-user';

export async function loginUser(
    req: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    try {
        const loginReq = JSON.parse(req.body ?? '{}') as LoginRequest;
        if (!loginReq.username || !loginReq.password) {
            return {
                statusCode: 400,
                body: 'Invalid request',
            };
        }

        const user = await ddb.getUser(loginReq.username);

        const validPass = await validatePassword(
            loginReq.password,
            user.passwordHash
        );
        if (!validPass) {
            return {
                statusCode: 400,
                body: 'Invalid user credentials',
            };
        }

        const accessToken = createToken(user);
        const successMsg = `{"access_token": "${accessToken}"}`;

        return {
            statusCode: 200,
            body: successMsg,
        };
    } catch {
        return {
            body: 'Internal server error',
            statusCode: 500,
        };
    }
}

export async function registerUserHandler(
    req: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
    try {
        const registerUser = JSON.parse(req.body ?? '{}') as RegisterUser;

        if (!registerUser.username || !registerUser.password) {
            return {
                statusCode: 400,
                body: 'Invalid request: fields empty',
            };
        }

        const userExists = await ddb.isUserExist(registerUser.username);
        if (userExists) {
            return {
                statusCode: 400,
                body: 'a user with that username already exists',
            };
        }

        const user = await newUser(registerUser);

        await ddb.insertUser(user);
        return {
            statusCode: 200,
            body: 'Successfully registered user',
        };
    } catch {
        return {
            body: 'Internal server error',
            statusCode: 500,
        };
    }
}

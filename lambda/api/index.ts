import ddb from '../database';

export async function registerUserHandler(event: RegisterUser) {
    if (!event.username || !event.password) {
        return {
            statusCode: 400,
            message: 'request has empty parameters',
        };
    }

    const userExists = await ddb.isUserExist(event.username);
    if (userExists) {
        return {
            statusCode: 400,
            message: 'a user with that username already exists',
        };
    }

    // we know that user not exist

    await ddb.insertUser(event);
    return {
        statusCode: 200,
        message: 'inserted successfully',
    };
}

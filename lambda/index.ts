type MyEvent = {
    username: string;
};

/**
 * Take in a payload and something with it
 */
async function handleRequest(event: MyEvent) {
    if (!event.username) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                message: `username cannot be empty`,
            }),
        };
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            message: `Successfully called by ${event.username}`,
        }),
    };
}

export { registerUserHandler } from './api';

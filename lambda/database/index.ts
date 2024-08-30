import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'userTable';

export async function isUserExist(username: string): Promise<boolean> {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            username,
        },
    });

    const resp = await docClient.send(command);

    if (!resp.Item) {
        return false;
    } else return true;
}

export async function insertUser(user: User) {
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            username: user.username,
            password: user.passwordHash,
        },
    });

    await docClient.send(command);
}

export async function getUser(username: string): Promise<User> {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            username,
        },
    });

    const resp = await docClient.send(command);

    if (resp.Item === undefined) {
        throw new Error('user not found');
    }

    return {
        username: resp.Item.username,
        passwordHash: resp.Item.password,
    };
}

const ddb: UserStore = {
    isUserExist,
    insertUser,
    getUser,
};

interface UserStore {
    isUserExist: (username: string) => Promise<boolean>;
    insertUser: (user: User) => Promise<void>;
    getUser: (username: string) => Promise<User>;
}

export default ddb;

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

export async function insertUser(user: RegisterUser) {
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            username: user.username,
            password: user.password,
        },
    });

    await docClient.send(command);
}

const ddb: UserStore = {
    isUserExist,
    insertUser,
};

interface UserStore {
    isUserExist: (username: string) => Promise<boolean>;
    insertUser: (user: RegisterUser) => Promise<void>;
}

export default ddb;

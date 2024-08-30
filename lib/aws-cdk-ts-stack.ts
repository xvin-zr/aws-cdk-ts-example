import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class AwsCdkTsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // create DB table here

        const table = new dynamodb.TableV2(this, 'MyUserTable', {
            partitionKey: {
                name: 'username',
                type: dynamodb.AttributeType.STRING,
            },
            tableName: 'userTable',
        });

        const handlerFunction = new lambda.Function(this, 'MyLambdaFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'index.registerUserHandler',
        });

        table.grantReadWriteData(handlerFunction);
    }
}

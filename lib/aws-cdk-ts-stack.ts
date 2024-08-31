import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apiga from 'aws-cdk-lib/aws-apigateway';

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

        const api = new apiga.RestApi(this, 'MyAPIGateway', {
            defaultCorsPreflightOptions: {
                allowHeaders: ['Content-Type', 'Authorization'],
                allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowOrigins: ['*'],
            },
            deployOptions: {
                loggingLevel: apiga.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            endpointConfiguration: {
                types: [apiga.EndpointType.REGIONAL],
            },
            // cloudWatchRole: true,
        });

        const handlerFunction = new lambda.Function(this, 'MyLambdaFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'index.handleRequest',
        });

        table.grantReadWriteData(handlerFunction);

        const integration = new apiga.LambdaIntegration(handlerFunction);

        // Define the routes
        const registerResource = api.root.addResource('register');
        registerResource.addMethod('POST', integration);

        const loginResource = api.root.addResource('login');
        loginResource.addMethod('POST', integration);

        const protectedResource = api.root.addResource('protected');
        protectedResource.addMethod('GET', integration);
    }
}

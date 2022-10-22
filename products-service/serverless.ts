import type { AWS } from '@serverless/typescript';

import createProduct from '@functions/createProduct';
import getProductById from '@functions/getProductById';
import getProductsList from '@functions/getProductsList';
import { dynamoDBResources } from 'src/db/configResources';

const serverlessConfiguration: AWS = {
  service: "products-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "dev",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*"],
            Resource: [
              "arn:aws:dynamodb:${aws:region}:*:table/products",
              "arn:aws:dynamodb:${aws:region}:*:table/stocks",
            ]
          },
        ]
      }
    }

  },
  // import the function via paths
  functions: { createProduct, getProductById, getProductsList },
  resources: {
    Resources: dynamoDBResources,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;

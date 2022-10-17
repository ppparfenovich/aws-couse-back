import { TABLE_NAMES } from "src/utils/constants";

export const dynamoDBResources = {
  ProductsTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: TABLE_NAMES.PRODUCTS,
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
  StocksTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: TABLE_NAMES.STOCKS,
      AttributeDefinitions: [
        {
          AttributeName: 'product_id',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'product_id',
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
}
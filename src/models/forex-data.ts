namespace Models {
  const AWS = require("../config/aws");
  const { DocumentClient } = require("aws-sdk/clients/dynamodb");

  export interface ForexDataType {
    symbol: string;
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }

  export class ForexData implements ForexDataType {
    static readonly TABLE_NAME = "ForexData";

    constructor(
      public symbol: string,
      public timestamp: string,
      public open: number,
      public high: number,
      public low: number,
      public close: number,
      public volume: number
    ) {
    }

    async save() {
      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      const params: typeof DocumentClient.PutItemInput = {
        TableName: ForexData.TABLE_NAME,
        Item: {
          symbol: this.symbol,
          timestamp: this.timestamp,
          open: this.open,
          high: this.high,
          low: this.low,
          close: this.close,
          volume: this.volume,
        },
      };

      try {
        await dynamoDB.put(params).promise();
        console.log("ForexData saved to DynamoDB successfully.");
      } catch (err) {
        console.error("Unable to save ForexData to DynamoDB:", err);
      }
    }

    static async saveMany(data: ForexData[]) {
      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      const params: typeof DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [ForexData.TABLE_NAME]: data.map((item) => ({
            PutRequest: {
              Item: {
                symbol: item.symbol,
                timestamp: item.timestamp,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
              },
            },
          })),
        },
      };

      try {
        await dynamoDB.batchWrite(params).promise();
        console.log("ForexData saved to DynamoDB successfully.");
      } catch (err) {
        console.error("Unable to save ForexData to DynamoDB:", err);
      }
    }
  }
}

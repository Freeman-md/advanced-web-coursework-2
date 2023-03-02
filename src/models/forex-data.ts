import moment from 'moment';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dynamodb } from "../config/aws";
import { ObjectHelper } from '../helpers';

export interface ForexDataType {
  symbol: string;
  timestamp: moment.Moment;
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
    public timestamp: moment.Moment,
    public open: number,
    public high: number,
    public low: number,
    public close: number,
    public volume: number
  ) {}

  toJSON() {
    return {
      symbol: this.symbol,
      timestamp: this.timestamp,
      open: this.open,
      high: this.high,
      low: this.low,
      close: this.close,
      volume: this.volume,
    };
  }

  async save() {
    const params: DocumentClient.PutItemInput = {
      TableName: ForexData.TABLE_NAME,
      Item: this.toJSON(),
    };

    try {
      await dynamodb.put(params).promise();
      console.log("ForexData saved to DynamoDB successfully.");
    } catch (err) {
      console.error("Unable to save ForexData to DynamoDB:", err);
    }
  }

  static async saveMany(data: ForexData[]) {
    const batches = ObjectHelper.chunkArray(data, 20);

    try {
      for (const batch of batches) {
        const params: DocumentClient.BatchWriteItemInput = {
          RequestItems: {
            [ForexData.TABLE_NAME]: batch.map((item) => ({
              PutRequest: {
                Item: ObjectHelper.toJSON(item),
              },
            })),
          },
        };
  
        await dynamodb.batchWrite(params).promise();

        console.log("ForexData saved to DynamoDB successfully.");
      }
    } catch (err) {
      console.error("Unable to save ForexData to DynamoDB:", err);
    }
  }

  static fromJSON(json: any): ForexData {
    return new ForexData(
      json.symbol,
      json.timestamp,
      json.open,
      json.high,
      json.low,
      json.close,
      json.volume
    );
    }
}

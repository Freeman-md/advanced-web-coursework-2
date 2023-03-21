import moment from "moment";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dynamodb } from "../config/aws";
import { ObjectHelper } from "../helpers";

export interface NewsDataType {
  title: string,
  symbol: string;
  url: string;
  authors: Array<string>;
  image: string;
  source_domain: string;
  topics: Array<string>;
  summary: string;
  timestamp: moment.Moment;
}

export class NewsData implements NewsDataType {
  static readonly TABLE_NAME = "NewsData";

  constructor(
    public title: string,
    public symbol: string,
    public url: string,
    public authors: Array<string>,
    public image: string,
    public source_domain: string,
    public topics: Array<string>,
    public summary: string,
    public timestamp: moment.Moment
  ) {}

  toJSON() {
    return {
      title: this.title,
      symbol: this.symbol,
      url: this.url,
      authors: this.authors,
      image: this.image,
      source_domain: this.source_domain,
      topics: this.topics,
      summary: this.summary,
      timestamp: this.timestamp,
    };
  }

  async save() {
    const params: DocumentClient.PutItemInput = {
      TableName: NewsData.TABLE_NAME,
      Item: this.toJSON(),
    };

    try {
      await dynamodb.put(params).promise();
      console.log("NewsData saved to DynamoDB successfully.");
    } catch (err) {
      console.error("Unable to save NewsData to DynamoDB:", err);
    }
  }

  static async saveMany(data: NewsData[]) {
    const batches = ObjectHelper.chunkArray(data, 20);

    try {
      for (const batch of batches) {
        const params: DocumentClient.BatchWriteItemInput = {
          RequestItems: {
            [NewsData.TABLE_NAME]: batch.map((item) => ({
              PutRequest: {
                Item: ObjectHelper.toJSON(item),
              },
            })),
          },
        };

        await dynamodb.batchWrite(params).promise();

        console.log("NewsData saved to DynamoDB successfully.");
      }
    } catch (err) {
      console.error("Unable to save NewsData to DynamoDB:", err);
    }
  }

  static fromJSON(json: any): NewsData {
    return new NewsData(
      json.title,
      json.symbol,
      json.url,
      json.authors,
      json.image,
      json.source_domain,
      json.topics,
      json.summary,
      json.timestamp
    );
  }
}

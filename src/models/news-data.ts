namespace Models {
  const moment = require("moment");
  const AWS = require("../config/aws");
  const { DocumentClient } = require("aws-sdk/clients/dynamodb");

  export interface NewsDataType {
    title: string;
    url: string;
    authors: Array<string>;
    image: string;
    source_domain: string;
    topics: Array<string>;
    summary: string;
    time_published: typeof moment.Moment;
  }

  export class NewsData implements NewsDataType {
    static readonly TABLE_NAME = "NewsData";

    constructor(
      public title: string,
      public url: string,
      public authors: Array<string>,
      public image: string,
      public source_domain: string,
      public topics: Array<string>,
      public summary: string,
      public time_published: typeof moment.Moment
    ) {}

    async save() {
      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      const params: typeof DocumentClient.PutItemInput = {
        TableName: NewsData.TABLE_NAME,
        Item: {
          title: this.title,
          url: this.url,
          authors: this.authors,
          image: this.image,
          source_domain: this.source_domain,
          topics: this.topics,
          summary: this.summary,
          time_published: this.time_published,
        },
      };

      try {
        await dynamoDB.put(params).promise();
        console.log("NewsData saved to DynamoDB successfully.");
      } catch (err) {
        console.error("Unable to save NewsData to DynamoDB:", err);
      }
    }

    static async saveMany(data: NewsData[]) {
      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      const params: typeof DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [NewsData.TABLE_NAME]: data.map((item) => ({
            PutRequest: {
              Item: {
                title: item.title,
                url: item.url,
                authors: item.authors,
                image: item.image,
                source_domain: item.source_domain,
                topics: item.topics,
                summary: item.summary,
                time_published: item.time_published,
              },
            },
          })),
        },
      };

      try {
        await dynamoDB.batchWrite(params).promise();
        console.log("NewsData saved to DynamoDB successfully.");
      } catch (err) {
        console.error("Unable to save NewsData to DynamoDB:", err);
      }
    }
  }
}

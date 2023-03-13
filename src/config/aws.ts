import AWS from "aws-sdk";
import dotenv from "dotenv";
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

dotenv.config()

const serviceConfigOptions : ServiceConfigurationOptions = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
}

AWS.config.update(serviceConfigOptions);

export const dynamodb = new AWS.DynamoDB.DocumentClient()

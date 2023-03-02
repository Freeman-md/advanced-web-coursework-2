import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import moment from "moment";

import { ObjectHelper } from "./../helpers";

dotenv.config();

export default class AlphaVantageService {
  baseUrl: string = "https://www.alphavantage.co/query";
  apiKey: string = process.env.ALPHA_VANTAGE_API_KEY!;

  // get intraday time series of the forex data
  async getIntraDayDataSeries(
    symbol: string = "EURUSD",
    interval: string = "1min"
  ): Promise<AxiosResponse<any, any>> {
    const url: string = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;

    console.log("[Alpha Vantage] GET IntraDay Forex Data: " + url);

    return await axios.get(url);
  }

  async getMarketSentiments(
    category: string = "NEWS_SENTIMENT",
    tickers: string = "COIN,CRYPTO:BTC,FOREX:USD",
    topics: string = "blockchain,technology,finance"
  ): Promise<AxiosResponse<any, any>> {
    const url: string = `${this.baseUrl}?function=${category}&tickers=${tickers}&topics=${topics}&apikey=${this.apiKey}`;

    console.log("[Alpha Vantage] GET Market Sentiments: " + url);

    return await axios.get(url);
  }

  async getForexData() {
    try {
      const response = await this.getIntraDayDataSeries();

      const metaData = await response.data["Meta Data"];
      const timeSeriesData = await response.data["Time Series (1min)"];

      const timeSeries = Object.entries(timeSeriesData).map((entry) => {
        const timestamp = entry[0];

        let result = ObjectHelper.removeSerialNumberFromKeys(
          ObjectHelper.convertPropertyValuesToFloat(entry[1])
        );

        result.timestamp = moment(timestamp).unix();

        return result;
      });

      const meta = ObjectHelper.removeSerialNumberFromKeys(metaData);

      return timeSeries.map((item) => ({
        ...item,
        symbol: meta["Symbol"],
      }));
    } catch (error) {
      console.log(`[Alpha Vantage - ForexData] An error has occured: ${error}`);
    }
  }

  async getNewsData() {
    try {
      const response = await this.getMarketSentiments();

      return await response.data.feed?.map((item) => ({
        title: item.title,
        url: item.url,
        authors: item.authors,
        image: item.banner_image,
        source_domain: item.source_domain,
        topics: item.topics.map((topic) => topic.topic),
        summary: item.summary,
        timestamp: moment(item.timestamp).unix(),
      }));
    } catch (error) {
      console.log(`[Alpha Vantage - NewsData] An error has occured: ${error}`);
    }
  }
}
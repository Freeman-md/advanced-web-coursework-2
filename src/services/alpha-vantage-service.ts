export namespace Services {
  const dotenv = require("dotenv");
  const axios = require("axios");
  const moment = require("moment");
  const { AxiosResponse } = require("axios");

  const { Helpers } = require("../helpers");
  const { Models } = require('./../models/forex-data');

  dotenv.config();

  export class AlphaVantageService {
    baseUrl: string = "https://www.alphavantage.co/query";
    apiKey: string = process.env.ALPHA_VANTAGE_API_KEY!;

    // get intraday time series of the forex data
    getIntraDayDataSeries(
      symbol: string = "EURUSD",
      interval: string = "1min"
    ): typeof AxiosResponse {
      const url: string = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;

      console.log("[Alpha Vantage] GET IntraDay Forex Data: " + url);

      return axios.get(url);
    }

    getMarketSentiments(
      category: string = "NEWS_SENTIMENT",
      tickers: string = "COIN,CRYPTO:BTC,FOREX:USD",
      topics: string = "blockchain,technology,finance"
    ): typeof AxiosResponse {
      const url: string = `${this.baseUrl}?function=${category}&tickers=${tickers}&topics=${topics}&apikey=${this.apiKey}`;

      console.log("[Alpha Vantage] GET Market Sentiments: " + url);

      return axios.get(url);
    }

    async getForexData() {
      try {
        const response = await this.getIntraDayDataSeries();

        const metaData = response.data["Meta Data"];
        const timeSeriesData = response.data["Time Series (1min)"];

        const timeSeries = Object.entries(timeSeriesData).map((entry) => {
          const timestamp = entry[0];

          let result = Helpers.ObjectHelper.removeSerialNumberFromKeys(
            Helpers.ObjectHelper.convertPropertyValuesToFloat(entry[1])
          );

          result.timestamp = timestamp;

          return result;
        });

        const meta = Helpers.ObjectHelper.removeSerialNumberFromKeys(metaData);

        return timeSeries.map((item) => ({
          ...item,
          symbol: meta["Symbol"],
        }));
      } catch (error) {
        console.log(`[Alpha Vantage] An error has occured: ${error}`);
      }
    }

    async getNewsData() {
      try {
        const response = await this.getMarketSentiments();

        return response.data.feed.map((item) => ({
          title: item.title,
          url: item.url,
          authors: item.authors,
          image: item.banner_image,
          source_domain: item.source_domain,
          topics: item.topics.map((topic) => topic.topic),
          summary: item.summary,
          time_published: moment(item.time_published).unix(),
        }));
      } catch (error) {
        console.log(`[Alpha Vantage] An error has occured: ${error}`);
      }
    }
  }
}

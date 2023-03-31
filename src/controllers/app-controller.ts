import AlphaVantageService from "./../services/alpha-vantage-service";
import { ForexData } from "./../models/forex-data";
import { NewsData } from "./../models/news-data";

export default class AppController {
  alphaVantageService = new AlphaVantageService();

  async retrieveAndSaveForexData() {
    // symbols to get rates for
    const symbols = ['USDJPY', 'USDCAD', 'USDCHF', 'USDMXN', 'USDSGD']
    // const symbols = ['USDINR']

    // create promise array to make concurrent requests
    const forexPromiseArray = symbols.map((symbol) => {
      return this.alphaVantageService.getForexData(symbol);
    });

    // retrieve data from API
    const forexData = await Promise.all(forexPromiseArray);

    // save data from API
    forexData.forEach(data => this.saveForexData(data))
  }

  async retrieveAndSaveNewsData() {
    // cryptos to get news data for
    const cryptos: Array<string> = ['USD', 'CAD', 'CNY', 'GBP', 'EUR']

    const newsPromiseArray = cryptos.map((crypto) => {
      return this.alphaVantageService.getNewsData(crypto)
    })

    // retrieve data from API
    const newsData = await Promise.all(newsPromiseArray);

    // save data from API
    newsData.forEach(data => this.saveNewsData(data))
  }

  async saveForexData(forexData: Array<ForexData>) {
    forexData?.map((data) => ForexData.fromJSON(data).save());
  }

  async saveNewsData(newsData: Array<NewsData>) {
    newsData = newsData.splice(-20)

    newsData?.map((data) => NewsData.fromJSON(data).save());
  }
}

import AlphaVantageService from "./../services/alpha-vantage-service";
import { ForexData } from "./../models/forex-data";
import { NewsData } from "./../models/news-data";

export default class AppController {
  alphaVantageService = new AlphaVantageService();

  async retrieveAndSaveForexData() {
    // symbols to get rates for
    const symbols = ['USDJPY', 'USDCAD', 'USDCHF', 'USDMXN', 'USDSGD']

    // create promise array to make concurrent requests
    const forexPrommiseArray = symbols.map((symbol) => {
      return this.alphaVantageService.getForexData(symbol);
    });

    // retrieve data from API
    const forexData = await Promise.all(forexPrommiseArray);

    // save data from API
    forexData.forEach(data => this.saveForexData(data))
  }

  async retrieveAndSaveNewsData() {
    // retrieve data from API
    const newsData = await this.alphaVantageService.getNewsData();

    // save data gotten from API
    this.saveNewsData(newsData)
  }

  async saveForexData(forexData) {
    forexData?.map((data) => ForexData.fromJSON(data).save());
  }

  async saveNewsData(newsData) {
    newsData?.map((data) => NewsData.fromJSON(data).save());
  }
}

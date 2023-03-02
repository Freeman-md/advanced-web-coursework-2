import AlphaVantageService from "./../services/alpha-vantage-service";
import { ForexData } from "./../models/forex-data";
import { NewsData } from "./../models/news-data";

export default class AppController {
  alphaVantageService = new AlphaVantageService();

  async retrieveAndSaveData() {
    // retrieve data from API
    const symbols = ['USDJPY', 'USDCAD', 'USDCHF', 'USDMXN', 'USDSGD']

    const forexPrommiseArray = symbols.map((symbol) => {
      return this.alphaVantageService.getForexData(symbol);
    });

    const forexData = await Promise.all(forexPrommiseArray);
    const newsData = await this.alphaVantageService.getNewsData();

    // save data gotten from API
    forexData.forEach(data => this.saveForexData(data))
    this.saveNewsData(newsData)
  }

  async saveForexData(forexData) {
    forexData?.map((data) => ForexData.fromJSON(data).save());
  }

  async saveNewsData(newsData) {
    newsData?.map((data) => NewsData.fromJSON(data).save());
  }
}

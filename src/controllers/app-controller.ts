import AlphaVantageService from "./../services/alpha-vantage-service";
import { ForexData } from "./../models/forex-data";
import { NewsData } from "./../models/news-data";

export default class AppController {
  alphaVantageService = new AlphaVantageService();

  async retrieveAndSaveData() {
    // retrieve data from API
    const forexData = await this.alphaVantageService.getForexData();
    const newsData = await this.alphaVantageService.getNewsData();

    // save data gotten from API
    this.saveForexData(forexData)
    this.saveNewsData(newsData)
  }

  async saveForexData(forexData) {
    forexData?.map((data) => ForexData.fromJSON(data).save());
  }

  async saveNewsData(newsData) {
    newsData?.map((data) => NewsData.fromJSON(data).save());
  }
}

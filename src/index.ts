import AppController from './controllers/app-controller'

try {
    // create and initialize app controller to retrieve forex and news data
    const appController: AppController = new AppController()

    appController.retrieveAndSaveForexData()
    appController.retrieveAndSaveNewsData()
} catch (error) {
    console.log(`[App Controller] An error has occurred: ${error}`);
}
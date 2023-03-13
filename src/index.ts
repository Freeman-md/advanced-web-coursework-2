import AppController from './controllers/app-controller'

try {
    const appController = new AppController()

    // appController.retrieveAndSaveForexData()
    appController.retrieveAndSaveNewsData()
} catch (error) {
    console.log(`[App Controller] An error has occured: ${error}`);
}
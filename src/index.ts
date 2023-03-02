const { Services } = require('./services/alpha-vantage-service')

// get forex data
const alphaVantageService = new Services.AlphaVantageService()

// alphaVantageService.getForexData()
alphaVantageService.getNewsData()
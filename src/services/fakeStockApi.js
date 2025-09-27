// fake stock API service that generates realistic stock data
import stocksData from '../data/stocks.json';

class FakeStockApiService {
    constructor() {
        this.basePrices = {};
        stocksData.stocks.forEach(stock => {
            this.basePrices[stock.symbol] = stock.basePrice;
        });
        
        this.currentPrices = { ...this.basePrices };
        this.apiCallsToday = 0;
        this.lastCallTime = 0;
    }

    generatePriceMovement(currentPrice, volatility = 0.1) {
        // random walk with slight upward bias
        const change = (Math.random() - 0.45) * volatility;
        return currentPrice * (1 + change);
    }

    generateHistoricalData(symbol, days = 30) {
        const basePrice = this.basePrices[symbol] || 100;
        const historicalData = [];
        
        let currentPrice = basePrice * (0.9 + Math.random() * 0.2); 
        
        // generate historical data (past to present)
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - days + 1 + i); // start from days ago to today
            
            currentPrice = this.generatePriceMovement(currentPrice);
            
            // generate volume (realistic range)
            const volume = Math.floor(Math.random() * 50000000) + 10000000;
            
            historicalData.push({
                symbol,
                date: date.toISOString().split('T')[0],
                price: Math.round(currentPrice * 100) / 100,
                volume: volume,
                isPrediction: false
            });
        }
        
        // generate 50 days in the future
        for (let i = 1; i <= 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i); // future dates
            
            currentPrice = this.generatePriceMovement(currentPrice, 0.025);
            
            // generate volume (realistic range)
            const volume = Math.floor(Math.random() * 50000000) + 10000000;
            
            historicalData.push({
                symbol,
                date: date.toISOString().split('T')[0],
                price: Math.round(currentPrice * 100) / 100,
                volume: volume,
                isPrediction: true
            });
        }
        
        return historicalData;
    }

    // generate real-time data
    generateRealTimeData(symbol) {
        const basePrice = this.basePrices[symbol] || 100;
        
        this.currentPrices[symbol] = this.generatePriceMovement(this.currentPrices[symbol] || basePrice);
        
        const currentPrice = this.currentPrices[symbol];
        const previousPrice = basePrice;
        const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
        
        const volume = Math.floor(Math.random() * 50000000) + 10000000;
        
        return {
            symbol,
            price: Math.round(currentPrice * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            date: new Date().toISOString().split('T')[0],
            volume: volume
        };
    }

    async delay(ms = 100) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchRealTimeData(symbol) {
        await this.delay(100 + Math.random() * 200); 
        this.apiCallsToday++;
        this.lastCallTime = Date.now();
        
        return this.generateRealTimeData(symbol);
    }

    async fetchHistoricalData(symbol, days = 30) {
        await this.delay(200 + Math.random() * 300); 
        this.apiCallsToday++;
        this.lastCallTime = Date.now();
        
        const data = this.generateHistoricalData(symbol, days);
        return data;
    }

    async fetchMultipleSymbols(symbols) {
        const results = [];
        const errors = [];

        for (const symbol of symbols) {
            try {
                const data = await this.fetchRealTimeData(symbol);
                results.push(data);
            } catch (error) {
                errors.push({ symbol, error: error.message });
            }
        }

        return { results, errors };
    }

    async fetchMultipleHistoricalData(symbols, days = 30, onProgress = null) {
        const results = {};
        const errors = {};

        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            
            try {
                await this.delay(300 + Math.random() * 500);
                
                const historicalData = await this.fetchHistoricalData(symbol, days);
                results[symbol] = historicalData;
                
                if (onProgress) {
                    onProgress(symbol, i + 1, symbols.length);
                }
                
                console.log(`✅ Generated fake historical data for ${symbol} (${i + 1}/${symbols.length})`);
                
            } catch (error) {
                console.error(`❌ Failed to generate data for ${symbol}:`, error);
                errors[symbol] = error.message;
                
                if (onProgress) {
                    onProgress(symbol, i + 1, symbols.length, error.message);
                }
            }
        }

        return { results, errors };
    }

    getApiStats() {
        return {
            callsToday: this.apiCallsToday,
            maxCallsPerDay: 1000, 
            canMakeCall: true,
            timeUntilNextCall: 0
        };
    }

    resetDailyCounter() {
        this.apiCallsToday = 0;
    }
}

// create singleton instance
const fakeStockApiService = new FakeStockApiService();
export default fakeStockApiService;

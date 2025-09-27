// EODHD API service for stock data fetching

class StockApiService {
    constructor() {
        this.apiKey = import.meta.env.VITE_EODHD_API_KEY || "demo";
        this.baseUrl = "https://eodhd.com/api";
        this.apiCallsToday = 0;
        this.lastCallTime = 0;
        this.maxCallsPerDay = 20;
        this.minTimeBetweenCalls = 30000; 
        
        this.setupDailyReset();
    }

    canMakeApiCall() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        return timeSinceLastCall >= this.minTimeBetweenCalls && this.apiCallsToday < this.maxCallsPerDay;
    }

    incrementApiCalls() {
        this.apiCallsToday++;
        this.lastCallTime = Date.now();
    }

    // setup daily reset for API call counter
    setupDailyReset() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        setTimeout(() => {
            this.apiCallsToday = 0;
            setInterval(() => {
                this.apiCallsToday = 0;
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }

    async fetchRealTimeData(symbol) {
        if (!this.canMakeApiCall()) {
            throw new Error("Rate limit: Please wait 30 seconds between API calls or daily limit reached");
        }

        try {
            this.incrementApiCalls();

            const response = await fetch(
                `${this.baseUrl}/eod/${symbol}.US?api_token=${this.apiKey}&fmt=json&period=d&order=d&limit=2`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length >= 2) {
                const latest = data[0]; 
                const previous = data[1]; 

                const price = parseFloat(latest.close);
                const prevPrice = parseFloat(previous.close);
                const changePercent = ((price - prevPrice) / prevPrice) * 100;

                return {
                    symbol,
                    price,
                    changePercent,
                    date: latest.date,
                    volume: parseInt(latest.volume)
                };
            } else {
                throw new Error("Invalid quote data received");
            }
        } catch (error) {
            console.error(`Error fetching real-time data for ${symbol}:`, error);
            throw error;
        }
    }

    async fetchHistoricalData(symbol, days = 30) {
        if (!this.canMakeApiCall()) {
            throw new Error("Rate limit: Please wait 30 seconds between API calls or daily limit reached");
        }

        try {
            this.incrementApiCalls();

            const response = await fetch(
                `${this.baseUrl}/eod/${symbol}.US?api_token=${this.apiKey}&fmt=json`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const historicalData = data
                    .slice(-days) 
                    .map(day => ({
                        symbol,
                        date: day.date,
                        price: parseFloat(day.close),
                        volume: parseInt(day.volume)
                    }))
                    .reverse(); 

                return historicalData;
            } else {
                throw new Error("No historical data available in response");
            }
        } catch (error) {
            console.error(`Error fetching historical data for ${symbol}:`, error);
            throw error;
        }
    }

    async fetchMultipleSymbols(symbols) {
        const results = [];
        const errors = [];

        for (const symbol of symbols) {
            try {
                if (this.canMakeApiCall()) {
                    const data = await this.fetchRealTimeData(symbol);
                    results.push(data);
                } else {
                    errors.push({ symbol, error: "Rate limit reached" });
                }
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
                if (!this.canMakeApiCall()) {
                    const waitTime = this.minTimeBetweenCalls - (Date.now() - this.lastCallTime);
                    if (waitTime > 0) {
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }

                const historicalData = await this.fetchHistoricalData(symbol, days);
                results[symbol] = historicalData;
                
                if (onProgress) {
                    onProgress(symbol, i + 1, symbols.length);
                }
                
            } catch (error) {
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
            maxCallsPerDay: this.maxCallsPerDay,
            canMakeCall: this.canMakeApiCall(),
            timeUntilNextCall: Math.max(0, this.minTimeBetweenCalls - (Date.now() - this.lastCallTime))
        };
    }
}

// create singleton instance
const stockApiService = new StockApiService();
export default stockApiService;

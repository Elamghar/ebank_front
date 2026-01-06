import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface BinanceTickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  openTime: number;
  closeTime: number;
  count: number;
}

export interface BinanceKlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  buyBaseVolume: string;
  buyQuoteVolume: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  private readonly BASE_URL = 'https://api.binance.com/api/v3';
  private readonly WS_URL = 'wss://stream.binance.com:9443/ws';
  
  // Crypto symbols mapping for display names
  private readonly CRYPTO_NAMES: { [key: string]: string } = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'BNBUSDT': 'Binance Coin',
    'ADAUSDT': 'Cardano',
    'SOLUSDT': 'Solana',
    'XRPUSDT': 'XRP',
    'DOTUSDT': 'Polkadot',
    'DOGEUSDT': 'Dogecoin',
    'AVAXUSDT': 'Avalanche',
    'MATICUSDT': 'Polygon'
  };

  private priceSubject = new BehaviorSubject<CryptoPrice[]>([]);
  public prices$ = this.priceSubject.asObservable();

  private websockets: { [symbol: string]: WebSocket } = {};

  constructor(private http: HttpClient) {}

  /**
   * Get 24hr ticker statistics for all symbols
   */
  getAllTickers(): Observable<BinanceTickerData[]> {
    return this.http.get<BinanceTickerData[]>(`${this.BASE_URL}/ticker/24hr`)
      .pipe(
        catchError(error => {
          console.error('Error fetching tickers:', error);
          return of([]);
        })
      );
  }

  /**
   * Get 24hr ticker statistics for specific symbols
   */
  getTickersBySymbols(symbols: string[]): Observable<CryptoPrice[]> {
    // Convert symbols to Binance format (e.g., BTC -> BTCUSDT)
    const binanceSymbols = symbols.map(symbol => `${symbol}USDT`);
    
    return this.getAllTickers().pipe(
      map(tickers => {
        return tickers
          .filter(ticker => binanceSymbols.includes(ticker.symbol))
          .map(ticker => this.mapTickerToCryptoPrice(ticker));
      })
    );
  }

  /**
   * Get current price for a specific symbol
   */
  getPrice(symbol: string): Observable<number> {
    const binanceSymbol = symbol.includes('USDT') ? symbol : `${symbol}USDT`;
    
    return this.http.get<{ price: string }>(`${this.BASE_URL}/ticker/price?symbol=${binanceSymbol}`)
      .pipe(
        map(response => parseFloat(response.price)),
        catchError(error => {
          console.error(`Error fetching price for ${symbol}:`, error);
          return of(0);
        })
      );
  }

  /**
   * Get historical klines/candlestick data
   */
  getKlines(symbol: string, interval: string = '1h', limit: number = 24): Observable<BinanceKlineData[]> {
    const binanceSymbol = symbol.includes('USDT') ? symbol : `${symbol}USDT`;
    
    return this.http.get<any[]>(`${this.BASE_URL}/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`)
      .pipe(
        map(data => data.map(kline => ({
          openTime: kline[0],
          open: kline[1],
          high: kline[2],
          low: kline[3],
          close: kline[4],
          volume: kline[5],
          closeTime: kline[6],
          quoteVolume: kline[7],
          trades: kline[8],
          buyBaseVolume: kline[9],
          buyQuoteVolume: kline[10]
        }))),
        catchError(error => {
          console.error(`Error fetching klines for ${symbol}:`, error);
          return of([]);
        })
      );
  }

  /**
   * Start real-time price updates via WebSocket
   */
  startRealTimePrices(symbols: string[]): void {
    symbols.forEach(symbol => {
      this.subscribeToSymbol(symbol);
    });

    // Also fetch initial data
    this.getTickersBySymbols(symbols).subscribe(prices => {
      this.priceSubject.next(prices);
    });
  }

  /**
   * Subscribe to real-time price updates for a symbol
   */
  private subscribeToSymbol(symbol: string): void {
    const binanceSymbol = `${symbol.toLowerCase()}usdt`;
    const streamName = `${binanceSymbol}@ticker`;
    
    if (this.websockets[symbol]) {
      this.websockets[symbol].close();
    }

    const ws = new WebSocket(`${this.WS_URL}/${streamName}`);
    
    ws.onopen = () => {
      console.log(`WebSocket connected for ${symbol}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.updatePrice(symbol, data);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for ${symbol}:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket closed for ${symbol}`);
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (!this.websockets[symbol] || this.websockets[symbol].readyState === WebSocket.CLOSED) {
          this.subscribeToSymbol(symbol);
        }
      }, 5000);
    };

    this.websockets[symbol] = ws;
  }

  /**
   * Update price data from WebSocket
   */
  private updatePrice(symbol: string, wsData: any): void {
    const currentPrices = this.priceSubject.value;
    const updatedPrices = currentPrices.map(price => {
      if (price.symbol === symbol) {
        return {
          ...price,
          price: parseFloat(wsData.c),
          change: parseFloat(wsData.P),
          changePercent: parseFloat(wsData.P),
          high24h: parseFloat(wsData.h),
          low24h: parseFloat(wsData.l),
          volume: parseFloat(wsData.v)
        };
      }
      return price;
    });

    this.priceSubject.next(updatedPrices);
  }

  /**
   * Map Binance ticker data to our CryptoPrice interface
   */
  private mapTickerToCryptoPrice(ticker: BinanceTickerData): CryptoPrice {
    const symbol = ticker.symbol.replace('USDT', '');
    return {
      symbol: symbol,
      name: this.CRYPTO_NAMES[ticker.symbol] || symbol,
      price: parseFloat(ticker.lastPrice),
      change: parseFloat(ticker.priceChange),
      changePercent: parseFloat(ticker.priceChangePercent),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      volume: parseFloat(ticker.volume)
    };
  }

  /**
   * Stop all WebSocket connections
   */
  stopRealTimePrices(): void {
    Object.keys(this.websockets).forEach(symbol => {
      if (this.websockets[symbol]) {
        this.websockets[symbol].close();
        delete this.websockets[symbol];
      }
    });
  }

  /**
   * Get exchange info (trading rules, symbols, etc.)
   */
  getExchangeInfo(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/exchangeInfo`)
      .pipe(
        catchError(error => {
          console.error('Error fetching exchange info:', error);
          return of({});
        })
      );
  }
}
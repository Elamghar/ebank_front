import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
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
  marketCap: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoService {
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  
  // Coin ID mapping (CoinGecko uses different IDs than symbols)
  private readonly COIN_IDS: { [symbol: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum', 
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'SOL': 'solana',
    'XRP': 'ripple',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network'
  };

  private priceSubject = new BehaviorSubject<CryptoPrice[]>([]);
  public prices$ = this.priceSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get market data for specified coins
   */
  getMarketData(symbols: string[]): Observable<CryptoPrice[]> {
    const coinIds = symbols.map(symbol => this.COIN_IDS[symbol]).filter(id => id);
    const ids = coinIds.join(',');
    
    const url = `${this.BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;
    
    return this.http.get<CoinGeckoMarketData[]>(url).pipe(
      map(data => data.map(coin => this.mapCoinGeckoToCryptoPrice(coin))),
      catchError(error => {
        console.error('CoinGecko API error:', error);
        return of([]);
      })
    );
  }

  /**
   * Get simple price data
   */
  getSimplePrices(symbols: string[]): Observable<any> {
    const coinIds = symbols.map(symbol => this.COIN_IDS[symbol]).filter(id => id);
    const ids = coinIds.join(',');
    
    const url = `${this.BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
    
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('CoinGecko simple prices error:', error);
        return of({});
      })
    );
  }

  /**
   * Get specific coin price
   */
  getCoinPrice(symbol: string): Observable<number> {
    const coinId = this.COIN_IDS[symbol];
    if (!coinId) {
      return of(0);
    }

    const url = `${this.BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`;
    
    return this.http.get<any>(url).pipe(
      map(data => data[coinId]?.usd || 0),
      catchError(error => {
        console.error(`Error fetching price for ${symbol}:`, error);
        return of(0);
      })
    );
  }

  /**
   * Start periodic price updates
   */
  startPriceUpdates(symbols: string[], intervalMs: number = 30000): void {
    // Initial load
    this.getMarketData(symbols).subscribe(prices => {
      this.priceSubject.next(prices);
    });

    // Periodic updates every 30 seconds (CoinGecko rate limit friendly)
    interval(intervalMs).pipe(
      switchMap(() => this.getMarketData(symbols))
    ).subscribe(prices => {
      this.priceSubject.next(prices);
    });
  }

  /**
   * Stop price updates
   */
  stopPriceUpdates(): void {
    // The interval will be stopped when component is destroyed
    // due to the subscription being unsubscribed
  }

  /**
   * Get trending coins
   */
  getTrendingCoins(): Observable<any> {
    const url = `${this.BASE_URL}/search/trending`;
    
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error fetching trending coins:', error);
        return of({ coins: [] });
      })
    );
  }

  /**
   * Get global market data
   */
  getGlobalData(): Observable<any> {
    const url = `${this.BASE_URL}/global`;
    
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error fetching global data:', error);
        return of({});
      })
    );
  }

  /**
   * Map CoinGecko data to our CryptoPrice interface
   */
  private mapCoinGeckoToCryptoPrice(coin: CoinGeckoMarketData): CryptoPrice {
    return {
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
      image: coin.image
    };
  }

  /**
   * Get coin ID from symbol
   */
  getCoinId(symbol: string): string {
    return this.COIN_IDS[symbol] || symbol.toLowerCase();
  }

  /**
   * Get all supported symbols
   */
  getSupportedSymbols(): string[] {
    return Object.keys(this.COIN_IDS);
  }
}
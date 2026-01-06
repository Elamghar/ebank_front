import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoinGeckoService, CryptoPrice } from '@/services/coingecko.service';

interface CryptoHolding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change: number;
  currentPrice: number;
}

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  // Portfolio data (this would typically come from your backend)
  portfolioValue = 0;
  holdings: CryptoHolding[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.0034,
      value: 0,
      change: 0,
      currentPrice: 0
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.25,
      value: 0,
      change: 0,
      currentPrice: 0
    }
  ];

  // Market data from CoinGecko
  marketData: CryptoPrice[] = [];
  
  // Trading form
  selectedCrypto = 'BTC';
  tradeType = 'buy';
  tradeAmount = 100;
  currentPrice = 0;

  // Loading states
  isLoadingMarketData = true;
  isLoadingPrices = true;
  lastUpdated: Date | null = null;

  // Subscriptions
  private priceSubscription: Subscription = new Subscription();
  private readonly WATCHED_SYMBOLS = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'XRP'];

  constructor(private coinGeckoService: CoinGeckoService) { }

  ngOnInit(): void {
    this.initializeRealTimeData();
    this.loadInitialMarketData();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.priceSubscription.unsubscribe();
    this.coinGeckoService.stopPriceUpdates();
  }

  /**
   * Initialize real-time data streaming
   */
  private initializeRealTimeData(): void {
    // Start periodic price updates (every 30 seconds)
    this.coinGeckoService.startPriceUpdates(this.WATCHED_SYMBOLS, 30000);
    
    // Subscribe to price updates
    this.priceSubscription = this.coinGeckoService.prices$.subscribe(prices => {
      if (prices.length > 0) {
        this.marketData = prices;
        this.isLoadingMarketData = false;
        this.updateHoldingsValues(prices);
        this.updateCurrentPrice();
        this.lastUpdated = new Date();
      }
    });
  }

  /**
   * Load initial market data
   */
  private loadInitialMarketData(): void {
    this.coinGeckoService.getMarketData(this.WATCHED_SYMBOLS).subscribe({
      next: (prices) => {
        this.marketData = prices;
        this.isLoadingMarketData = false;
        this.updateHoldingsValues(prices);
        this.updateCurrentPrice();
        this.lastUpdated = new Date();
      },
      error: (error) => {
        console.error('Error loading market data:', error);
        this.isLoadingMarketData = false;
        // Show fallback message or retry logic
        this.showErrorMessage('Erreur lors du chargement des données de marché');
      }
    });
  }

  /**
   * Update portfolio holdings values based on current prices
   */
  private updateHoldingsValues(prices: CryptoPrice[]): void {
    this.holdings = this.holdings.map(holding => {
      const priceData = prices.find(p => p.symbol === holding.symbol);
      if (priceData) {
        const newValue = holding.amount * priceData.price;
        return {
          ...holding,
          name: priceData.name, // Update with real name
          currentPrice: priceData.price,
          value: newValue,
          change: priceData.changePercent
        };
      }
      return holding;
    });
    
    this.calculatePortfolioValue();
    this.isLoadingPrices = false;
  }

  /**
   * Calculate total portfolio value
   */
  private calculatePortfolioValue(): void {
    this.portfolioValue = this.holdings.reduce((total, holding) => total + holding.value, 0);
  }

  /**
   * Update current price for selected crypto
   */
  private updateCurrentPrice(): void {
    const crypto = this.marketData.find(c => c.symbol === this.selectedCrypto);
    if (crypto) {
      this.currentPrice = crypto.price;
    } else {
      // Fallback: fetch price directly
      this.coinGeckoService.getCoinPrice(this.selectedCrypto).subscribe(price => {
        this.currentPrice = price;
      });
    }
  }

  /**
   * Handle crypto selection change
   */
  onCryptoChange(): void {
    this.updateCurrentPrice();
  }

  /**
   * Handle buy action
   */
  onBuy(): void {
    if (this.tradeAmount <= 0) {
      this.showErrorMessage('Veuillez saisir un montant valide');
      return;
    }

    if (this.currentPrice <= 0) {
      this.showErrorMessage('Prix non disponible, veuillez réessayer');
      return;
    }

    const cryptoAmount = this.tradeAmount / this.currentPrice;
    const fees = this.calculateTradingFees(this.tradeAmount);
    const total = this.tradeAmount + fees;

    console.log(`Buying ${cryptoAmount.toFixed(8)} ${this.selectedCrypto} for $${this.tradeAmount} (fees: $${fees})`);
    
    // Here you would implement the actual buy logic
    // This would involve calling your backend API to execute the trade
    const confirmMessage = `Confirmer l'achat:\n${this.formatCryptoAmount(cryptoAmount, this.selectedCrypto)}\nPrix: ${this.formatCurrency(this.tradeAmount)}\nFrais: ${this.formatCurrency(fees)}\nTotal: ${this.formatCurrency(total)}`;
    
    if (confirm(confirmMessage)) {
      this.executeTrade('buy', cryptoAmount);
    }
  }

  /**
   * Handle sell action
   */
  onSell(): void {
    if (this.tradeAmount <= 0) {
      this.showErrorMessage('Veuillez saisir un montant valide');
      return;
    }

    if (this.currentPrice <= 0) {
      this.showErrorMessage('Prix non disponible, veuillez réessayer');
      return;
    }

    const cryptoAmount = this.tradeAmount / this.currentPrice;
    
    // Check if user has enough of this crypto
    const holding = this.holdings.find(h => h.symbol === this.selectedCrypto);
    if (holding && holding.amount < cryptoAmount) {
      this.showErrorMessage(`Solde insuffisant. Vous avez ${this.formatCryptoAmount(holding.amount, this.selectedCrypto)}`);
      return;
    }

    const fees = this.calculateTradingFees(this.tradeAmount);
    const total = this.tradeAmount - fees;

    console.log(`Selling ${cryptoAmount.toFixed(8)} ${this.selectedCrypto} for $${this.tradeAmount} (fees: $${fees})`);
    
    const confirmMessage = `Confirmer la vente:\n${this.formatCryptoAmount(cryptoAmount, this.selectedCrypto)}\nValeur: ${this.formatCurrency(this.tradeAmount)}\nFrais: ${this.formatCurrency(fees)}\nVous recevrez: ${this.formatCurrency(total)}`;
    
    if (confirm(confirmMessage)) {
      this.executeTrade('sell', cryptoAmount);
    }
  }

  /**
   * Execute trade (placeholder for actual implementation)
   */
  private executeTrade(type: 'buy' | 'sell', amount: number): void {
    // This is where you'd call your backend API
    // For now, we'll just show a success message
    const action = type === 'buy' ? 'Achat' : 'Vente';
    alert(`${action} exécuté avec succès!\n${this.formatCryptoAmount(amount, this.selectedCrypto)}`);
    
    // Update holdings if this was a real transaction
    if (type === 'buy') {
      const holding = this.holdings.find(h => h.symbol === this.selectedCrypto);
      if (holding) {
        holding.amount += amount;
      } else {
        // Add new holding
        this.holdings.push({
          symbol: this.selectedCrypto,
          name: this.getSelectedCryptoName(),
          amount: amount,
          value: amount * this.currentPrice,
          change: 0,
          currentPrice: this.currentPrice
        });
      }
    } else {
      // Sell - reduce amount
      const holding = this.holdings.find(h => h.symbol === this.selectedCrypto);
      if (holding) {
        holding.amount -= amount;
      }
    }
    
    this.calculatePortfolioValue();
  }

  /**
   * Calculate trading fees (example: 0.25%)
   */
  private calculateTradingFees(amount: number): number {
    return amount * 0.0025; // 0.25% fee
  }

  /**
   * Show error message
   */
  private showErrorMessage(message: string): void {
    alert(message); // In production, use a proper toast/notification service
  }

  /**
   * Get selected crypto name
   */
  private getSelectedCryptoName(): string {
    const crypto = this.marketData.find(c => c.symbol === this.selectedCrypto);
    return crypto ? crypto.name : this.selectedCrypto;
  }

  /**
   * Get CSS class for price change
   */
  getChangeClass(change: number): string {
    return change >= 0 ? 'positive-change' : 'negative-change';
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 8 : 2
    }).format(value);
  }

  /**
   * Format percentage values
   */
  formatPercent(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  /**
   * Format crypto amounts
   */
  formatCryptoAmount(amount: number, symbol: string): string {
    const decimals = symbol === 'BTC' ? 8 : symbol === 'ETH' ? 6 : 4;
    return `${amount.toFixed(decimals)} ${symbol}`;
  }

  /**
   * Get available crypto symbols for trading
   */
  getAvailableCryptos(): CryptoPrice[] {
    return this.marketData.filter(crypto => 
      ['BTC', 'ETH', 'BNB', 'ADA'].includes(crypto.symbol)
    );
  }

  /**
   * Refresh market data manually
   */
  refreshMarketData(): void {
    this.isLoadingMarketData = true;
    this.loadInitialMarketData();
  }

  /**
   * Get price trend indicator
   */
  getPriceTrend(change: number): string {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  }

  /**
   * Calculate crypto amount for current trade
   */
  getCryptoAmountForTrade(): number {
    return this.currentPrice > 0 ? this.tradeAmount / this.currentPrice : 0;
  }

  /**
   * Get last updated time as string
   */
  getLastUpdatedString(): string {
    if (!this.lastUpdated) return '';
    return `Dernière mise à jour: ${this.lastUpdated.toLocaleTimeString()}`;
  }

  /**
   * Format large numbers (for volume, market cap)
   */
  formatLargeNumber(value: number): string {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toFixed(0);
  }
}
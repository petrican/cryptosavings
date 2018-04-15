"use strict";

/**
 * Our Vue.js application.
 *
 * This manages the entire front-end website.
 */

// The API we're using for grabbing metadata about each cryptocurrency
// (including logo images). The service can be found at:
// https://www.cryptocompare.com/api/
var CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com";
var CRYPTOCOMPARE_URI     = "https://www.cryptocompare.com";

// The API we're using for grabbing cryptocurrency prices.  The service can be
// found at: https://coinmarketcap.com/api/
var COINMARKETCAP_API_URI = "https://api.coinmarketcap.com";

// The amount of milliseconds (ms) after which we should update our currency
// charts.
var UPDATE_INTERVAL = 60 * 1000;

var app = new Vue({
  el: "#app",
  data: {
    coins: [],
    coinData: {}
  },
  methods: {

    /**
     * Load up all cryptocurrency data.  This data is used to find what logos
     * each currency has, so we can display things in a friendly way.
     */
    getCoinData: function getCoinData() {
      var _this = this;

      var self = this;

      axios.get(CRYPTOCOMPARE_API_URI + "/data/all/coinlist").then(function (resp) {
        _this.coinData = resp.data.Data;
        _this.getCoins();
      }).catch(function (err) {
        _this.getCoins();
        console.error(err);
      });
    },

    /**
     * Get the top 10 cryptocurrencies by value.  This data is refreshed each 5
     * minutes by the backing API service.
     */
    getCoins: function getCoins() {
      var _this2 = this;

      var self = this;

      axios.get(COINMARKETCAP_API_URI + "/v1/ticker/?limit=10").then(function (resp) {
        _this2.coins = resp.data;
      }).catch(function (err) {
        console.error(err);
      });
    },

    /**
     * Given a cryptocurrency ticket symbol, return the currency's logo
     * image.
     */
    getCoinImage: function getCoinImage(symbol) {

      // These two symbols don't match up across API services. I'm manually
      // replacing these here so I can find the correct image for the currency.
      //
      // In the future, it would be nice to find a more generic way of searching
      // for currency images
      symbol = symbol === "MIOTA" ? "IOT" : symbol;
      symbol = symbol === "VERI" ? "VRM" : symbol;

      return CRYPTOCOMPARE_URI + this.coinData[symbol].ImageUrl;
    },

    /**
     * Return a CSS color (either red or green) depending on whether or
     * not the value passed in is negative or positive.
     */
    getColor: function getColor(num) {
      return num > 0 ? "color:green;" : "color:red;";
    }
  },

  /**
   * Using this lifecycle hook, we'll populate all of the cryptocurrency data as
   * soon as the page is loaded a single time.
   */
  created: function created() {
    this.getCoinData();
  }
});

/**
 * Once the page has been loaded and all of our app stuff is working, we'll
 * start polling for new cryptocurrency data every minute.
 *
 * This is sufficiently dynamic because the API's we're relying on are updating
 * their prices every 5 minutes, so checking every minute is sufficient.
 */
setInterval(function () {
  app.getCoins();
}, UPDATE_INTERVAL);
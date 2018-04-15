"use strict";

// The API we're using for grabbing metadata about each cryptocurrency
// (including logo images). The service can be found at:
// https://www.cryptocompare.com/api/
var CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com/";

// The amount of milliseconds (ms) after which we should update our currency
// charts.
var UPDATE_INTERVAL = 3000;

var app = new Vue({
  el: "#hexchanges",
  data: {
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

      axios.get(CRYPTOCOMPARE_API_URI + "data/pricemulti?fsyms=BTC,BCC,ETH,LTC&tsyms=USD").then(function (resp) {
        _this.coinData = resp.data;
      }).catch(function (err) {
        console.error(err);
      });

    },

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
 * Setting update interval
 */
setInterval(function () {
  app.getCoinData();
}, UPDATE_INTERVAL);

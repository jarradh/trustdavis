var Fluxxor = require("fluxxor");
var _ = require("lodash");

var constants = require("../constants");

var TradeStore = Fluxxor.createStore({

    initialize: function(options) {
        this.trades = options.trades || {};
        this.loading = false;
        this.error = null;

        this.bindActions(
            constants.trade.LOAD_TRADES, this.onLoadTrades,
            constants.trade.LOAD_TRADES_SUCCESS, this.onLoadTradesSuccess,
            constants.trade.LOAD_TRADES_FAIL, this.onLoadTradesFail,
            constants.trade.ADD_TRADE, this.onAddTrade
        );
    },

    onLoadTrades: function() {
        this.trades = {};
        this.loading = true;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadTradesSuccess: function(payload) {
        this.trades = _.chain(payload)
                       .map(function(val, key) { return [key, this._defaultTrade(val)]; }, this)
                       .object()
                       .value();
        this.loading = false;
        this.error = null;
        this.emit(constants.CHANGE_EVENT);
    },

    onLoadTradesFail: function(payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit(constants.CHANGE_EVENT);
    },

    onAddTrade: function(payload) {
        this.trades[payload.id] = this._defaultTrade(payload);
        this.emit(constants.CHANGE_EVENT);
    },

    _defaultTrade: function(trade) {
        return _.defaults(trade, {
            state: constants.state.NEW,
            escrowPct: 0,
            insurancePct: 0,
            references: []
        });
    },

    getState: function() {
        return {
            tradeList: _.values(this.trades),
            tradeById: this.trades,
            loading: this.loading,
            error: this.error
        };
    }
});

module.exports = TradeStore;

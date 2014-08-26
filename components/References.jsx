/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var NewReferenceForm = require("./NewReferenceForm");
var ReferencesOverviewPane = require("./ReferencesOverviewPane");
var ReferencesDepositPane = require("./ReferencesDepositPane");
var ReferencesList = require("./ReferencesList");

var stats = require("../stats");

var References = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("ReferenceStore", "UserStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
        references: flux.store("ReferenceStore").getState(),
        user: flux.store("UserStore").getState()
    };
  },

  render: function() {
    var referenceStats = stats.referenceStats(this.state.references.references);
    var available = this.state.user.user.deposit - referenceStats.lockedLiabilities;

    return (
      <div>
        <div className="row">
            <div className="col-sm-6">
                <ReferencesOverviewPane stats={referenceStats} />
            </div>
            <div className="col-sm-6">
                <ReferencesDepositPane deposit={this.state.user.user.deposit} available={available} />
            </div>
        </div>
        <NewReferenceForm />
        <h3>Your References</h3>
        <ReferencesList referencesList={this.state.references.references} editable={true} />
      </div>
    );
  }

});

module.exports = References;
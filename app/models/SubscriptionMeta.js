'use strict';

require('./Subscription');

const SubscriptionMeta = Bookshelf.Model.extend({

    tableName: 'subscription_meta',

    hidden: [],

    meta: function () {
        return this.belongsTo('Subscription');
    }

});

module.exports = Bookshelf.model('SubscriptionMeta', SubscriptionMeta);
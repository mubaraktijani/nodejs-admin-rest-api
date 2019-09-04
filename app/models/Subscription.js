'use strict';

require('./SubscriptionMeta');

const Subscription = Bookshelf.Model.extend({

    tableName: 'subscriptions',

    hidden: [
        'created_at', 'updated_at'
    ],

    meta: function () {
        return this.hasMany('SubscriptionMeta');
    }

});

module.exports = Bookshelf.model('Subscription', Subscription);
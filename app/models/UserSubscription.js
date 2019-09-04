'use strict';

require('./Subscription');

const UserSubscription = Bookshelf.Model.extend({

    tableName: 'user_subscription',

    hidden: [
        'created_at', 'updated_at'
    ],

    subscription: function () {
        return this.hasOne('Subscription');
    }

});

module.exports = Bookshelf.model('UserSubscription', UserSubscription);
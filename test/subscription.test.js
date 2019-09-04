'use strict';

process.env.NODE_ENV = 'test';

const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest')(app);

describe('Subscriptions API Integration Tests', function () {

    let auth = {};
    let subscription = {};

    let params = {
        name: 'Basic',
        desc: 'Basic Subscription Plan',
        price: 20
    };

    let metaParams = {
        key: 'project_limit',
        value: 10
    };

    before(require('./auth.test').loginUser(auth));

    describe('#GET /subscriptions', function () {
        it('Get List of Subscription Plans', function (done) {
            request
                .get('/api/v1/subscriptions')
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /subscription', function () {
        it('Create a new Subscription plan', function (done) {
            request
                .post('/api/v1/subscription')
                .expect(200)
                .set({
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': auth.token
                })
                .send(params)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    subscription = res.body.data;
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#PUT /subscription', function () {
        it('Update a Subscription plan', function (done) {
            params.name = 'Standard';
            params.free_trail_days = 20;
            request
                .put(`/api/v1/subscription/${subscription.id}`)
                .expect(200)
                .set({
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': auth.token
                })
                .send(params)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#GET /subscription/:subscription_id', function () {
        it('Get Subscription plan Information', function (done) {
            request
                .get(`/api/v1/subscription/${subscription.id}`)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /subscription/:subscription_id/disable', function () {
        it('Disable Subscription plan', function (done) {
            request
                .post(`/api/v1/subscription/${subscription.id}/disable`)
                .set('Authorization', auth.token)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#GET /subscriptions/disabled', function () {
        it('Get List of Disabled Subscriptions', function (done) {
            request
                .get('/api/v1/subscriptions/disabled')
                .set('Authorization', auth.token)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /subscription/:subscription_id/enable', function () {
        it('Enable Subscription plan', function (done) {
            request
                .post(`/api/v1/subscription/${subscription.id}/enable`)
                .set('Authorization', auth.token)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

});
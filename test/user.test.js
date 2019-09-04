'use strict';

process.env.NODE_ENV = 'test';

const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest')(app);

describe('Users API Integration Tests', function () {

    let auth = {};
    let user = {};

    let params = {
        name: 'Mubarak Asafa',
        username: 'barak1234.tj',
        email: 'starclick1922244@gmail.com',
        password: '123456',
    };

    before(require('./auth.test').loginUser(auth));

    describe('#GET /users', function () {
        it('Get List of Users', function (done) {
            request
                .get('/api/v1/users')
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#GET /users/disabled', function () {
        it('Get List of Disabled Users', function (done) {
            request
                .get('/api/v1/users/disabled')
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /user', function () {
        it('Add new user via invitation', function (done) {
            request
                .post('/api/v1/user')
                .set({
                    'Authorization': auth.token,
                    'content-type': 'application/x-www-form-urlencoded'
                })
                .send(params)
                .expect(200)
                .then(res => {
                    expect(res.body).haveOwnProperty('status').equal('success');
                    user = res.body.data;
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#GET /users/:user_id', function () {
        it('Display user information with role', function (done) {
            request
                .get(`/api/v1/user/${user.id}`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /users/:user_id/disable', function () {
        it('Disable a specific user account', function (done) {
            request
                .post(`/api/v1/user/${user.id}/disable`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /users/:user_id/enable', function () {
        it('Enable a specific user account', function (done) {
            request
                .post(`/api/v1/user/${user.id}/enable`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#PUT /users/:user_id', function () {
        it('Update user information with role', function (done) {
            params.name = params.name + ' update';
            params.role_id = 2;
            params.password = undefined;
            
            request
                .put(`/api/v1/user/${user.id}`)
                .set({
                    'Authorization': auth.token,
                    'content-type': 'application/x-www-form-urlencoded'
                })
                .send(params)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#DELETE /user/:user_id', function () {
        it('Delete User', function (done) {
            request
                .del(`/api/v1/user/${user.id}`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

});
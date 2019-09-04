'use strict';

process.env.NODE_ENV = 'test';

const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest')(app);

describe('Permissions API Integration Tests', function () {

    let auth = {};
    let permission = {};

    let params = {
        name: 'admin dashboard',
        desc: 'View The Admin Dashboard',
    };

    before(require('./auth.test').loginUser(auth));

    describe('#GET /permissions', function () {
        it('Get Permission List', function (done) {
            request.get('/api/v1/permissions')
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    done();
                }).catch(err => done(err));
        });
    });
    describe('#POST /role', function () {
        it('Create Permission', function (done) {
            request.post('/api/v1/permission')
                .set({
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': auth.token
                })
                .send(params)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    permission = res.body.data;
                    done();
                }).catch(err => done(err));
        });
    });
    describe('#GET /permission/:perm_id', function () {
        it('Get Permission Information', function (done) {
            request.get('/api/v1/permission/' + permission.id)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    done();
                }).catch(err => done(err));
        });
    });
    describe('#PUT /permission/:perm_id', function () {
        it('Update Permission', function (done) {
            request.put('/api/v1/permission/' + permission.id)
                .set({
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': auth.token
                })
                .send(params)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    done();
                }).catch(err => done(err));
        });
    });
    describe('#DELETE /permission/:perm_id', function () {
        it('Delete Permission', function (done) {
            request.del('/api/v1/permission/' + permission.id)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });
});

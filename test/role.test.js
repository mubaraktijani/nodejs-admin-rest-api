'use strict';

process.env.NODE_ENV = 'test';

const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest')(app);
const User = require('../app/models/User');
const Permission = require('../app/models/Permission');

describe('Roles API Integration Tests', function () {

    let auth = {};
    let role = {};
    
    let params = {
        name: 'System Admin',
        desc: 'The System Administrator',
        status: 1,
    };

    before(require('./auth.test').loginUser(auth));

    describe('#GET /roles', function () {
        it('Get List of Roles', function (done) {
            request
                .get('/api/v1/roles')
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
        it('Create a New Role', function (done) {
            request
                .post('/api/v1/role')
                .set({
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': auth.token
                })
                .send(params)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    role = res.body.data;
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#GET /role/:role_id', function () {
        it('Get Role Information', function (done) {
            request
                .get('/api/v1/role/' + role.id)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    expect(res.body).haveOwnProperty('data');
                    role = res.body.data;
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#PUT /role/:role_id', function () {
        it('Update Role Information', function (done) {
            request
                .put('/api/v1/role/' + role.id)
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

    describe('#GET /role/:role_id/users', function () {
        it('Get Users in a Role', function (done) {
            request
                .get(`/api/v1/role/${role.id}/users`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });
/*
    describe('#POST /role/:role_id/user', function () {
        it('Assign User to a Role', function (done) {
            request.post(`/api/v1/role/${role.id}/user`)
                .set('Authorization', auth.token)
                .field('user_id', auth.id)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#DELETE /role/:role_id/user/:user_id', function () {
        it('Delete Assigned User from a Role', function (done) {
            request
                .del(`/api/v1/role/${role.id}/user`)
                .set('Authorization', auth.token)
                .field('user_id', auth.id)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });
*/
    describe('#GET /role/:role_id/permissions', function () {
        it('Permission List for a Role', function (done) {
            request
                .get(`/api/v1/role/${role.id}/permissions`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#POST /role/:role_id/permission', function () {
        it('Assign Permission to a Role', function (done) {
            Permission.fetch().then(perm => {
                request
                    .post(`/api/v1/role/${role.id}/permission`)
                    .set('Authorization', auth.token)
                    .field('perm_id', perm.id)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).haveOwnProperty('status').equals('success');
                        done();
                    }).catch(err => done(err));
            });
        });
    });

    describe('#DELETE /role/:role_id/permission/:perm_id', function () {
        it('Delete Assigned Permission from Role', function (done) {
            request
                .del(`/api/v1/role/${role.id}/permission`)
                .set('Authorization', auth.token)
                .field('perm_id', 1)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

    describe('#DELETE /role/:role_id', function () {
        it('Delete Role', function (done) {
            request
                .del(`/api/v1/role/${role.id}`)
                .set('Authorization', auth.token)
                .expect(200)
                .then((res) => {
                    expect(res.body).haveOwnProperty('status').equals('success');
                    done();
                }).catch(err => done(err));
        });
    });

});
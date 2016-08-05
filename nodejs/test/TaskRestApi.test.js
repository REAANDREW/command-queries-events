require('should');
var express = require('express');
var unirest = require('unirest');
var bodyParser = require('body-parser');

var Task = require('../lib/domain/task/model/Task');
var TaskRestApi = require('../lib/domain/task/infra/http/TaskRestApi');
var DomainRepository = require('../lib/core/DomainRepository');

describe('TaskRestApi', () => {

    var domainRepository;
    var apiServer;
    var port;

    beforeEach((done)=>{
        port = 3000;
        domainRepository = new DomainRepository();
        domainRepository.register('task', (evts) => {
            return new Task(evts);
        });
        apiServer = new TaskRestApi(port,domainRepository);
        apiServer.start(done);
    });

    afterEach((done) => {
        apiServer.stop(done);
    });


    it('does something', (done) => {
        unirest.post(`http://localhost:${port}/tasks`)
            .type('json')
            .send({
                name: 'get the milk',
            })
        .end((response) => {
            var newTodoLocation = response.headers.location;
            response.status.should.equal(201);

            unirest.get(newTodoLocation)
            .end((response) => {
                response.body.name.should.eql('get the milk');
                done();
            });

        });
    });

    it('does something', (done) => {
        unirest.post(`http://localhost:${port}/tasks`)
            .type('json')
            .send({
                name: 'get the milk',
            })
        .end((response) => {
            var newTodoLocation = response.headers.location;
            response.status.should.equal(201);

            unirest.get(newTodoLocation)
            .end((response) => {
                response.body.name.should.eql('get the milk');
                done();
            });
        });
    });

});

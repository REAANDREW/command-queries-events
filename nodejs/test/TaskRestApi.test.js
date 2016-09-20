require('should');
var async = require('async');
var express = require('express');
var unirest = require('unirest');
var bodyParser = require('body-parser');

var Task = require('../lib/domain/task/model/Task');
var TaskRestApi = require('../lib/domain/task/infra/http/TaskRestApi');
var DomainRepository = require('../lib/core/DomainRepository');
var EventStore = require('../lib/infra/inproc/EventStore');
var TaskQueryUpdater = require('../lib/domain/task/infra/http/TaskQueryUpdater');
var TaskQueryStore = require('../lib/domain/task/infra/inproc/TaskQueryStore');

describe('TaskRestApi', () => {

    var domainRepository;
    var eventStore;
    var taskQueryUpdater;
    var taskQueryStore;
    var apiServer;
    var port;

    beforeEach((done) => {
        port = 3000;
        eventStore = new EventStore();
        taskQueryStore = new TaskQueryStore();
        taskQueryUpdater = new TaskQueryUpdater(eventStore, taskQueryStore);
        domainRepository = new DomainRepository(eventStore);
        domainRepository.register('task', (evts) => {
            return new Task(evts);
        });
        apiServer = new TaskRestApi(port, domainRepository);
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

    it('get all tasks', (done) => {
        var tasks = ['task1', 'task2', 'task3', 'task4', 'task5'];

        var createTask = (task, callback) => {
            unirest.post(`http://localhost:${port}/tasks`)
                .type('json')
                .send({
                    name: task,
                })
                .end((response) => {
                    callback();
                });
        }

        async.each(tasks, createTask, (err) => {
            unirest.get(`http://localhost:${port}/tasks`)
                .type('json')
                .end((response) => {
                    response.length.should.eql(tasks.length);
                });
        });

    });

});

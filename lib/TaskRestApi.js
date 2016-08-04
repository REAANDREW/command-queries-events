var http = require('http');
var express = require('express');
var unirest = require('unirest');
var bodyParser = require('body-parser');
var _ = require('lodash');

var Task = require('../lib/Task');

class TaskRestApi{

    constructor(port, domainRepository){
        this.port = port;
        this.domainRepository = domainRepository;

        this.app = express();
        this.app.use(bodyParser.json());
        this.app.post('/tasks',(req, res) => {
            this.createTask (req, res);
        });
        this.app.get('/tasks/:id', (req, res) => {
            this.getTaskById(req, res);
        });
        this.app.put('/tasks/:id/start', this.startTask);
        this.app.put('/tasks/:id/stop', this.stopTask);

        this.server = http.createServer(this.app);
    }

    url(path){
        return `http://localhost:${this.port}${path}`;
    }

    createTask(req, res){
        var name = req.body.name;
        var task = new Task(name);
        this.domainRepository.save('task', task);
        res.location(this.url(`/tasks/${task.id()}`));
        res.status(201).json({
            links : [{
                href: this.url(`/tasks/${task.id()}`),
                method: "GET",
                rel: "self"
            },{
                href: this.url(`/tasks/${task.id()}/start`),
                method: "PUT",
                rel: "start"
            },{
                href: this.url(`/tasks/${task.id()}/stop`),
                method: "PUT",
                rel: "stop"
            }]
        });
    }

    getTaskById(req, res){
        var task = this.domainRepository.get('task', req.params.id);
        res.status(201).json(_.merge({}, task,{
            links : [{
                href: this.url(`/tasks/${task.id()}`),
                method: "GET",
                rel: "self"
            },{
                href: this.url(`/tasks/${task.id()}/start`),
                method: "PUT",
                rel: "start"
            },{
                href: this.url(`/tasks/${task.id()}/stop`),
                method: "PUT",
                rel: "stop"
            }]
        }));
    }

    startTask(req, res) {
        var task = this.domainRepository.get('task', req.params.id);
        task.start();
        this.domainRepository.save('task', task);
        res.status(200).json({
            links : [{
                href: this.url(`/tasks/${task.id()}/stop`),
                method: "PUT",
                rel: "stop"
            }]
        });
    }

    stopTask(req, res){
        var task = this.domainRepository.get('task', req.params.id);
        task.stop();
        this.domainRepository.save('task', task);
        res.status(200).json({
            links : [{
                href: this.url(`/tasks/${task.id()}/start`),
                method: "PUT",
                rel: "start"
            }]
        });
    }

    start(callback){
        this.server.listen(this.port, callback);
    }

    stop(callback){
        this.server.close(callback);
    }
}

module.exports = TaskRestApi;


var AggregateRoot = require('./AggregateRoot');

class TaskAction {

}

class Task extends AggregateRoot {
    constructor(name) {
        super(...arguments);

        this.handle('created', this.onCreated);
        this.handle('started', this.onStarted);
        this.handle('stopped', this.onStopped);

        var args = Array.prototype.slice.call(arguments);
        if (args !== undefined && args.length >= 1 && args[0].events !== undefined) {
            this.replay(args[0]);
        } else {
            var evt = {
                name: 'created',
                taskName: name
            };
            this.publish(evt);
        }
    }

    start() {
        if (!this.isStarted) {
            this.publish({
                name: 'started'
            });
        }
    }

    stop() {
        if (this.isStarted) {
            this.publish({
                name: 'stopped'
            });
        }
    }

    info() {
        return this.history;
    }

    onStarted(evt) {
        this.history.push('started');
        this.isStarted = true;
    }

    onStopped(evt) {
        this.history.push('stopped');
        this.isStarted = false;
    }

    onCreated(evt) {
        this.history = ['created'];
        this.name = evt.taskName;
        this.isStarted = false;
    }

}

module.exports = Task;

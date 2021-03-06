var uuid = require('node-uuid');

class AggregateRoot {

    constructor() {
        this.uncommittedEvents = [];
        this.handlers = {};
        this.aggregate_id = uuid.v4();
        this.version = 0;
    }

    handle(name, handler) {
        this.handlers[name] = handler;
    }

    publish(evt, replay) {
        this.handlers[evt.name].call(this, evt);
        if (replay === undefined) {
            evt.objectId = this.aggregate_id;
            evt.correlationId = uuid.v4();
            evt.version = ++this.version;
            this.uncommittedEvents.push(evt);
        }
        this.version = evt.version;
    }

    commit() {
        this.uncommittedEvents = [];
    }

    events() {
        return this.uncommittedEvents;
    }

    id() {
        return this.aggregate_id;
    }

    replay(evts) {
        evts.events.forEach((evt) => {
            this.publish(evt, true);
        })
    }
}

module.exports = AggregateRoot;

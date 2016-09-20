class EventStore {

    constructor() {
        this.events = {};
        this.staged = {};
        this.stream = [];
        this.suscribers = [];
    }

    readFrom(index, subscriber) {
         
    }

    getEventsForAggregate(collection, aggregateId) {
        if (this.events[collection] === undefined){
            return [];
        }
        
        var eventsForObj = this.events[collection][aggregateId] || [];
        return eventsForObj;
    }

    save(collection, aggregateId, events) {
        if (this.staged[collection] === undefined) {
            this.staged[collection] = {};
        }
        var stagedCollection = this.staged[collection][aggregateId]

        if (stagedCollection === undefined) {
            this.staged[collection][aggregateId] = [];
        }

        events.forEach((evt) => {
            this.staged[collection][aggregateId].push(evt);
        });
    }

    commit() {
        for (var collectionKey in this.staged) {
            if (this.events[collectionKey] === undefined) {
                this.events[collectionKey] = {};
            }
            for (var aggregateKey in this.staged[collectionKey]) {
                var eventsCollection = this.events[collectionKey][aggregateKey];
                if (eventsCollection === undefined) {
                    this.events[collectionKey][aggregateKey] = [];
                }

                var events = this.staged[collectionKey][aggregateKey];

                events.forEach((evt) => {
                    this.events[collectionKey][aggregateKey].push(evt);
                });
            }
        }
    }

}

module.exports = EventStore;

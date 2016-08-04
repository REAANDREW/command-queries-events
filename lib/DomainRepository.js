
class DomainRepository {

    constructor() {
        this.prototypes = {};
        this.events = {};
    }

    register(collection, prototype) {
        this.prototypes[collection] = prototype;
    }

    save(collection, aggregateRoot) {
        if (this.events[collection] === undefined) {
            this.events[collection] = {};
        }

        var eventsCollection = this.events[collection][aggregateRoot.id()]
            if (eventsCollection === undefined) {
                this.events[collection][aggregateRoot.id()] = [];
            }

        var events = aggregateRoot.events();


        events.forEach((evt) => {
            this.events[collection][aggregateRoot.id()].push(evt);
        });


        aggregateRoot.commit();
    }


    get(collection, aggregateId) {
        var eventsForObj = this.events[collection][aggregateId] || [];

        var prototype = this.prototypes[collection];

        var obj = prototype({
            events: eventsForObj
        });

        return obj;
    }
}

module.exports = DomainRepository;

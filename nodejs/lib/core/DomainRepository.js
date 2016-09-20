class DomainRepository {

    constructor(eventStore) {
        this.prototypes = {};
        this.eventStore = eventStore;
    }

    register(collection, prototype) {
        this.prototypes[collection] = prototype;
    }

    save(collection, aggregateRoot) {
        var events = aggregateRoot.events();
        this.eventStore.save(collection, aggregateRoot.id(), events);
        aggregateRoot.commit();
    }


    get(collection, aggregateId) {
        var events = this.eventStore.getEventsForAggregate(collection, aggregateId);
        var prototype = this.prototypes[collection];

        var obj = prototype({
            events: events
        });

        return obj;
    }
}

module.exports = DomainRepository;

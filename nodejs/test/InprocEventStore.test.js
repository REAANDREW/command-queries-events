require('should');

var EventStore = require('../lib/infra/inproc/EventStore');

describe('In process Event Store', () => {

    beforeEach(() => {
        this.store = new EventStore();
        this.sampleEvents = [{
            a: 1
        }, {
            a: 2
        }, {
            a: 3
        }, {
            a: 4
        }, {
            a: 5
        }];
    });

    afterEach(() => {

    });

    it('Only returns committed events', () => {
        var collection = "someCollection";
        var aggregateId = "123";
        var evts = this.sampleEvents;

        this.store.save(collection, aggregateId, evts);

        var eventsPlayback = this.store.getEventsForAggregate(collection, aggregateId);
        eventsPlayback.should.eql([]);

        this.store.commit();

        var eventsPlayback = this.store.getEventsForAggregate(collection, aggregateId);
        eventsPlayback.should.eql(evts);
    });

    it('Event Store replays existing events', (done) => {
        var collection = "someCollection";
        var aggregateId = "123";
        var evts = this.sampleEvents;

        this.store.save(collection, aggregateId, evts);

        var receivedEvents = [];
        this.store.readFrom(0, (evt) => {
            receivedEvents.push(evt); 
            if(receivedEvents == evts){
                done();
            }
        });
    });

});

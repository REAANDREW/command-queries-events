var MessageBus = require('../lib/infra/inproc/MessageBus');

describe('InprocMessageBus', () => {

    it.only('single subscriber', () => {

        var someEvent = 'someEvent';
        var bus = new MessageBus();

        var received = false;

        bus.subscribe(someEvent, (evt) => {
            received = true; 
        });

        bus.publish(someEvent, {});

        received.should.eql(true);
    });

});

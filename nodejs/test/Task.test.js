require('should');

var DomainRepository = require('../lib/core/DomainRepository');
var EventStore = require('../lib/infra/inproc/EventStore');
var Task = require('../lib/domain/task/model/Task');

describe('Task', () => {

    it('does something with tasks', () => {
        task = new Task('get the milk');
        task.start();
        task.stop();
        task.start();
        task.info().should.eql(['created', 'started', 'stopped', 'started']);
    });

    it('does replay with a task', () => {
        task = new Task('get the milk');
        task.start();
        task.stop();
        task.start();

        var eventStore = new EventStore();
        var domainRepository = new DomainRepository(eventStore);

        domainRepository.register('task', (evts) => {
            return new Task(evts);
        });

        domainRepository.save('task', task);

        backAgain = domainRepository.get('task', task.id());
        backAgain.info().should.eql(['created', 'started', 'stopped', 'started']);
    });
});

var loki = require('lokijs');
var _ = require('lodash');

class TaskQueryStore {

    constructor() {
        this.db = new loki('tasks.db');
        this.tasks = db.addCollection('tasks');
    }

    save(evt) {
        var current = this.tasks.findOne({
            'objectId': evt.objectId
        }) || {};
        current = _.merge({}, current, evt);
        this.tasks.update(current);
    }

}

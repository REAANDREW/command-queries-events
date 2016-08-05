class MessageBus{

    constructor(){
        this.subscriptions = {};
    }

    subscribe(eventType, func){
        if(this.subscriptions[eventType] === undefined){
            this.subscriptions[eventType] = [];
        }

        this.subscriptions[eventType].push(func);
    }

    publish(eventType, evt){
        var subscribers = this.subscriptions[eventType] || [];

        subscribers.forEach((subscriberFunc) => {
            subscriberFunc(evt);
        });
    }
    
}

module.exports = MessageBus;


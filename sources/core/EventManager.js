function Listener(cb, once) {
    this.cb = cb;
    this.once = once || false;
}

class Event {
    /**
     * @constructor
     * @param name {String}
     * @param data {Object} parameters
     * @param finish {Function}
     */
    constructor(name, data, finish) {
        this._name = name;
        this._data = data;
    }

    get name() {
        return this._name;
    }

    get data() {
        return this._data;
    }
}

export default class EventManager {
    /**
     * @constructor
     */
    constructor() {
        this._listeners = {};

        Object.seal(this);
    }

    /**
     * Fires event
     * @param eventName {String}
     * @param eventData {Object}
     * @param finish
     */
    dispatch(eventName, eventData, finish) {
        let listeners = this._listeners[eventName];
        if (listeners) {
            let event = new Event(eventName, eventData, finish);

            let i = 0;
            while (i < listeners.length) {
                let listener = listeners[i];
                listener.cb(event);
                if (listener.once) {
                    listeners.splice(i, 1);
                } else {
                    ++i;
                }
            }

            if (!event.locked) {
                if (finish) finish();
            }
        } else {
            if (finish) finish();
        }
    }

    /**
     * Subscribes on event
     * @param eventName {String}
     * @param cb {Function} callback
     */
    subscribe(eventName, cb) {
        this._addListener(eventName, new Listener(cb));
    }

    /**
     * Adding of a listener
     * @param eventName
     * @param listener
     * @private
     */
    _addListener(eventName, listener) {
        if (this._listeners[eventName]) {
            this._listeners[eventName].push(listener);
        } else {
            this._listeners[eventName] = [listener];
        }
    }
}

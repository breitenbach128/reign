//import EE from 'eventemitter3';

import EE from '../../utils/eventemitter/EventEmitter.js';
//import EE from '../../utils/eventemitter/eventemitter3.min.js';
class EventEmitter extends EE {
    shutdown() {
        this.removeAllListeners();
    }
    destroy() {
        this.removeAllListeners();
    }
}
export default EventEmitter;
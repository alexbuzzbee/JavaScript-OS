function Device() {
  this.type = "abstract";
  var _listeners = {}; // For partial EventTarget compatibility.

  this.addEventListener = function(type, callback) {
    if (_listeners[type]) {
      _listeners[type].push(callback);
    } else {
      _listeners[type] = [callback];
    }
  };

  this.removeEventListener = function(type, listenerCallback) {
    for (listenerIdx of _listeners[type]) {
      if (_listeners[type][listenerIdx] == listenerCallback) {
        delete _listeners[type][listenerIdx];
        break;
      }
    }
  };

  this.dispatchEvent = function(evt) {
    for (listenerType in _listeners) {
      if (listenerType == evt.type) {
        for (listener of _listeners[listenerType]) {
          listener(evt);
        }
        break;
      }
    }
  };
}

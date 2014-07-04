function Motherboard() {
  this.devices = [];
  this.systemMemory = [];

  // Returns the port of the attached device.
  this.attachDevice = function(device) {
    var port = this.devices.length // The length of an array always equals the next index.
    this.devices[port] = device;
    attachedEvent = new CustomEvent("deviceAttached",
    {
      detail: {
        deviceType: device.type,
        devicePort: port
      },
      bubbles: false,
      cancelable: false
    }); // Create an event, so that we can alert the kernel of the new device.
    this.dispatchEvent(attachedEvent);
    return port; // We know we added the device on this port, so we should return it.
  }

  // Removes a device from the system. Other references to the device can not and will not be removed.
  this.removeDevice = function(port) {
    delete this.devices[port]
  }

  /* Returns 1 if device on port is not the right type, 2 if no port is specified.
   Pass '""' to get any device type. */
  this.getDeviceLink = function(type, port) {
    if (port == null) { // If no port is specified:
      return 2;
    }
    var device = this.devices[port]; // Get the device to return.
    if (device.type == type || type == "") { // If the device has the right type, or the requested type is '""':
      return device;
    } else {
      return 1;
    }
  }

  this.getMemoryPage = function(address) {
    return this.systemMemory[address];
  }

  this.newMemoryPage = function() {
    var address = this.systemMemory.length;
    this.systemMemory[address] = null;
    return address;
  }

  this.deleteMemoryPage = function(address) {
    delete this.systemMemory[address];
  }
}

Motherboard.prototype = new Device()

function System(terminalID) {
  this.motherboard = new Motherboard();
  this.motherboard.attachDevice(new Drive("maindrive"));
  this.motherboard.attachDevice(new Terminal(terminalID));
}

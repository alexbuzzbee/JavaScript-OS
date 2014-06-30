function Motherboard() {
  this.devices = [];
  this.systemMemory = [];
  this.primaries = {};
  this.hasPrimaries = {};

  // Returns the port of the attached device.
  this.attachDevice = function(device) {
    port = this.devices.length // The length of an array always equals the next index.
    this.devices[port] = device;
    if (!this.hasPrimaries[device.type]) { // If the the type of the device has no primary:
      this.changePrimary(port, device.type); // Set the primary for this type to the attached device.
    }
    return port; // We know we added the device on this port, so we should return it.
  }

  // Removes a device from the system. It will remain
  this.removeDevice = function(port) {
    delete this.devices[port]
  }

  /* Returns 1 if device on port is not the right type, 2 if there is no primary for the type.
   Pass '""' to get any device type. */
  this.getDeviceLink = function(type, port) {
    if (!port && this.hasPrimaries[type] == true) { // If no port is specifed, and there is an appropriate primary device:
      var port = this.primaries[type]; // Find the port for the primary of the specified type.
    } else if (!port) { // If no port is specified:
      return 2;
    }
    device = this.devices[port]; // Get the device to return.
    if (device.type == type || type == "") { // If the device has the right type, or the requested type is '""':
      return device;
    } else {
      return 1;
    }
  }

  this.getMemoryPage = function(address) {
    return this.systemMemory[address];
  }

  this.setMemoryPage = function(address, data) {
    this.systemMemory[address] = data;
  }

  this.changePrimary = function(port, type) {
    this.primaries[type] = port;
    this.hasPrimaries[type] = true;
  }
}

function System() {
  this.motherboard = new Motherboard();
  this.motherboard.attachDevice(new HardDrive());
  this.motherboard.attachDevice(new Terminal());
}

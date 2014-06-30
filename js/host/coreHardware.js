function Motherboard() {
  this.devices = [];
  this.systemMemory = [];
  this.primaries = {};
  this.hasPrimaries = {};

  this.attachDevice = function(device) {
    this.devices.push(device);
    if (!this.hasPrimaries[device.type]) {
      this.changePrimary(this.devices.length - 1, device.type);
    }
    return this.devices.length - 1
  }

  this.getDeviceLink = function(type, port) {
    if (!port && this.hasPrimaries[type] == true) {
      var port = this.primaries[type];
    } else if (!port) {
      return false;
    }
    return this.devices[port];
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

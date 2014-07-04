function Kernel(motherboard) {
  var me = this;
  this.motherboard = motherboard;
  this.modules = {};
  this.drivers = [];
  this.driverConstructors = {};
  this.primaries = {};
  this.syscalls = {};

  this.loadModule = function(module) {
    this.modules[module.name] = module;
    this.modules[module.name].onLoad();
  }

  this.unloadModule = function(name) {
    this.modules[name].onUnload();
    delete this.modules[name];
  }

  this.getModule = function(name) {
    return this.modules[name];
  }

  this.loadDriver = function(driver, device) {
    this.drivers.push(driver);
    this.drivers[this.drivers.length - 1].onLoad(device);
    if (this.hasPrimary[driver.type] != true) {
      this.primaries[driver.type];
    }
    return this.drivers.length - 1;
  }

  this.unloadDriver = function(index) {
    this.drivers[index].onUnload();
    delete this.drivers[index];
  }

  this.getDriver = function(deviceType, index) {
    if (this.primaries[deviceType] && index == null) {
      return this.drivers[this.primaries[deviceType]];
    } else {
      return this.drivers[index];
    }
  }

  this.changePrimary = function(port, type) {
    this.primaries[type] = port;
  }

  this.syscall = function(name, data) {
    call = this.syscalls[name];
    call(data);
  }

  this.addSyscall = function(name, func) {
    this.syscalls[name] = func;
  }

  this.removeSyscall = function(name) {
    delete this.syscalls[name];
  }

  this.deviceAddedEvent = function(e) {
  }
}

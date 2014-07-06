function Kernel(motherboard) {
  var me = this;
  var permKey = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); // Random string for permissions key.
  this.motherboard = motherboard;
  this.modules = {};
  this.drivers = [];
  this.primaries = {};
  this.syscalls = {};

  this.__getKey__ = function() {
    return permKey;
  }
}

Kernel.prototype = {
  loadModule: function(module, key) {
    if (key == this.__getKey__()) {
      this.modules[module.name] = module;
      this.modules[module.name].onLoad(this, this.__getKey__());
    }
  },

  unloadModule: function(name, key) {
    if (key == this.__getKey__()) {
      this.modules[name].onUnload();
      delete this.modules[name];
    }
  },

  getModule: function(name) {
    return this.modules[name];
  },

  loadDriver: function(driver, device, key) {
    if (key == this.__getKey__()) {
      this.drivers.push(driver);
      this.drivers[this.drivers.length - 1].onLoad(device, this, this.__getKey__());
      if (this.hasPrimary[driver.type] != true) {
        this.primaries[driver.type];
      }
      return this.drivers.length - 1;
    }
  },

  unloadDriver: function(index, key) {
    if (key == this.__getKey__()) {
      this.drivers[index].onUnload();
      delete this.drivers[index];
    }
  },

  getDriver: function(deviceType, index) {
    if (this.primaries[deviceType] && index == null) {
      return this.drivers[this.primaries[deviceType]];
    } else {
      return this.drivers[index];
    }
  },

  changePrimary: function(index, type, key) {
    if (key == this.__getKey__()) {
      this.primaries[type] = index;
    }
  },

  addSyscall: function(name, func, key) {
    if (key == this.__getKey__()) {
      this.syscalls[name] = func.bind(this);
    }
  },

  removeSyscall: function(name, key) {
    if (key == this.__getKey__()) {
      delete this.syscalls[name];
    }
  },

  syscall: function(name, data) {
    call = this.syscalls[name];
    call(data);
  },

  onBoot: function() {
    this.timeBooted = new Date()
    //this.loadModule(new KernelCore());
    this.motherboard.readyForDeviceEvents();
    var bootEvent = new CustomEvent("kernelBooted", {
      detail: {
        time: this.timeBooted,
        instance: this,
        permKey: this.__getKey__()
      },
      bubbles: false,
      cancelable: false
    });
    this.dispatchEvent(bootEvent);
  },

  __proto__: new EventTargeti()
};

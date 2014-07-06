function Kernel(motherboard) {
  var me = this;
  var permKey = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); // Random string for permissions key.
  this.motherboard = motherboard;
  this.modules = {};
  this.drivers = [];
  this.primaries = {};
  this.syscalls = {};

  this.loadModule = function(module, key) {
    if (key == permKey) {
      this.modules[module.name] = module;
      this.modules[module.name].onLoad(this, permKey);
    }
  }

  this.unloadModule = function(name, key) {
    if (key == permKey) {
      this.modules[name].onUnload();
      delete this.modules[name];
    }
  }

  this.getModule = function(name) {
    return this.modules[name];
  }

  this.loadDriver = function(driver, device, key) {
    if (key == permKey) {
      this.drivers.push(driver);
      this.drivers[this.drivers.length - 1].onLoad(device);
      if (this.hasPrimary[driver.type] != true) {
        this.primaries[driver.type];
      }
      return this.drivers.length - 1;
    }
  }

  this.unloadDriver = function(index, key) {
    if (key == permKey) {
      this.drivers[index].onUnload();
      delete this.drivers[index];
    }
  }

  this.getDriver = function(deviceType, index) {
    if (this.primaries[deviceType] && index == null) {
      return this.drivers[this.primaries[deviceType]];
    } else {
      return this.drivers[index];
    }
  }

  this.changePrimary = function(index, type, key) {
    if (key == permKey) {
      this.primaries[type] = index;
    }
  }

  this.syscall = function(name, data) {
    call = this.syscalls[name];
    call(data);
  }

  this.addSyscall = function(name, func, key) {
    if (key == permKey) {
      this.syscalls[name] = func.bind(me);
    }
  }

  this.removeSyscall = function(name, key) {
    if (key == permKey) {
      delete this.syscalls[name];
    }
  }

  this.onBoot = function() {
    this.timeBooted = new Date()
    //this.loadModule(new KernelCore());
    this.motherboard.readyForDeviceEvents();
    var bootEvent = new CustomEvent("kernelBooted", {
      detail: {
        time: this.timeBooted,
        instance: this,
        permKey: permKey
      },
      bubbles: false,
      cancelable: false
    });
    this.dispatchEvent(bootEvent);
  }
}

Kernel.prototype = new EventTargeti();

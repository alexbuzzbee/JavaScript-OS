function Kernel(motherboard) {
  var me = this;
  this.motherboard = motherboard;
  this.modules = {};
  this.drivers = [];
  this.primaries = {};
  this.syscalls = {};
  this.processes = []; // Array of process data structures. The index in this array is the PID.
  this.timeBooted = null; // Set by onBoot().

  function syscall(pid, name, data) {
    if (pid == 0 || processes[pid].uid == 0 || syscalls[name].needsRoot == false) { // Security.
      me.syscalls[name].call(data);
    }
  }

  this.internalSyscall = function(name, data) {
    syscall(0, name, data);
  }

  this.bindSyscall = function(pid) { // Binds the private syscall function to a process, allowing it to make system calls, and enabling privileged system calls to exist. Part of process creation.
    return syscall.bind(this, pid); // The id of the process is now always passed as the first argument to syscall.
  }
}

Kernel.prototype = {
  loadModule: function(module) {
    this.modules[module.name] = module;
    this.modules[module.name].onLoad(this);
  },

  unloadModule: function(name) {
    this.modules[name].onUnload();
    delete this.modules[name];
  },

  getModule: function(name) {
    return this.modules[name];
  },

  loadDriver: function(driver, device) {
    this.drivers.push(driver);
    this.drivers[this.drivers.length - 1].onLoad(device, this);
    if (this.hasPrimary[driver.type] != true) {
      this.primaries[driver.type];
    }
    return this.drivers.length - 1;
  },

  unloadDriver: function(index) {
    this.drivers[index].onUnload();
    delete this.drivers[index];
  },

  getDriver: function(deviceType, index) {
    if (this.primaries[deviceType] && index == null) {
      return this.drivers[this.primaries[deviceType]];
    } else {
      return this.drivers[index];
    }
  },

  changePrimary: function(index, type) {
    this.primaries[type] = index;
  },

  addSyscall: function(name, func, needsRoot) {
    this.syscalls[name] = { // Special object, containing security info and the bound function to call.
      call: func.bind(this),
      needsRoot: needsRoot
    };
  },

  removeSyscall: function(name) {
    delete this.syscalls[name];
  },

  boot: function() {
    var bootingEvent = new CustomEvent("kernelBooting", {
      detail: {
        time: new Date(),
        instance: this
      },
      bubbles: false,
      cancelable: false
    });
    this.dispatchEvent(bootingEvent);
    // Boot code here
    this.onBoot(); // Boot is now done, so fire onBoot().
  },

  onBoot: function() {
    this.timeBooted = new Date()
    this.motherboard.readyForDeviceEvents(); // Enable device added events.
    var bootEvent = new CustomEvent("kernelBooted", {
      detail: {
        time: this.timeBooted,
        instance: this,
        initialModules: this.modules
      },
      bubbles: false,
      cancelable: false
    });
    this.dispatchEvent(bootEvent);
  },

  __proto__: new EventTargeti()
};

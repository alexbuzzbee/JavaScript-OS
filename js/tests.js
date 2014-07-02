function hardwareTest() {
  function mouseClick(e) {
    console.log("Mouse click at (" + e.detail.x + ", " + e.detail.y + ").")
  }

  function keypress(e) {
    var message = "Key " + e.detail.charPressed + " pressed"
    if (e.detail.ctrl) {
      message += " with control key";
    }
    if (e.detail.alt) {
      message += " with alt key";
    }
    if (e.detail.shift) {
      message += " with shift key";
    }
    message += ".";
    console.log(message);
  }

  var motherboard = new Motherboard();
  var terminal = new Terminal("terminal");
  var drive = new Drive("maindrive");
  motherboard.attachDevice(terminal);
  delete terminal;
  motherboard.attachDevice(drive);
  delete drive;
  var term = motherboard.getDeviceLink("terminal");
  var drv = motherboard.getDeviceLink("drive");
  term.drawing.fillRect(10, 10, 98, 30);
  term.drawing.fillText("Hello, world!", 10, 53)
  term.addEventListener("rawTerminalClick", mouseClick);
  term.addEventListener("rawTerminalKeypress", keypress);
  var inode = drv.createInode();
  console.log("Created inode: " + inode + ".");
  drv.writeInode(inode, "Hello, world!");
  console.log("Inode data is: " + drv.readInode(inode) + "");
  drv.deleteInode(inode);
  delete term;
  return motherboard;
}

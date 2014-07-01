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
  motherboard.attachDevice(terminal);
  delete terminal;
  var term = motherboard.getDeviceLink("terminal");
  term.drawing.fillRect(10, 10, 98, 30);
  term.drawing.fillText("Hello, world!", 10, 53)
  term.addEventListener("rawTerminalClick", mouseClick);
  term.addEventListener("rawTerminalKeypress", keypress);
  delete term;
  return motherboard;
}

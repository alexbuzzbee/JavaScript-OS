function Terminal(elementID) {
  // Private members:
  var _canvas = document.getElementById(elementID);
  var me = this; // For event listeners.
  // Public members:
  this.type = "terminal";
  this.drawing = _canvas.getContext("2d");
  this.width = _canvas.width;
  this.height = _canvas.height;

  // Gets a length-1 string from a keypress event.
  function getChar(event) {
	  if (event.which == null) {
	    return String.fromCharCode(event.keyCode) // IE
	  } else if (event.which!=0 && event.charCode!=0) {
	    return String.fromCharCode(event.which)   // the rest
	  } else {
	    return null // Special key
	  }
	}

  // Clears the screen.
  this.clear = function() {
    this.drawing.clearRect(0, 0, this.width, this.height);
  };

  // Resets the terminal.
  this.reset = function() {
    _canvas.width = _canvas.width;
    this.drawing.strokeStyle = "white";
    this.drawing.textColor = "white";
    this.drawing.fillColor = "white";
  };

  // Finds the terminal-relative location of a mouse click.
  this.getMouseClickLocation = function(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
       x = e.pageX;
        y = e.pageY;
    }
    else {
       x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
             y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= _canvas.offsetLeft;
    y -= _canvas.offsetTop;
    return {x: x, y: y};
  };

  // Event listener for click events.
  this.clickEvent = function(e) {
    var clickedPoint = me.getMouseClickLocation(e);
    var clickX = clickedPoint.x;
    var clickY = clickedPoint.y;
    delete clickedPoint;
    var clickEvent = new CustomEvent("rawTerminalClick",
    {
      detail: {
        x: clickX,
        y: clickY
      },
      bubbles: false,
      cancelable: false
    });
    me.dispatchEvent(clickEvent)
  };

  // Event listener for keypress events.
  this.keypressEvent = function(e) {
    var char = getChar(e);
    var keypressEvent = new CustomEvent("rawTerminalKeypress",
    {
      detail: {
        charPressed: char,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey
      },
      bubbles: false,
      cancelable: false
    });
    me.dispatchEvent(keypressEvent)
  };

  // Event listener for keydown events.
  this.keydownEvent = function(e) {
    e.preventDefault();
    if (getChar(e) == null) {
      var keydownEvent = new CustomEvent("rawTerminalKeydown",
      {
        detail: {
          keyCode: e.keyCode,
          shift: e.shiftKey,
          ctrl: e.ctrlKey,
          alt: e.altKey
        },
        bubbles: false,
        cancelable: false
      });
      me.dispatchEvent(keydownEvent)
    }
  };

  this.drawing.strokeStyle = "white";
  this.drawing.textStyle = "white";
  this.drawing.fillStyle = "white";
  this.drawing.font = "13px monospace";
  _canvas.addEventListener("click", this.clickEvent);
  window.addEventListener("keypress", this.keypressEvent)
}

Terminal.prototype = new Device()

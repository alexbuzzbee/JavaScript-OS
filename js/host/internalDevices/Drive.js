function Drive(name) {
  // Public members:
  this.type = "drive";
  this.volumeName = name;

  this.getInodeTable = function() {
    var table = [];
    for (inode in window.localStorage) {
      var regExp = RegExp(this.volumeName + ":\d*");
      if (regExp.test(inode)) {
        list.push(inode);
      }
    }
    return table;
  }

  this.readInode = function(inode) {
    return window.localStorage[this.volumeName + ":" + inode];
  }

  this.writeInode = function(inode, data) {
    window.localStorage[this.volumeName + ":" + inode] = data;
  }

  this.deleteInode = function(inode) {
    window.localStorage.removeItem(this.volumeName + ":" + inode);
  }

  this.createInode = function() {
    var inodeNum = this.getInodeTable().length;
    this.writeInode(inodeNum, "");
    return inodeNum;
  }

  this.numFiles = function() {
    return window.localStorage.length;
  }
}

Drive.prototype = new Device()

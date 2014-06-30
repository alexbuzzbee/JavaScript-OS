function hardwareTest() {
  motherboard = new Motherboard();
  pcSpeaker = new Device();
  pcSpeaker.type = "speaker";
  motherboard.attachDevice(pcSpeaker);
  delete pcSpeaker;
  speaker = motherboard.getDeviceLink("speaker");
  speaker.channels = 1;
  delete speaker;
  return motherboard;
}

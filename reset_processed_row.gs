function resetLastProcessedRow() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty("lastProcessedRow");
  Logger.log("The last processed row number has been reset.");
}

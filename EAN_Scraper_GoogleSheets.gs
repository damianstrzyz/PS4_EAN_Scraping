function fetchEANForAll_v2() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastProcessedRow = parseInt(scriptProperties.getProperty("lastProcessedRow")) || 1; // Get last processed row

  for (var row = lastProcessedRow + 1; row <= lastRow; row++) {
    var values = sheet.getRange(row, 3, 1, 8).getValues()[0]; // Fetch values in one call

    var cellB = String(values[0]).trim(); // URL
    var cellD = String(values[1]).trim(); // EAN
    var cellE = String(values[2]).trim(); // Language version
    var cellF = String(values[3]).trim(); // Cover (language)
    var cellG = String(values[4]).trim(); // Publisher
    var cellH = String(values[5]).trim(); // Release date
    var cellI = String(values[6]).trim(); // Platform
    var cellJ = String(values[7]).trim(); // Availability

    // Process only rows where result is empty and URL is provided
    if (cellB && (cellD === "" || cellE === "" || cellF === "" || cellG === "" || cellH === "" || cellI === "" || cellJ === "")) {
      try {
        var html = UrlFetchApp.fetch(cellB, { muteHttpExceptions: true }).getContentText();

        var ean = cellD || findValue_v2(html, /EAN:\s*([\d]{12,13})/);
        var languageVersion = cellE || findLanguageVersion_v2(html);
        var coverLanguage = cellF || findCoverLanguage_v2(html);
        var publisher = cellG || findPublisher_v2(html);
        
        var releaseDate = cellH || String(findReleaseDate(html));
        var platform = cellI || findPlatform_v2(html);
        var availability = cellJ || findAvailability_v2(html);

        if (releaseDate) {
          var formattedDate = Utilities.formatDate(new Date(releaseDate), Session.getScriptTimeZone(), "yyyy-MM-dd");
          releaseDate = formattedDate; // Set date format
        }
        // Column H (8) - set format as text
        sheet.getRange(row, 8).setNumberFormat("@");
        
        // Insert only changed values
        sheet.getRange(row, 4, 1, 7).setValues([[ean, languageVersion, coverLanguage, publisher, releaseDate, platform, availability]]);

        // Save last processed row to ScriptProperties
        scriptProperties.setProperty("lastProcessedRow", row.toString());

      } catch (e) {
        sheet.getRange(row, 4).setValue("Page fetch error");
      }

      Utilities.sleep(1000); // 1-second delay (avoid Google limits)
    }
  }

  // If all rows are processed, reset lastProcessedRow
  if (lastProcessedRow >= lastRow) {
    scriptProperties.deleteProperty("lastProcessedRow");
  }
}



function findCoverLanguage_v2(html) {
  var regex = /<div class="col-6 font-weight-bold">Cover \(language\):<\/div>\s*<div class="col-6 text-right">.*?<span class="d-inline-block align-middle">([^<]+)<\/span>/s;
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}

function findLanguageVersion_v2(html) {
  var regex = /<div class="col-6 font-weight-bold">Language version:<\/div>\s*<div class="col-6 text-right">.*?<span class="d-inline-block align-middle">([^<]+)<\/span>/s;
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}

function findPublisher_v2(html) {
  var regex = /<div class="col-4 font-weight-bold">Publisher:<\/div>\s*<div class="col-8 text-right">([^<]+)<\/div>/s;
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}
function findReleaseDate_v2(html) {
  var regex = /<div class="col-4 font-weight-bold">Release date:<\/div>\s*<div class="col-8 text-right">([^<]+)<\/div>/s;
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}
function findPlatform_v2(html) {
  var regex = /<div class="col-4 font-weight-bold">Platform:<\/div>\s*<div class="col-8 text-right">([^<]+)<\/div>/s;
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}
function findAvailability_v2(html) {
  var regex = /<div class="col-sm-6 col-md-12 col-lg-6">.*?<div class="product-card-title small gry">Availability:<\/div>\s*<div class="font-weight-bold">\s*<div class="text-nowrap">([^<]+)<\/div>/s;
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}
// Function to search for values based on a given string pattern
function findValue_v2(html, regex) {
  var match = html.match(regex);
  return match ? match[1].trim() : null;
}

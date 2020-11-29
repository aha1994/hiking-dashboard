const DATE_COL = 0;
const HIKE_COL = 1;
const STATE_COL = 2;
const PARK_COL = 3;
const DISTANCE_COL = 4;
const ELEVATION_COL = 5;
const LAT_COL = 6;
const LON_COL = 7;
const LINK_COL = 8;

// This single method receives all GET requests, and has to conditional on the different endpoints due to limitations in the Google Script internal routing
function doGet(request) {
  var userSheets = {
    "aaron": "1Pnx6iQ4wlqvSXxkbfIV419inI3AVHISyQUL3_Jx4K7Y",
    "ryan": "1gR1_7ytZUeC73lT_U7_GitdnSDPsGnctbKh6W77jFJQ"
  };
  
  var ss = SpreadsheetApp.openById(userSheets["aaron"]);
  var sheet = ss.getActiveSheet();
  
  var fullSheet = sheet.getRange(2, 1, sheet.getLastRow() -  1, 9).getValues();
  
  if (request.parameter.resource == "totalHikes") {
    return ContentService.createTextOutput(JSON.stringify(getTotalHikeCount(fullSheet)));
  } else if (request.parameter.resource == "totalMiles") {
    return ContentService.createTextOutput(JSON.stringify(getTotalDistanceHiked(fullSheet)));
  } else if (request.parameter.resource == "totalElevation") {
    return ContentService.createTextOutput(JSON.stringify(getTotalElevationHiked(fullSheet)));
  } else if (request.parameter.resource == "totalStates") {
    return ContentService.createTextOutput(JSON.stringify(getTotalStatesVisited(fullSheet)));
  } else if (request.parameter.resource == "states") {
    return ContentService.createTextOutput(JSON.stringify(getStatesVisited(fullSheet)));
  } else if (request.parameter.resource == "stateHikeCount") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateHikeCount(fullSheet, request.parameter.state)));
    }
  } else if (request.parameter.resource == "stateMiles") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {      
      return ContentService.createTextOutput(JSON.stringify(getStateDistanceHiked(fullSheet, request.parameter.state)));
    }
  } else if (request.parameter.resource == "stateElevation") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateElevationHiked(fullSheet, request.parameter.state)));
    }
  } else if (request.parameter.resource == "totalParks") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getTotalParksVisited(fullSheet, request.parameter.state)));
    }
  } else if (request.parameter.resource == "hikesByState") {
    return ContentService.createTextOutput(JSON.stringify(getHikesByState(fullSheet)));
  } else if (request.parameter.resource == "hikesByPark") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getHikesByPark(fullSheet, request.parameter.state)));
    }
  } else if (request.parameter.resource == "cumulativeMilesByDate") {
    return ContentService.createTextOutput(JSON.stringify(getCumulativeMilesByDate(fullSheet)));
  } else if (request.parameter.resource == "stateCumulativeMilesByDate") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateCumulativeMilesByDate(fullSheet, request.parameter.state)));
    }
  } else if (request.parameter.resource == "allHikes") {
    return ContentService.createTextOutput(JSON.stringify(getAllHikes(fullSheet)));
  } else if (request.parameter.resource == "stateHikes") {
    if (request.parameter.state == null) {
      return ContentService.createTextOutput("Please provide a state parameter to use this resource.");
    } else {
      return ContentService.createTextOutput(JSON.stringify(getStateHikes(fullSheet, request.parameter.state)));
    }
  } else {
    return ContentService.createTextOutput("I don't recognize that resource.");
  }
}

function getTotalHikeCount(fullSheet) {
  var hikeCount = 0;
  
  for (var row in fullSheet) {
    hikeCount++;
  }
  
  return hikeCount;
}

function getTotalDistanceHiked(fullSheet) {
  var totalDistance = 0.0;
  
  for (var row in fullSheet) {
    var currentDistance = fullSheet[row][DISTANCE_COL];
    
    totalDistance += currentDistance;
  }
  
  return round(totalDistance, 1);
}

function getTotalElevationHiked(fullSheet) {
  var totalElevation = 0.0;
  
  for (var row in fullSheet) {
    var currentElevation = fullSheet[row][ELEVATION_COL];
    
    totalElevation += currentElevation;
  }
  
  return parseInt(totalElevation);
}

function getTotalStatesVisited(fullSheet) {
  return parseInt(getStatesVisited(fullSheet).length);
}

function getStatesVisited(fullSheet) {
  var statesVisited = new Set();
  
  for (var row in fullSheet) {
    var currentState = fullSheet[row][STATE_COL].trim();
    
    statesVisited.add(currentState);
  }
    
  return [...statesVisited].sort();
}

function getStateHikeCount(fullSheet, state) {
  var stateHikeCount = 0;
  
  for (var row in fullSheet) {
    var currentStateValue = fullSheet[row][STATE_COL].trim();
    
    if (currentStateValue == state) {
      stateHikeCount++;
    }
  }
  
  return parseInt(stateHikeCount);
}

function getStateDistanceHiked(fullSheet, state) {
  var stateDistance = 0.0;

  for (var row in fullSheet) {
    var currentStateValue = fullSheet[row][STATE_COL].trim();
    var currentDistance = fullSheet[row][DISTANCE_COL];
    
    if (currentStateValue == state) {
      stateDistance += currentDistance;
    }
  }
  
  return round(stateDistance, 1);
}

function getStateElevationHiked(fullSheet, state) {
  var stateElevation = 0.0;
  
  for (var row in fullSheet) {
    var currentStateValue = fullSheet[row][STATE_COL].trim();
    var currentElevation = fullSheet[row][ELEVATION_COL];
    
    if (currentStateValue == state) {
      stateElevation += currentElevation;
    }
  }
  
  return parseInt(stateElevation);
}

function getTotalParksVisited(fullSheet, state) {
  var parksVisited = new Set();
  
  for (var row in fullSheet) {
    var currentStateValue = fullSheet[row][STATE_COL].trim();
    var currentPark = fullSheet[row][PARK_COL].trim();
    
    if (currentPark == null || currentPark == "") {
      currentPark = "Unknown";
    }
    
    if (currentStateValue == state) {
      parksVisited.add(currentPark);
    }
  }
  
  return parksVisited.size;
}

function getHikesByState(fullSheet) {
  var hikesByState = new Map();
  
  for (var row in fullSheet) {
    var currentStateValue = fullSheet[row][STATE_COL].trim();
    
    if (hikesByState.has(currentStateValue)) {
      hikesByState.set(currentStateValue, hikesByState.get(currentStateValue) + 1);
    } else {
      hikesByState.set(currentStateValue, 1);
    }
  }
  
  var response = [];
    
  for (const [k, v] of hikesByState.entries()) {
    response.push({
      "state": k,
      "count": v,
    });
  }
  
  return response;
}

function getHikesByPark(fullSheet, state) {
  var hikesByPark = new Map();
  
  for (var row in fullSheet) {
    var currentStateValue = fullSheet[row][STATE_COL].trim();
    var currentPark = fullSheet[row][PARK_COL].trim();
    
    if (currentPark == null || currentPark == "") {
      currentPark = "Unknown";
    }
    
    if (currentStateValue == state) {
      if (hikesByPark.has(currentPark)) {
        hikesByPark.set(currentPark, hikesByPark.get(currentPark) + 1);
      } else {
        hikesByPark.set(currentPark, 1);
      }
    }
  }
  
  var response = [];
    
  for (const [k, v] of hikesByPark.entries()) {
    response.push({
      "park": k,
      "count": v,
    });
  }
  
  return response;
}

function getCumulativeMilesByDate(fullSheet) {
  var cumulativeMilesByDate = new Map();
  var cumulativeMiles = 0.0;
  
  for (var row in fullSheet) {
    var currentDate = fullSheet[row][DATE_COL];
    var currentDistance = fullSheet[row][DISTANCE_COL];
    
    cumulativeMiles += currentDistance;
    
    cumulativeMilesByDate.set(currentDate, cumulativeMiles);
  }

  var response = [];
    
  for (const [k, v] of cumulativeMilesByDate.entries()) {
    response.push({
      "date": k,
      "cumulativeMiles": v,
    });
  }

  return response;
}

function getStateCumulativeMilesByDate(fullSheet, state) {
  var cumulativeMilesByDate = new Map();
  var cumulativeMiles = 0.0;
  
  for (var row in fullSheet) {
    var currentDate = fullSheet[row][DATE_COL];
    var currentDistance = fullSheet[row][DISTANCE_COL];
    var currentState = fullSheet[row][STATE_COL].trim();
    
    if (state == currentState) {
      cumulativeMiles += currentDistance;
      
      cumulativeMilesByDate.set(currentDate, cumulativeMiles);
    }
  }

  var response = [];
    
  for (const [k, v] of cumulativeMilesByDate.entries()) {
    response.push({
      "date": k,
      "cumulativeMiles": v,
    });
  }

  return response;
}

function getAllHikes(fullSheet) {
  var response = [];
  
  for (var row in fullSheet) {
    response.unshift({
      "date": new Date(fullSheet[row][DATE_COL]).toLocaleDateString("en-US"),
      "hike": fullSheet[row][HIKE_COL],
      "state": fullSheet[row][STATE_COL].trim(),
      "park": fullSheet[row][PARK_COL].trim(),
      "distance": fullSheet[row][DISTANCE_COL],
      "elevation": fullSheet[row][ELEVATION_COL],
      "latitude": fullSheet[row][LAT_COL],
      "longitude": fullSheet[row][LON_COL],
      "link": fullSheet[row][LINK_COL]
    });
  }
  
  return response;
}

function getStateHikes(fullSheet, state) {
  var response = [];
  
  for (var row in fullSheet) {
    var currentState = fullSheet[row][STATE_COL].trim();
    
    if (currentState == state) {
      response.unshift({
        "date": fullSheet[row][DATE_COL].toLocaleDateString("en-US"),
        "hike": fullSheet[row][HIKE_COL],
        "state": currentState,
        "park": fullSheet[row][PARK_COL].trim(),
        "distance": fullSheet[row][DISTANCE_COL],
        "elevation": fullSheet[row][ELEVATION_COL],
        "latitude": fullSheet[row][LAT_COL],
        "longitude": fullSheet[row][LON_COL],
        "link": fullSheet[row][LINK_COL]
      });
    }
  }
  
  return response;
}

// Taken from: https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

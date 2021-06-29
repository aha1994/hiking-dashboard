const API_BASE_URL = "https://script.google.com/macros/s/AKfycbyOXx6LwCPbrQs1alePFRL4XIBHzIxv5rRQqrgLPCsuMvkZYH4xn1uti4ayMqMcFEuL/exec?resource=";
const USERS = ["Aaron", "Ryan", "Ian"];
var GLOBAL_USER = "Aaron";
var GLOBAL_STATE = "All";
var MARKERS = [];

// Initializing map tile, view tile, and geojson tile
function initializeMap() {
    var map = L.map("map", {
        center: [39.5, -98.35],
        zoom: 4,
        attributionControl: false,
    });

    // Adding tile layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: 'mapbox/streets-v11',
        accessToken: API_KEY,
        }).addTo(map);

    markerHelper(map);
    
    return map;
}

// make markers for each hike location, then add a popup to the marker
function markerHelper(map) {
    for (marker in MARKERS) {
        MARKERS[marker].remove();
    }

    MARKERS = [];

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var responseBody = JSON.parse(this.responseText);

            for (i in responseBody) {
                var lat = responseBody[i]["latitude"];
                var lon = responseBody[i]["longitude"];
                var marker = L.marker([lat, lon]).addTo(map);

                let popup = L.popup({keepInView: true})
                    .setLatLng([lat, lon])
                    .setContent('<h3>' + responseBody[i]["hike"] + ', ' + responseBody[i]["park"] + '</h3>' + 
                                '<h6 id="popText">' + 'Distance: '+ formatNumber(responseBody[i]["distance"]) + '</h6>' +
                                '<h6 id="popText">' + 'Elevation: '+ formatNumber(responseBody[i]["elevation"]) + '</h6>' +
                                "<a href='" + responseBody[i]["link"] + "' target='_blank'>Visit the Hike Here!</a>"
                );

                marker.bindPopup(popup);

                MARKERS.push(marker);
            }
        }
    };

    httpRequest.open("GET", API_BASE_URL + "allHikes" + "&user=" + GLOBAL_USER, true);
    httpRequest.send();
}

function graphScatter(state = "All") {
    var httpRequest = new XMLHttpRequest();

    if (state == "All") {
        httpRequest.onreadystatechange = function() {
            if (this.status == "200") {
                var responseBody = JSON.parse(this.responseText);

                var distances = [];
                var elevations = [];
                for (i in responseBody) {
                    distances.push(responseBody[i]["distance"]);
                    elevations.push(responseBody[i]["elevation"]);
                }

                var trace1 = {
                    x: distances,
                    y: elevations,
                    mode: "markers",
                    type: "scatter",
                };
            
                var data = [trace1]
            
                scatterHelper(data);
            }
        };
    } else {
        httpRequest.onreadystatechange = function() {
            if (this.status == "200") {
                var responseBody = JSON.parse(this.responseText);

                var otherDistances = [];
                var otherElevations = [];
                var stateDistances = [];
                var stateElevations = [];
                for (i in responseBody) {
                    if (responseBody[i]["state"] == state) {
                        stateDistances.push(responseBody[i]["distance"]);
                        stateElevations.push(responseBody[i]["elevation"]);
                    } else {
                        otherDistances.push(responseBody[i]["distance"]);
                        otherElevations.push(responseBody[i]["elevation"]);
                    }
                }

                var traceState = {
                    x: stateDistances,
                    y: stateElevations,
                    mode: 'markers',
                    type: 'scatter',
                    name: `${state}`
                };

                var traceOther = {
                    x: otherDistances,
                    y: otherElevations,
                    mode: 'markers',
                    type: 'scatter',
                    name: 'Other State'
                };

                data = [traceOther, traceState];
            
                scatterHelper(data);
            }
        };
    }

    httpRequest.open("GET", API_BASE_URL + "allHikes" + "&user=" + GLOBAL_USER, true);
    httpRequest.send();
}

function scatterHelper(data) {
    var scatterDiv = document.getElementById("scatter");
            
    var layout = {
        autosize: false,
        height: scatterDiv.clientHeight,
        width: scatterDiv.clientWidth,
        margin: {
            l: 50,
            r: 45,
            b: 35,
            t: 40,
            pad: 4
        },
        title: "Miles Hiked vs Feet Hiked",
        paper_bgcolor: "#648ca6",
        showlegend: false
    };

    Plotly.newPlot("scatter", data, layout);
}

function graphPie(state = "All") {
    var httpRequest = new XMLHttpRequest();

    if (state == "All") {
        httpRequest.onreadystatechange = function() {
            if (this.status == "200") {            
                var responseBody = JSON.parse(this.responseText);

                var hikesByState = new Map();
                for (i in responseBody) {
                    hikesByState.set(STATE_ABBREVIATIONS[responseBody[i]["state"]], parseInt(responseBody[i]["count"]));
                }

                graphPieHelper("Hikes by State", hikesByState);
            }
        };

        httpRequest.open("GET", API_BASE_URL + "hikesByState" + "&user=" + GLOBAL_USER, true);
    } else {
        httpRequest.onreadystatechange = function() {
            if (this.status == "200") {            
                var responseBody = JSON.parse(this.responseText);

                var hikesByPark = new Map();
                for (i in responseBody) {
                    hikesByPark.set(responseBody[i]["park"], parseInt(responseBody[i]["count"]));
                }

                graphPieHelper("State Hikes by Park", hikesByPark);
            }
        };

        httpRequest.open("GET", API_BASE_URL + "hikesByPark&state=" + state + "&user=" + GLOBAL_USER, true);
    }

    httpRequest.send();
}

function graphPieHelper(title, hikesByEntity) {
    var hikesByStatePieChart = document.getElementById("pie");

    let data = [{
        values: [...hikesByEntity.values()],
        labels: [...hikesByEntity.keys()],
        type: "pie",
        textinfo: "label",
        textposition: "outside",
        hole: .4
    }];

    let layout = {
        showlegend: false,
        autosize: false,
        height: hikesByStatePieChart.clientHeight,
        width: hikesByStatePieChart.clientWidth,
        margin: {
            l: 30,
            r: 40,
            b: 30,
            t: 40,
            pad: 4
        },
        title: title,
        plot_bgcolor: "cyan",
        paper_bgcolor: "#648ca6",
        colorway : ['F18A3F', 'F16A45', 'F04C4B', 'EF506F', 'EE5692', 'ED5BB2', 'EC61D0', 'EA66EB', 'CF6BEA', 'B770E9', 'A276E8', '8F7BE7', '8082E6', '859BE5', '8AB1E4', '8FC4E3', '94D5E2', '99E1DF', '9EE0D0', 'A3E0C5']
    };

    Plotly.newPlot("pie", data, layout);
}

function populateLog(state = "All") {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var responseBody = JSON.parse(this.responseText);
            
            var dates = [];
            var hikes = [];
            var states = [];
            var parks = [];
            var distances = [];
            var elevations = [];
            for (i in responseBody) {
                dates.push(responseBody[i]["date"]);
                hikes.push(responseBody[i]["hike"]);
                states.push(responseBody[i]["state"]);
                parks.push(responseBody[i]["park"]);
                distances.push(responseBody[i]["distance"]);
                elevations.push(responseBody[i]["elevation"]);
            }

            var cellValues = [dates, hikes, states, parks, distances, elevations];
            var headers = ["Date", "Hike", "State", "Park", "Distance", "Elevation"];

            var data = [{
                type: "table",
                columnwidth: [500, 1000, 1000, 1000, 400, 600],
                columnorder: [0, 1, 2, 3, 4, 5],
                header: {
                    values: headers,
                    align: "center",
                    line: {width: 1, color: "rgb(50, 50, 50)"},
                    fill: {color: ["F18A3F"]},
                    font: {family: "Arial", size: 8, color: "white"}
                },
                cells: {
                    values: cellValues,
                    align: ["center", "center"],
                    line: {color: "black", width: 1},
                    fill: {color: ["rgba(228, 222, 249, 0.65)', 'rgba(228, 222, 249, 0.65)"]},
                    font: {family: "Arial", size: 9, color: ["black"]}
                }
            }];

            var layout = {
                title: "Log",
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 30,
                    pad: 4
                },
                paper_bgcolor: "#648ca6",
            };

            var config = {responsive: true, autosize: true}

            Plotly.newPlot("log", data, layout, config);
        }
    };

    if (state == "All") {
        httpRequest.open("GET", API_BASE_URL + "allHikes" + "&user=" + GLOBAL_USER, true);
    } else {
        httpRequest.open("GET", API_BASE_URL + "stateHikes&state=" + state + "&user=" + GLOBAL_USER, true);
    }

    httpRequest.send();
}

function cumulativeMiles(state = "All") {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var responseBody = JSON.parse(this.responseText);

            var cumulativeMilesByDate = new Map();
            for (i in responseBody) {
                cumulativeMilesByDate.set(responseBody[i]["date"], parseInt(responseBody[i]["cumulativeMiles"]));
            }

            let data = [{
                x: [...cumulativeMilesByDate.keys()],
                y: [...cumulativeMilesByDate.values()],
                type: "scatter",
            }];
        
            var layout = {
                title: "Cumulative Miles Hiked",
                margin: {
                    l: 30,
                    r: 20,
                    b: 40,
                    t: 30,
                    pad: 4
                },
                paper_bgcolor: "#648ca6",
            };
        
            Plotly.newPlot("cumulative", data, layout);
        }
    }

    if (state == "All") {
        httpRequest.open("GET", API_BASE_URL + "cumulativeMilesByDate" + "&user=" + GLOBAL_USER, true);
    } else {
        httpRequest.open("GET", API_BASE_URL + "stateCumulativeMilesByDate&state=" + state + "&user=" + GLOBAL_USER, true);
    }

    httpRequest.send();
}

function populateYearly(state = "All") {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var responseBody = JSON.parse(this.responseText);
            
            var years = [];
            var counts = [];
            var distances = [];
            var elevations = [];
            for (i in responseBody) {
                years.push(responseBody[i]["year"]);
                counts.push(responseBody[i]["count"]);
                distances.push(responseBody[i]["distance"]);
                elevations.push(formatNumber(responseBody[i]["elevation"]));
            }

            var cellValues = [years, counts, distances, elevations];
            var headers = ["Year", "Count", "Distance", "Elevation"];

            var data = [{
                type: "table",
                columnwidth: [400, 400, 400, 400],
                columnorder: [0, 1, 2, 3],
                header: {
                    values: headers,
                    align: "center",
                    line: {width: 1, color: "rgb(50, 50, 50)"},
                    fill: {color: ["c45fe7"]},
                    font: {family: "Arial", size: 10, color: "white"}
                },
                cells: {
                    values: cellValues,
                    align: ["center", "center"],
                    line: {color: "black", width: 1},
                    fill: {color: ["rgba(228, 222, 249, 0.65)', 'rgba(228, 222, 249, 0.65)"]},
                    font: {family: "Arial", size: 10, color: ["black"]}
                }
            }];

            var layout = {
                title: "Yearly Totals",
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 30,
                    pad: 4
                },
                paper_bgcolor: "#648ca6",
            };

            var config = {responsive: true, autosize: true}

            Plotly.newPlot("yearly", data, layout, config);
        }
    };

    if (state == "All") {
        httpRequest.open("GET", API_BASE_URL + "yearlyTotals" + "&user=" + GLOBAL_USER, true);
    } else {
        httpRequest.open("GET", API_BASE_URL + "stateYearlyTotals&state=" + state + "&user=" + GLOBAL_USER, true);
    }

    httpRequest.send();
}

function addTotals(state = "All") {
    if (state == "All") {
        getDataFromBackend("totalHikes", "totalHikes");
        getDataFromBackend("totalMiles", "totalMiles", "miles");
        getDataFromBackend("totalElevation", "totalElevation", "feet");
        getDataFromBackend("totalStates", "totalStates");

        document.getElementById("totalCounts").textContent = "Total States Visited:"
    } else {
        var params = new Map();
        params.set("state", state);

        getDataFromBackend("totalHikes", "stateHikeCount", "", params);
        getDataFromBackend("totalMiles", "stateMiles", "miles", params);
        getDataFromBackend("totalElevation", "stateElevation", "feet", params);
        getDataFromBackend("totalStates", "totalParks", "", params);

        document.getElementById("totalCounts").textContent = "Total Parks Visited:"
    }
}

function adjustMap(map, state = 'All') {
    map.flyTo([MAP_ZOOMS[`${state}`][0][0], MAP_ZOOMS[`${state}`][0][1]], MAP_ZOOMS[`${state}`][1]);
}

function populateDropdown() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            var states = JSON.parse(this.responseText);
            states.unshift("All");
            
            var stateDropdown = document.getElementById("stateDropdown");

            for (j = stateDropdown.options.length - 1; j >= 0; j--) {
                stateDropdown.remove(j);
            }

            for (i = 0; i < states.length; i++) {
                var newOption = document.createElement("option");
                newOption.text = states[i];
                newOption.value = states[i];

                stateDropdown.add(newOption);
            }
        }
    };

    httpRequest.open("GET", API_BASE_URL + "states" + "&user=" + GLOBAL_USER, true);
    httpRequest.send();
}

function populateUserDropdown() {
    var userDropdown = document.getElementById("userDropdown");    

    for (i = 0; i < USERS.length; i++) {
        var newOption = document.createElement("option");
        newOption.text = USERS[i];
        newOption.value = USERS[i];

        userDropdown.add(newOption);
    }
}

function getDataFromBackend(documentId, resource, unit = "", extraParameters = new Map()) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            document.getElementById(documentId).innerHTML = formatNumber(this.responseText) + " " + unit;
        }
    };  

    var url = API_BASE_URL + resource + "&user=" + GLOBAL_USER;

    for (const [k, v] of extraParameters.entries()) {
        url += "&" + k + "=" + v;
    }

    httpRequest.open("GET", url, true);
    httpRequest.send();
}

// applies filter to dataset to display state specific data, or total data
function selectFilter(state) {
    GLOBAL_STATE = state;

    adjustMap(map, state);

    addTotals(state);
    graphScatter(state);
    graphPie(state);
    populateLog(state);
    cumulativeMiles(state);
    populateYearly(state);
}

function selectUserFilter(user) {
    GLOBAL_USER = user;

    markerHelper(map);

    populateDropdown();

    selectFilter("All");
}

// If you want another "state" to be available in the modal dropdown, it needs to be added to `config.js`
function populateModalStateDropdown() {
    var hikeStateDropdown = document.getElementById("hikeState");    

    for (const state in STATE_ABBREVIATIONS) {
        var newOption = document.createElement("option");
        newOption.text = state;
        newOption.value = state;

        hikeStateDropdown.add(newOption);
    }
}

// Get the modal
var newHikeModal = document.getElementById("newHikeModal");

// When the user clicks on the button, open the modal
var newHikeButton = document.getElementById("newHikeButton");
newHikeButton.onclick = function() {
    var dateControl = document.querySelector('input[type="date"]');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var formattedDate = yyyy + '-' + mm + '-' + dd;

    dateControl.value = formattedDate;

    newHikeModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    newHikeModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == newHikeModal) {
    newHikeModal.style.display = "none";
  }
}

// When the user submits the hike data, send it to backend to be persisted
var newHikeSubmit = document.getElementById("newHikeSubmit");
newHikeSubmit.onclick = function() {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (this.status == "200") {
            selectUserFilter(GLOBAL_USER);
        }
    };  

    var url = API_BASE_URL + "addHike&user=" + GLOBAL_USER;

    url += "&hikeDate=" + document.getElementById("hikeDate").value;
    url += "&hikeName=" + document.getElementById("hikeName").value;
    url += "&hikeState=" + document.getElementById("hikeState").value;
    url += "&hikePark=" + document.getElementById("hikePark").value;
    url += "&hikeDistance=" + document.getElementById("hikeDistance").value;
    url += "&hikeElevation=" + document.getElementById("hikeElevation").value;
    url += "&hikeLatitude=" + document.getElementById("hikeLatitude").value;
    url += "&hikeLongitude=" + document.getElementById("hikeLongitude").value;
    url += "&hikeLink=" + document.getElementById("hikeLink").value;

    httpRequest.open("GET", url, true);
    httpRequest.send();

    newHikeModal.style.display = "none";
}

function hikeNameChanged() {
    var googleMapsLink = document.getElementById("googleMapsLink");
    var hikeName = document.getElementById("hikeName");

    googleMapsLink.href = "https://www.google.com/maps/search/" + hikeName.value;
}

// Helper function to add commas to big numbers
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// initializing the page to display total hikes
let map = initializeMap();
populateUserDropdown();
populateDropdown();
populateModalStateDropdown();

addTotals();
graphScatter();
graphPie();
populateLog();
cumulativeMiles();
populateYearly();

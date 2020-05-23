// Initializing map tile, view tile, and geojson tile
function initalizeMap(){
    var map = L.map("map", {
    center: [39.5, -98.35],
    zoom: 4,
    attributionControl: false,
    });

// Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    }).addTo(map);

// adding markers
    d3.csv('static/data/hike_data.csv', function(dataset){
        // console.log(dataset);
        function formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          }
        // make markers for each hike location, then add a popup to the marker
        for (let i = 0; i < dataset.length; i++){
            lat = dataset[i].Lat;
            lon = dataset[i].Lon;
            let m = L.marker([lat,lon]).addTo(map);
            let p = L.popup({keepInView: true}).setLatLng([dataset[i].Lat,dataset[i].Lon]).setContent(
                '<h3>' + dataset[i].Hike + ', ' + dataset[i].Park + '</h3>' + 
                '<h6 id="popText">' + 'Distance: '+ formatNumber(dataset[i].Distance) + '</h6>' +
                '<h6 id="popText">' + 'Elevation: '+ formatNumber(dataset[i].Elevation_Gain) + '</h6>' +
                "<a href='" + dataset[i].Url + "'>Visit the Hike Here!</a>"
            );
            m.bindPopup(p);
        }
        
    });
    return map
};

function graphScatter(state = 'All'){
    d3.csv('static/data/hike_data.csv', function(dataset){
        if(state == 'All'){
            dataset = dataset;
            let x_axis = [];
            let y_axis = [];
            var myDiv = document.getElementById("scatter");
            for (let i = 0; i < dataset.length; i++){
                x_axis.push(parseFloat(dataset[i].Distance))
                y_axis.push(parseFloat(dataset[i].Elevation_Gain))
            };
            var trace1 = {
                x: x_axis,
                y: y_axis,
                mode: 'markers',
                type: 'scatter',
            };
            var data = [trace1]
            var layout = {
                autosize: false,
                height: myDiv.clientHeight,
                width: myDiv.clientWidth,
                margin: {
                    l: 50,
                    r: 45,
                    b: 35,
                    t: 40,
                    pad: 4
                },
                title: 'Miles Hiked vs Feet Hiked',
                paper_bgcolor: '#648ca6',
            };
            Plotly.newPlot('scatter', data, layout);
        } else{
            stateDF = dataset.filter(d => d.State == state);
            otherDF = dataset.filter(d => d.State !== state);
            var myDiv = document.getElementById("scatter");

            let x_axis_state = [];
            let y_axis_state = [];
            let x_axis_other = [];
            let y_axis_other = [];

            for (let i = 0; i < stateDF.length; i++){
                x_axis_state.push(parseFloat(stateDF[i].Distance));
                y_axis_state.push(parseFloat(stateDF[i].Elevation_Gain));
            };
            
            for (let i = 0; i < otherDF.length; i++){
                x_axis_other.push(parseFloat(otherDF[i].Distance));
                y_axis_other.push(parseFloat(otherDF[i].Elevation_Gain));
            };
            var traceState = {
                x: x_axis_state,
                y: y_axis_state,
                mode: 'markers',
                type: 'scatter',
                name: `${state}`
            };
            var traceOther = {
                x: x_axis_other,
                y: y_axis_other,
                mode: 'markers',
                type: 'scatter',
                name: 'Other State'
            };
            data = [traceOther, traceState];
            var layout = {
                autosize: false,
                height: myDiv.clientHeight,
                width: myDiv.clientWidth,
                margin: {
                    l: 50,
                    r: 45,
                    b: 35,
                    t: 40,
                    pad: 4
                },
                title: 'Miles Hiked vs Feet Hiked',
                paper_bgcolor: '#648ca6',
                showlegend: false,
            };
            Plotly.newPlot('scatter', data, layout)
        };

    })
};

function graphPie(state = 'All'){
    d3.csv('static/data/hike_data.csv', function(dataset){
        //console.log(dataset);
        let colorscale = ['F18A3F','F16A45','F04C4B','EF506F','EE5692','ED5BB2','EC61D0','EA66EB','CF6BEA','B770E9','A276E8','8F7BE7','8082E6','859BE5','8AB1E4','8FC4E3','94D5E2','99E1DF','9EE0D0','A3E0C5']
        
        if(state == 'All'){
            dataset = dataset;
            visits = [];
            for (let i=0; i < dataset.length; i++){
                visits.push(dataset[i].abr)
            };
            states = {};
            for (let i=0; i<visits.length; i++){
                x = visits[i];
                if (states[x] !== undefined){
                    states[x]++
                } else {
                    states[x] = 1;
                }
            }
            var myDiv = document.getElementById("pie");
            let data = [{
                values: Object.values(states),
                labels: Object.keys(states),
                type: 'pie',
                textinfo: 'label',
                textposition: 'outside',
            }];
            let layout = {
                showlegend:false,
                autosize: false,
                height: myDiv.clientHeight,
                width: myDiv.clientWidth,
                margin: {
                    l: 30,
                    r: 40,
                    b: 30,
                    t: 40,
                    pad: 4
                },
                title: 'Hikes by State',
                plot_bgcolor: 'cyan',
                paper_bgcolor: '#648ca6',
                colorway : colorscale
            };
            Plotly.newPlot('pie', data, layout);
        } else{
            dataset = dataset.filter(d => d.State == state);
            visits = [];
            for (let i=0; i < dataset.length; i++){
                visits.push(dataset[i].Park)
            };
            parks_hiked = {};
            for (let i=0; i<visits.length; i++){
                x = visits[i];
                if (parks_hiked[x] !== undefined){
                    parks_hiked[x]++
                } else {
                    parks_hiked[x] = 1;
                }
            };
            var myDiv = document.getElementById("pie");
            let data = [{
                values: Object.values(parks_hiked),
                labels: Object.keys(parks_hiked),
                type: 'pie',
                textinfo: 'percent',
                textposition: 'inside',
            }];
            let layout = {
                showlegend:false,
                autosize: false,
                height: myDiv.clientHeight,
                width: myDiv.clientWidth,
                margin: {
                    l: 30,
                    r: 40,
                    b: 30,
                    t: 40,
                    pad: 4
                },
                title: `Parks Hiked in ${state}`,
                plot_bgcolor: 'cyan',
                paper_bgcolor: '#648ca6',
                colorway : colorscale
            };
            Plotly.newPlot('pie', data, layout);
        };

        
    })
}

function populateLog(state = 'All'){
    Plotly.d3.csv('static/data/hike_data.csv', function(err,rows){
        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        };

        if(state == 'All'){
            rows = rows;
        } else{
            rows = rows.filter(r => r.State == state)
        };

        var headerNames = Plotly.d3.keys(rows[0]);
        var wantedNames = headerNames.slice(0,7);
        wantedNames.splice(3,1);
        var headerValues = [];
        var cellValues = [];
        for (i = 0; i < wantedNames.length; i++) {
            headerValue = [wantedNames[i]];
            headerValues[i] = headerValue;
            cellValue = unpack(rows, wantedNames[i]);
            cellValues[i] = cellValue;
        };

        // Have this for loop run in order to make the table show
        // most recent event at the top
        for (i = 0; i < cellValues.length; i++){
            cellValues[i] = cellValues[i].reverse()
        };
        var data = [{
            type: 'table',
            columnwidth: [500,1000,1000,1000,400,600],
            columnorder: [0,1,2,3,4,5],
            header: {
              values: headerValues,
              align: "center",
              line: {width: 1, color: 'rgb(50, 50, 50)'},
              fill: {color: ['F18A3F']},
              font: {family: "Arial", size: 8, color: "white"}
            },
            cells: {
              values: cellValues,
              align: ["center", "center"],
              line: {color: "black", width: 1},
              fill: {color: ['rgba(228, 222, 249, 0.65)', 'rgba(228, 222, 249, 0.65)']},
              font: {family: "Arial", size: 9, color: ["black"]}
            }
        }];
        var layout = {
            title: "Aaron's Hiking Log",
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 30,
                pad: 4
            },
            paper_bgcolor: '#648ca6',
        };
        var config = {responsive: true,autosize: true}
        Plotly.newPlot('log', data, layout, config);
        
    })
}

function cumulativeMiles(state = 'All'){
    d3.csv('static/data/hike_data.csv', function(dataset){
        // console.log(dataset);
        if(state == 'All'){
            dataset = dataset;
        } else{
            dataset = dataset.filter(d => d.State == state)
        };

        dates = [];
        miles = [];
        date_strings = [];
        for (let i = 0; i < dataset.length; i++){
            date = dataset[i].Date;
            dist = dataset[i].Distance;
            date_strings.push(date)
            dates.push(Date.parse(date));
            miles.push(parseFloat(dist));
        };
        // console.log(date_strings)
        cumulative_miles = [];
        miles.reduce(function(a,b,i) { return cumulative_miles[i] = a+b; },0);

        let data = [{
            x: date_strings,
            y: cumulative_miles,
            type: 'scatter',
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
            paper_bgcolor: '#648ca6',
            
        };

        Plotly.newPlot('cumulative', data, layout)

    })
}

function addTotals(state = 'All'){
    d3.csv('static/data/hike_data.csv', function(dataset){
       // console.log(dataset);
       if(state == 'All'){
           dataset = dataset;
       } else{
           dataset = dataset.filter(d => d.State == state)
       };
       // console.log(dataset)
       function countUnique(iterable) {
        return new Set(iterable).size;
      }
        miles = [];
        elevations = [];
        states = [];
        parks = [];
        for (let i = 0; i < dataset.length; i++){
            mile = dataset[i].Distance;
            elevation = dataset[i].Elevation_Gain;
            miles.push(parseFloat(mile));
            elevations.push(parseFloat(elevation));
            states.push(dataset[i].State);
            parks.push(dataset[i].Park);
        }
        let totalHikes = miles.length
        let totalMiles = Math.round(miles.reduce((a,b) => a + b,0) * 10)/10;
        let totalElevation = elevations.reduce((a,b) => a + b,0);
        
        function formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        }
        
        document.getElementById('totalHikes').innerHTML = totalHikes;
        document.getElementById('totalMiles').innerHTML = formatNumber(totalMiles) + ' miles';
        document.getElementById('totalElevation').innerHTML = formatNumber(totalElevation) + ' feet';
        
        if (state == 'All'){
            document.getElementById('totalStates').innerHTML = countUnique(states);
            document.getElementById('totalCounts').textContent = 'Total States visited:'
        } else{
            document.getElementById('totalStates').innerHTML = countUnique(parks);
            document.getElementById('totalCounts').textContent = 'Total Parks visited:'
        }
        
    })
}

function populateDropDown(){
    d3.csv('static/data/hike_data.csv', function(dataset){
        // console.log(dataset);
        function countUnique(iterable) {
            return new Set(iterable);
          }
        states = [];
        for (let i = 0; i < dataset.length; i++) {
            state = dataset[i].State;
            states.push(state)
        }
        states = countUnique(states)
        states = Array.from(states).sort()
        states.unshift('All')
        // console.log(states)
        var selectDrop = d3.select('#dropdown')
        // console.log(states[0])
        selectDrop.selectAll('option')
            .data(states)
            .enter()
            .append('option')
            .text(function(d) {return d})
            .attr(function(d) {return d})
    })
};

function adjustMap(state = 'All', map){
    map.flyTo([map_zooms[`${state}`][0][0], map_zooms[`${state}`][0][1]], map_zooms[`${state}`][1]);
};

// applys filter to dataset to display state specific data, or total data
function selectFilter(state){
    adjustMap(state, map);
    graphScatter(state);
    graphPie(state);
    populateLog(state);
    cumulativeMiles(state);
    addTotals(state);
};

// initalizing the page to display total hikes
let map = initalizeMap();
populateDropDown();
graphScatter();
graphPie();
populateLog();
cumulativeMiles();
addTotals();



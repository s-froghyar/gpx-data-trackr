function distance_on_geoid(lat1, lon1, lat2, lon2){
  // Convert degrees to radians
      lat1 = lat1 * Math.PI / 180.0;
      lon1 = lon1 * Math.PI / 180.0;

      lat2 = lat2 * Math.PI / 180.0;
      lon2 = lon2 * Math.PI / 180.0;

      // radius of earth in metres
      var r = 6378100;

      // P
      var rho1 = r * Math.cos(lat1);
      var z1 = r * Math.sin(lat1);
      var x1 = rho1 * Math.cos(lon1);
      var y1 = rho1 * Math.sin(lon1);

      // Q
      var rho2 = r * Math.cos(lat2);
      var z2 = r * Math.sin(lat2);
      var x2 = rho2 * Math.cos(lon2);
      var y2 = rho2 * Math.sin(lon2);

      // Dot product
      var dot = (x1 * x2 + y1 * y2 + z1 * z2);
      var cos_theta = dot / (r * r);

      var theta = Math.acos(cos_theta);

      // Distance in Metres
      return r * theta;
    }






mapboxgl.accessToken = 'pk.eyJ1IjoidGhlc29tYTMwMCIsImEiOiJjam94OHN2dzgxaTRkM3FzMzl5NDU3a3IyIn0.Am7pOpgO-vgd6gNt7fPdUQ';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [-4.25763, 55.86515], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

var ctx = document.getElementById("myChart");
var stx = document.getElementById("speedChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
      datasets: [{
          label: 'Elevation',
          data: [0],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',

          ],
          borderColor: [
              'rgba(255,99,132,1)',

          ],
          borderWidth: 1
      }]
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }]
      }
  }
});
var speedChart = new Chart(stx, {
    type: 'bar',
    data: {

        datasets: [{
            label: 'Speed',
            data: [0],
            backgroundColor: [
                'rgba(0, 32, 244, 0.2)',

            ],
            borderColor: [
                'rgba(0, 32, 244, 0.2)',

            ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        elements: {
            line: {
                tension: 0, // disables bezier curves
            }
        }
    }
  });



document.getElementById("mySidepanel").style.width = "0px";
function toggleNav() {
  if (document.getElementById("mySidepanel").style.width == "0px"){
    document.getElementById("mySidepanel").style.width = "15%";
    document.getElementById("map").style.width = "85%";
    document.getElementById("bottom").style.width = "85%";
    console.log(document.getElementById("mySidepanel").style.width);
  }else{
    document.getElementById("mySidepanel").style.width = "0px";
    document.getElementById("map").style.width = "100%";

    document.getElementById("bottom").style.width = "100%";
    console.log(document.getElementById("mySidepanel").style.width);
}
}

var counter = 0;
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("loadGPXFile-form").addEventListener('submit', function(e){
        e.preventDefault();
        gpx = new gpxParser();
        counter = counter + 1;
        console.log(gpx);
        let file = document.getElementById('loadGPXFile-input').files[0];
        console.log(file);
        var reader = new FileReader();
        reader.onload = function(event) {
            gpx.parse(reader.result)
            // console.log(gpx.tracks[0].points[0]);

            console.log(gpx);
            //create route:
            var listOfPoints = [];
            var length = gpx.tracks[0].points.length;
            console.log(length);
            var sumA = 0;
            var sumB = 0;
            var listOfElevations = [];
            var listOfTimes = [];
            var listOfDates = [];
            var listOfSpeed = [0];



            var pred = gpx.tracks[0].points[0];
            for (var i = 1; i < length; i++){
                  var buffer = gpx.tracks[0].points[i];
                  listOfPoints.push([buffer.lon, buffer.lat]);
                  sumA = sumA + buffer.lon;
                  sumB = sumB + buffer.lat;
                  var bu = buffer.time.slice(11, buffer.time.length);
                  listOfElevations.push(buffer.ele);
                  listOfTimes.push(bu);
                  listOfDates.push(buffer.time);
                  if(i>0){
                    //Speed
                    var dist = distance_on_geoid(pred.lat, pred.lon, buffer.lat, buffer.lon);

                    // var ts1 = new Date(parseInt(pred.time.slice(0,4)), parseInt(pred.time.slice(5,7))-1, parseInt(pred.time.slice(8,10)), parseInt(pred.time.slice(11,13)), parseInt(pred.time.slice(14,16)), parseInt(pred.time.slice(17,19)),);
                    // var ts2 = new Date(parseInt(buffer.time.slice(0,4)), parseInt(buffer.time.slice(5,7))-1, parseInt(buffer.time.slice(8,10)), parseInt(buffer.time.slice(11,13)), parseInt(buffer.time.slice(14,16)), parseInt(buffer.time.slice(17,19)),);

                    var time_s = 1; //(ts2 - ts1) / 1000.0;
                    var speed_mps = dist / time_s;
                    var speed_kph = (speed_mps * 3600.0) / 1000.0;
                    // console.log(speed_kph);
                    listOfSpeed.push(speed_kph);

                    // pred = gpx.tracks[0].points[i];

                  }

                }



                //TIME
                var startTime = listOfDates[0];
                var endTime = listOfDates[length-2];
                var date1 = new Date(parseInt(startTime.slice(0,4)), parseInt(startTime.slice(5,7))-1, parseInt(startTime.slice(8,10)), parseInt(startTime.slice(11,13)), parseInt(startTime.slice(14,16)), parseInt(startTime.slice(17,19)),);
                var date2 = new Date(parseInt(endTime.slice(0,4)), parseInt(endTime.slice(5,7))-1, parseInt(endTime.slice(8,10)), parseInt(endTime.slice(11,13)), parseInt(endTime.slice(14,16)), parseInt(endTime.slice(17,19)),);
                var diff = date2-date1;
                var msec = diff;
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                msec -= mm * 1000 * 60;
                var ss = Math.floor(msec / 1000);
                var timeString = hh + "h " + mm + "m " + ss + "sec";
                document.getElementById("timePH").innerHTML = timeString;


                // console.log(listOfSpeed);
                //divide into 5 bars
                //ascending order
                // listOfSpeed.sort();
                console.log(listOfSpeed);
                var dat1 = [];
                var dat2 = [];
                var dat3 = [];
                var dat4 = [];
                var dat5 = [];

                var max_speed = Math.max.apply(null,listOfSpeed);
                var min_speed = Math.min.apply(null,listOfSpeed);
                // dividers:
                var div1 = min_speed + (max_speed - min_speed)/5;
                var div2 = min_speed + 2*(max_speed - min_speed)/5;
                var div3 = min_speed + 3*(max_speed - min_speed)/5;
                var div4 = min_speed + 4*(max_speed - min_speed)/5;
                //
                var lab1 = min_speed.toFixed(2) + "km/h - " + div1.toFixed(2) + "km/h";
                var lab2 = div1.toFixed(2) + "km/h - " + div2.toFixed(2) + "km/h";
                var lab3 = div2.toFixed(2) + "km/h - " + div3.toFixed(2) + "km/h";
                var lab4 = div3.toFixed(2) + "km/h - " + div4.toFixed(2) + "km/h";
                var lab5 = div4.toFixed(2) + "km/h - " + max_speed.toFixed(2) + "km/h";
                // console.log(max_speed);
                // console.log(min_speed);
                // console.log(div1);
                for (var j = 0; j < listOfSpeed.length; j++){
                  if(listOfSpeed[j] < div1){
                    dat1.push(listOfSpeed[j]);
                  }else if(listOfSpeed[j] < div2){
                    dat2.push(listOfSpeed[j]);
                  }else if(listOfSpeed[j] < div3){
                    dat3.push(listOfSpeed[j]);
                  }else if(listOfSpeed[j] < div4){
                    dat4.push(listOfSpeed[j]);
                  }else{
                    dat5.push(listOfSpeed[j]);
                  }
                }



                var lonAverage = sumA / length;
                var latAverage = sumB / length;
                //recenter
                map.flyTo({ center: [lonAverage, latAverage] });
                //add line to map
                map.addLayer({
                    "id": "route" + counter,
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "LineString",
                                "coordinates": listOfPoints
                            }
                        }
                    },
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    "paint": {
                        "line-color": "#888",
                        "line-width": 8
                    }
                });

                document.getElementById("distancePH").innerHTML = (gpx.tracks[0].distance.total/1000).toFixed(2) + " km";

                var myChart = new Chart(ctx, {
                  type: 'line',
                  data: {
                      labels: listOfTimes,
                      datasets: [{
                          label: 'Elevation',
                          data: listOfElevations,
                          backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',

                          ],
                          borderColor: [
                              'rgba(255,99,132,1)',

                          ],
                          borderWidth: 1
                      }]
                  },
                  options: {
                      maintainAspectRatio: false,
                      responsive: true,
                      elements: {
                          line: {
                              tension: 0, // disables bezier curves
                          }
                      }
                  }
                });

                var speedChart = new Chart(stx, {
                  type: 'bar',
                  data: {
                      labels: [lab1, lab2, lab3, lab4, lab5],
                      datasets: [{
                          label: 'Speed',
                          data: [dat1.length, dat2.length, dat3.length, dat4.length, dat5.length],
                          backgroundColor:'rgba(0, 32, 244, 0.2)',
                          borderColor:'rgba(255, 99, 132, 0.2)',
                          borderWidth: 1
                      }]
                  },
                  options: {
                      scales: {
                          xAxes: [{
                              ticks: {
                                  fontSize: 5
                              }
                          }]
                      },
                      maintainAspectRatio: false,
                      responsive: true,
                      elements: {
                          line: {
                              tension: 0, // disables bezier curves
                          }
                      }
                  }
                });

                console.log(listOfElevations);


            };
            reader.readAsText(file);
        });
    });

//Với cách gọi hàm 2 lần, sẽ ko xảy ra lỗi khi thực hiện truy vấn, nhưng vẫn ko thể đưa giá trị vào bên trong showPosition()
navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position){
  mapboxgl.accessToken = 'pk.eyJ1IjoicXVhbmdzIiwiYSI6ImNrMzhkaG95aDA3cG8zam92dmgyOHlpNmUifQ.-mfQa_gH2wP8shcufQtNJg';
      var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/quangs/cjuguj3290ois1fmofobeancm',
          center: [position.coords.longitude, position.coords.latitude],
          //center: [ 106.768609, 10.85006],  //SPKT TPHCM
          zoom: 17,
          bearing: -12,
          pitch: 60,
          interactive: false
      });
      var Lng = position.coords.longitude;
      var Lat = position.coords.latitude;
      // Add zoom and rotation controls to the map.
      map.addControl(new mapboxgl.NavigationControl());
  
      // pixels the map pans when the up or down arrow is clicked
      var deltaDistance = 100;
  
      // degrees the map rotates when the left or right arrow is clicked
      var deltaDegrees = 25;
  
      function easing(t) {
          return t * (2 - t);
      }
  
      map.on('load', function() {
          // Insert the layer beneath any symbol layer.
          var layers = map.getStyle().layers;
          
          var labelLayerId;
          for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
          }
      }
  
              map.addLayer({
                  'id': '3d-buildings',
                  'source': 'composite',
                  'source-layer': 'building',
                  'filter': ['==', 'extrude', 'true'],
                  'type': 'fill-extrusion',
                  'minzoom': 5,
                  'paint': {
                  'fill-extrusion-color': '#31e031',
                  
                  // use an 'interpolate' expression to add a smooth transition effect to the
                  // buildings as the user zooms in
                  'fill-extrusion-height': [
                  "interpolate", ["linear"], ["zoom"],
                  5, 0,
                  5.05, ["get", "height"]
                  ],
                  'fill-extrusion-base': [
                  "interpolate", ["linear"], ["zoom"],
                  5, 0,
                  5.05, ["get", "min_height"]
                  ],
                  'fill-extrusion-opacity': .6
                  }
          }, labelLayerId);
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
  
          map.getCanvas().focus();
  
          map.getCanvas().addEventListener('keydown', function(e) {
              e.preventDefault();
              if (e.which === 38) { // up
                  map.panBy([0, -deltaDistance], {
                      easing: easing
                  });

              } else if (e.which === 40) { // down
                  map.panBy([0, deltaDistance], {
                      easing: easing
                  });
              } else if (e.which === 37) { // left
                  map.easeTo({
                      bearing: map.getBearing() - deltaDegrees,
                      easing: easing
                  });
              } else if (e.which === 39) { // right
                  map.easeTo({
                      bearing: map.getBearing() + deltaDegrees,
                      easing: easing
                  });
              }
          }, true);
      });
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
   //new maker
 
//ko thể sử dụng câu truy vấn trong này, phải tìm cách khác


  var player = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Lng, Lat]
        //coordinates: [106.768609, 10.850066] //SPKT TPHCM
      }
    }]
  };
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //lấy dữ liệu từ mysql lên html
    var players;
    //'satoshi là để gọi bên css'
    player.features.forEach(function(satoshi) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'satoshi';
        // make a marker for each feature and add to the map 
        players = new mapboxgl.Marker(el,{
          draggable: true
        })
        .setLngLat(satoshi.geometry.coordinates)
      .addTo(map);
      });
 //////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//// add pokemon to map
//tham khảo : https://docs.mapbox.com/mapbox-gl-js/example/set-popup/
//Đặc biệt, chỉ sử dụng cho darkrai: https://www.abeautifulsite.net/adding-and-removing-elements-on-the-fly-using-javascript
//////////////////////////////////////////////////////////////////////////////////////

function onDragEnd() {
//////mỗi lần rê chuột, là mỗi lần reload lại toàn bộ nội dung của map. Vì bản chất hàm này là thế. 
  var lngLat, pklp, pklm, pkap, pkam, popup, monument, el;
        lngLat = players.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat ;
////////////////////// pokestop//////////////////////////////////////////////
  //position
  monument = [Lng-0.003, Lat+0.001];
  var pokestoplong = Lng-0.001;
  var pokestoplat = Lat+0.002;
  // create the popup
  // set các vị trí bắt
  pklp = pokestoplong+0.0015;
  pklm = pokestoplong-0.0015;
  pkap = pokestoplat+0.0015;
  pkam = pokestoplat-0.0015;
   //check position
  var check = calculate(lngLat.lng, pokestoplong, pklp, pklm, lngLat.lat, pokestoplat, pkap, pkam);
  if(check)
  {
           // create DOM element for the marker
           el = document.createElement('div');
           el.id = 'pkstop';
          //create popup
          popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML('<p>This is Stop!!!</p>'+
              '<form action="stop" method="POST">'+
                '<input type="submit" value="Get">'+
              '</form>');
      }else {
          //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
          popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML('<p>You must come closer</p>');
           // create DOM element for the marker 
           el = document.createElement('div');
           el.id = 'nopkm';
          //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
        }
       // create the marker
       new mapboxgl.Marker(el)
       .setLngLat(monument)
       .setPopup(popup) // sets a popup on this marker
     .addTo(map);        
////////////////////// gengar //////////////////////////////////////////////
  //position
  monument = [Lng-0.005, Lat+0.005];
  var genlong = Lng-0.005;
  var genlat = Lat+0.005;
  // create the popup
  // set các vị trí bắt
  pklp = genlong+0.0015;
  pklm = genlong-0.0015;
  pkap = genlat+0.0015;
  pkam = genlat-0.0015;
   //check position
  var check = calculate(lngLat.lng, genlong, pklp, pklm, lngLat.lat, genlat, pkap, pkam);
  if(check)
  {
           // create DOM element for the marker
           el = document.createElement('div');
           el.id = 'gen';
          //create popup
          popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML('<p>Name : Gengar</p>'+
              '<p>Type: Ghost/Poison</p>'+
              '<p>Gender: 50% ♂ / 50% ♀</p>'+
              '<p>Weight : 89.3 lbs. 40.5 kg</p>'+
              '<p>Height : 1.5 m</p>'+
            '<form action="poke1" method="POST">'+
              '<input type="submit" value="catch">'+
            '</form>');
  }else {
          //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
          popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML('<p>Come here and catch me !!!</p>');
           // create DOM element for the marker 
           el = document.createElement('div');
           el.id = 'nopkm';
          //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
        }
       // create the marker
       new mapboxgl.Marker(el)
       .setLngLat(monument)
       .setPopup(popup) // sets a popup on this marker
     .addTo(map);
////////////////////// darkrai //////////////////////////////////////////////
   //position
   monument = [Lng+0.005, Lat+0.008];
   var darklong = Lng+0.005;
   var darklat = Lat+0.008;
   // create the popup
   // set các vị trí bắt
   pklp = darklong+0.0015;
   pklm = darklong-0.0015;
   pkap = darklat+0.0015;
   pkam = darklat-0.0015;
    //check position
   var check = calculate(lngLat.lng, darklong, pklp, pklm, lngLat.lat, darklat, pkap, pkam);
   if(check)
   {
            // create DOM element for the marker
            el = document.createElement('div');
            el.id = 'dark';
           //create popup
           popup = new mapboxgl.Popup({ offset: 25 })
           .setHTML('<p>Name : Darkrai</p>'+
               '<p>Type: Dark</p>'+
               '<p>Weight : 111.3 lbs. 50.5 kg</p>'+
               '<p>Height : 1.5 m</p>'+
             '<form action="poke4" method="POST">'+
               '<input type="submit" value="catch">'+
             '</form>');
   }else {
           //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
           popup = new mapboxgl.Popup({ offset: 25 })
           .setHTML('<p>Come here and catch me !!!</p>');
            // create DOM element for the marker 
            el = document.createElement('div');
            el.id = 'nopkm';
           //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
         }
        // create the marker
        new mapboxgl.Marker(el)
        .setLngLat(monument)
        .setPopup(popup) // sets a popup on this marker
      .addTo(map);
////////////////////// squirtle //////////////////////////////////////////////
       //position
   monument = [Lng-0.003, Lat-0.004];
   var squilong = Lng-0.003;
   var squilat = Lat-0.004;
   // create the popup
   // set các vị trí bắt
   pklp = squilong+0.0015;
   pklm = squilong-0.0015;
   pkap = squilat+0.0015;
   pkam = squilat-0.0015;
    //check position
   var check = calculate(lngLat.lng, squilong, pklp, pklm, lngLat.lat, squilat, pkap, pkam);
   if(check)
   {
            // create DOM element for the marker
            el = document.createElement('div');
            el.id = 'squi';
           //create popup
           popup = new mapboxgl.Popup({ offset: 25 })
           .setHTML('<p>Name : Squirtle</p>'+
               '<p>Type: Water</p>'+
               '<p>Gender: 87.5% ♂ / 12.5 % ♀</p>'+
               '<p>Weight : 19.8 lbs. 9.0 kg</p>'+
               '<p>Height : 0.5 m</p>'+
             '<form action="poke9" method="POST">'+
               '<input type="submit" value="catch">'+
             '</form>');
   }else {
            //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
            popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML('<p>Come here and catch me !!!</p>');
             // create DOM element for the marker 
             el = document.createElement('div');
             el.id = 'nopkm';
            //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
         }
        // create the marker
        new mapboxgl.Marker(el)
        .setLngLat(monument)
        .setPopup(popup) // sets a popup on this marker
      .addTo(map);
////////////////////// Charmander //////////////////////////////////////////////
       //position
       monument = [Lng+0.009, Lat-0.009];
       var charlong = Lng+0.009;
       var charlat = Lat-0.009;
       // create the popup
       // set các vị trí bắt
       pklp = charlong+0.0015;
       pklm = charlong-0.0015;
       pkap = charlat+0.0015;
       pkam = charlat-0.0015;
        //check position
       var check = calculate(lngLat.lng, charlong, pklp, pklm, lngLat.lat, charlat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'char';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Charmander</p>'+
                   '<p>Type: Fire</p>'+
                   '<p>Gender: 87.5% ♂ / 12.5 % ♀</p>'+
                   '<p>Weight : 18.7 lbs. 8.5 kg</p>'+
                   '<p>Height : 0.61 m</p>'+
                 '<form action="poke10" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
               //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
             }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// sudowoodo //////////////////////////////////////////////
      //position
       monument = [Lng-0.009, Lat-0.009];
       var sudolong = Lng+0.009;
       var sudolat = Lat-0.009;
       // create the popup
       // set các vị trí bắt
       pklp = sudolong+0.0015;
       pklm = sudolong-0.0015;
       pkap = sudolat+0.0015;
       pkam = sudolat-0.0015;
        //check position
       var check = calculate(lngLat.lng, sudolong, pklp, pklm, lngLat.lat, sudolat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'sudo';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Sudowoodo </p>'+
                   '<p>Type: Rock</p>'+
                   '<p>Gender: 50% ♂ / 50% ♀</p>'+
                   '<p>Weight : 83.8 lbs. 38.0 kg</p>'+
                   '<p>Height : 1.2 m</p>'+
                 '<form action="poke3" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
                //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
             }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// scyther //////////////////////////////////////////////
         //position
       monument = [Lng-0.001, Lat+0.002];
       var scylong = Lng-0.001;
       var scylat = Lat+0.002;
       // create the popup
       // set các vị trí bắt
       pklp = scylong+0.0015;
       pklm = scylong-0.0015;
       pkap = scylat+0.0015;
       pkam = scylat-0.0015;
        //check position
       var check = calculate(lngLat.lng, scylong, pklp, pklm, lngLat.lat, scylat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'scy';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Scyther </p>'+
                   '<p>Type: Bug/ Flying</p>'+
                   '<p>Gender: 50% ♂ / 50% ♀</p>'+
                   '<p>Weight : 123.5 lbs. 56.0 kg</p>'+
                   '<p>Height : 1.5 m</p>'+
                 '<form action="poke2" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
              //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
             }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// Diglett //////////////////////////////////////////////
       //position
       monument = [Lng+0.007, Lat-0.007];
       var diglong = Lng+0.007;
       var diglat = Lat-0.007;
       // create the popup
       // set các vị trí bắt
       pklp = diglong+0.0015;
       pklm = diglong-0.0015;
       pkap = diglat+0.0015;
       pkam = diglat-0.0015;
        //check position
       var check = calculate(lngLat.lng, diglong, pklp, pklm, lngLat.lat, diglat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'digl';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Diglett </p>'+
                   '<p>Type: Ground</p>'+
                   '<p>Gender: 50% ♂ / 50% ♀</p>'+
                   '<p>Weight : 1.8 lbs. 0.8 kg</p>'+
                   '<p>Height : 0.2 m</p>'+
                 '<form action="poke6" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
                //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
             }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// bulbasaur //////////////////////////////////////////////
       //position
       monument = [Lng+0.004, Lat-0.002];
       var bullong = Lng+0.004;
       var bullat = Lat-0.002;
       // create the popup
       // set các vị trí bắt
       pklp = bullong+0.0015;
       pklm = bullong-0.0015;
       pkap = bullat+0.0015;
       pkam = bullat-0.0015;
        //check position
       var check = calculate(lngLat.lng, bullong, pklp, pklm, lngLat.lat, bullat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'bulba';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Bulbasaur </p>'+
                   '<p>Type: Grass/Poison</p>'+
                   '<p>Gender: 87.5% ♂ / 12.5% ♀</p>'+
                   '<p>Weight : 15.2 lbs. 0.7 kg</p>'+
                   '<p>Height : 0.7 m</p>'+
                 '<form action="poke8" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
                //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
            }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// beedrill //////////////////////////////////////////////
         //position
       monument = [Lng-0.003, Lat+0.009];
       var beelong = Lng-0.003;
       var beelat = Lat+0.009;
       // create the popup
       // set các vị trí bắt
       pklp = beelong+0.0015;
       pklm = beelong-0.0015;
       pkap = beelat+0.0015;
       pkam = beelat-0.0015;
        //check position
       var check = calculate(lngLat.lng, beelong, pklp, pklm, lngLat.lat, beelat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'beedril';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Beedrill </p>'+
                   '<p>Type: Bug/Poison</p>'+
                   '<p>Gender: 50% ♂ / 50% ♀</p>'+
                   '<p>Weight : 65 lbs. 29.5 kg</p>'+
                   '<p>Height : 1.03 m</p>'+
                 '<form action="poke5" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
                 //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
             }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// Gyarados //////////////////////////////////////////////
         //position
       monument = [Lng-0.005, Lat+0.005];
       var gyalong = Lng-0.005;
       var gyalat = Lat+0.005;
       // create the popup
       // set các vị trí bắt
       pklp = gyalong+0.0015;
       pklm = gyalong-0.0015;
       pkap = gyalat+0.0015;
       pkam = gyalat-0.0015;
        //check position
       var check = calculate(lngLat.lng, gyalong, pklp, pklm, lngLat.lat, gyalat, pkap, pkam);
       if(check)
       {
                // create DOM element for the marker
                el = document.createElement('div');
                el.id = 'gyara';
               //create popup
               popup = new mapboxgl.Popup({ offset: 25 })
               .setHTML('<p>Name : Gyarados </p>'+
                   '<p>Type: Water/ Flying</p>'+
                   '<p>Gender: 50% ♂ / 50% ♀</p>'+
                   '<p>Weight : 518.1 lbs. 235.0 kg</p>'+
                   '<p>Height : 6.5 m</p>'+
                 '<form action="poke11" method="POST">'+
                   '<input type="submit" value="catch">'+
                 '</form>');
       }else {
                 //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
             }
            // create the marker
            new mapboxgl.Marker(el)
            .setLngLat(monument)
            .setPopup(popup) // sets a popup on this marker
          .addTo(map);
////////////////////// snorlax //////////////////////////////////////////////
      //position
      monument = [Lng+0.003, Lat-0.001];
      var snorlong = Lng+0.003;
      var snorlat = Lat-0.001;
      // create the popup
      // set các vị trí bắt
      pklp = snorlong+0.0015;
      pklm = snorlong-0.0015;
      pkap = snorlat+0.0015;
      pkam = snorlat-0.0015;
       //check position
      var check = calculate(lngLat.lng, snorlong, pklp, pklm, lngLat.lat, snorlat, pkap, pkam);
      if(check)
      {
               // create DOM element for the marker
               el = document.createElement('div');
               el.id = 'snor';
              //create popup
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Name : Snorlax</p>'+
                  '<p>Type: Normal</p>'+
                  '<p>Gender: 87.5% ♂ / 12.5 % ♀</p>'+
                  '<p>Weight : 1014.1 lbs. 460.0 kg</p>'+
                  '<p>Height : 2.11 m</p>'+
                '<form action="poke7" method="POST">'+
                  '<input type="submit" value="catch">'+
                '</form>');
      }else {
               //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
                // create DOM element for the marker 
                //phải chèn ảnh trắng, hoặc là không thể chạy code được
                el = document.createElement('div');
                el.id = 'nopkm';  //xem trong css
               //create popup
                 popup = new mapboxgl.Popup({ offset: 25 })
                 .setHTML('<p>Come here and catch me</p>');
            }
           // create the marker
           new mapboxgl.Marker(el)
           .setLngLat(monument)
           .setPopup(popup) // sets a popup on this marker
         .addTo(map);
             

////////////////////////////////pikachu//////////////////////////////////////////
      //position  
      monument = [Lng-0.002, Lat+0.001];
      var pikalong = Lng-0.002;
      var pikalat = Lat+0.001;
      // create the popup
      // set các vị trí bắt
          pklp = pikalong+0.0015;
          pklm = pikalong-0.0015;
          pkap = pikalat+0.0015;
          pkam = pikalat-0.0015;
            var check = calculate(lngLat.lng, pikalong, pklp, pklm, lngLat.lat, pikalat, pkap, pkam);
            if(check)
            {
              // create DOM element for the marker
              el = document.createElement('div');
              el.id = 'pika';
                popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML('<p>Name : Pikachu</p>'+
                    '<p>Type: Electric</p>'+
                    '<p>Gender: 50% ♂ / 50 % ♀</p>'+
                    '<p>Weight : 13.2 lbs. 6.0 kg</p>'+
                    '<p>Height : 0.4 m</p>'+
                    '<form action="poke12" method="POST">'+
                    '<input type="submit" value="catch">'+
                    '</form>');
            }else {
              //ở else, thì hàm popup phải giữ, ko đc bỏ, bỏ đi là lỗi, ko chạy đc
              popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p>Come here and catch me !!!</p>');
               // create DOM element for the marker 
               el = document.createElement('div');
               el.id = 'nopkm';
              //nopkm là sử dụng khi lần đầu chưa tìm đc pkm, khi đã tìm đc, nopkm không còn cần thiết nữa. 
            }
     // create the marker
     new mapboxgl.Marker(el)
     .setLngLat(monument)
     .setPopup(popup) // sets a popup on this marker
     .addTo(map);

      
      /////////////////////////////////////////////////////////
}
players.on('dragend', onDragEnd);
///////////////////////////////////////////////////////

    //hàm tính toán vị trí xa gần
    function calculate(playerlong, pokelong, pokelongP, pokelongM, playerlat, pokelat, pokelatP, pokelatM){
      var check=false;
     
      if((playerlong <= pokelongP && playerlong >= pokelong) && (playerlat <= pokelatP && playerlat >= pokelat)) 
      {
        //chiều kinh độ tăng, vĩ độ tăng
        check = true;
        return check;
      }
      check=false;
      if((playerlong <= pokelongP && playerlong >= pokelong) && (playerlat >= pokelatM && playerlat <= pokelat)) 
      {
        //chiều kinh độ tăng, vĩ độ giảm
        check = true;
        return check;
      }
      check=false;
      if((playerlong >=pokelongM && playerlong <= pokelong)&& (playerlat <= pokelatP && playerlat >= pokelat))
      {
        //chiều kinh độ giảm, vĩ độ tăng
        check = true;
        return check;
      }
      check=false;
      if((playerlong >=pokelongM && playerlong <= pokelong) && (playerlat >= pokelatM && playerlat <= pokelat))
      {
        //chiều kinh độ giảm, vĩ độ giảm
        check = true;
        return check;
      }
      check=false;
      
    }
};



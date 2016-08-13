// Threnody To The Silent 
// *** by Sumanth Srnivasan ***


//Global Variables

// Map defaults
var citymap = {
  	newyork: {
    center: {lat: 40.714, lng: -74.005},
    population: 8405837
  }
};


var rectangle;

//Audio Objects
var sMusic;
var sTalking;
var sTraffic;
var sConstruction;
      

function initMap() {

  // Initialize audio
  initAudio();

  // Create the map.
	map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 40.714, lng: -74.005},
      mapTypeId: 'terrain'
  });

  rectangle = new google.maps.Rectangle({
    strokeColor: '#CC9999',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FFAAAA',
    fillOpacity: 0.35,
    map: map,
    bounds: {
      north: 40.728920,
      south: 40.729720,
      east: -73.996158,
      west: -73.997158
    },
    visible: true,
    draggable: true,
    editable: true
  });  

  rectangle.addListener('bounds_changed', showNewRect);

  }

      
function showNewRect(event) {
  var ne = rectangle.getBounds().getNorthEast();
  var sw = rectangle.getBounds().getSouthWest();

  // console.log('NE LAT' + ne.lat() + 'NE LONG' + ne.lng());
  // console.log('SW LAT' + sw.lat() + 'SW LONG' + sw.lng());

  var url = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$where=latitude > ' + sw.lat() + ' AND latitude < ' + ne.lat() + ' AND longitude > ' + sw.lng() + ' AND longitude < ' + ne.lng() + '&$$app_token=09sIcqEhoY0teGY5rhupZGqhW';
  // console.log(url);
  AJAXcall(url);

  

}



function AJAXcall(url) {

  // var responseStatus = 'default';
  var loudTalking = 0;
  var loudMusic = 0;
  var construction = 0;
  var traffic = 0;

  var musicGain = -12;
  var talkingGain = -12;
  var trafficGain = -12;
  var constructionGain = -12;

  //API call to NYC Open Data

  $.get(url, function(data, status){
    
      $.each(data, function(i, entry) {

        if (entry.descriptor === 'Loud Talking') {
          loudTalking += 1;

        } else if (entry.descriptor === 'Loud Music/Party') {
          loudMusic += 1;

        } else if (entry.descriptor === 'Engine Idling') {
          traffic += 1;

        } else if (entry.descriptor === 'Noise: Construction Before/After Hours (NM1)') {
          construction +=1 ;

        }
        else {
          // console.log('sup');
        }

      });
      
      console.log(status);


      var total = construction + loudMusic + loudTalking + traffic;
      console.log('Total ' + total);

      // console.log('Loud Talking' + 20*Math.log(loudTalking/total));
      // console.log('Music' + 20*Math.log10(loudMusic/total));
      // console.log('Traffic' + 20*Math.log10(traffic/total));

      talkingGain = 20*Math.log(loudTalking/total);
      musicGain = 20*Math.log10(loudMusic/total);
      trafficGain = 20*Math.log10(traffic/total);
      // constructionGain = 
      
  });  
}

   // AUDIO 

   //TO-DO: Add arguments and object for construction noise

function initAudio() {

   sMusic = new Tone.Sampler("./assets/music.mp3", function() {

    sMusic.triggerAttack(-1);
    sMusic.volume.value = -15;
    sMusic.loop.value = true;
   }).toMaster();

   
   sTraffic = new Tone.Sampler("./assets/traffic.wav", function() {

    sTraffic.triggerAttack(-1);
    sTraffic.volume.value = -15;
    sTraffic.loop.value = true;
   }).toMaster();

   
   sTalking = new Tone.Sampler("./assets/talking.aiff", function() {

    sTalking.triggerAttack(-1);
    sTalking.volume.value = -15;
    sTalking.loop.value = true;
   }).toMaster(); 
}

function changeGain(musicGain, trafficGain, talkingGain) {
//Edit to add construction gain

  sMusic.volume.value = musicGain;
  sTraffic.volume.value = trafficGain;
  sTalking.volume.value = taling.Gain;


}



Tone.Transport.start(); //Play audio

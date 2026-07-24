"user strict";

const victoriaCoordinates = [48.428813, -123.363040];

let map = L.map('map').setView(victoriaCoordinates, 13); // or var to consistant w leaflet instructions
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// let marker = L.marker([48.4, -123.4]).addTo(map); //Map marker - default
//for custom need a png for image, and a png for shadow
var hotelIcon = L.icon({
    iconUrl: '../img/hotelIcon-32.png', //doesnt appear to handle svg
    shadowUrl: '../img/hotelIconShadow-32x11.png',

    iconSize:     [32, 32], // size of the icon
    shadowSize:   [32, 11], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, -30],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
let marker = L.marker([48.43, -123.36], {icon: hotelIcon}).addTo(map); //Map marker - default


// marker.bindPopup("<b>Hello world!</b><br>I am a popup."); //simple marker note (add openPopup() to open on load)

let popup = L.popup();
function onMapClick(e) {
    console.log(e);
        let lat = Number( e.latlng.lat.toFixed(3) );
        let lng = Number( e.latlng.lng.toFixed(3) );
        let coords = [ lat, lng ];
        console.log( coords );
    map.panTo( coords ); //not centering properly; but variable is correct type...

    popup //this structure is good for when need to attach more than a simple note, eg. weather info
        // .setLatLng(e.latlng) //not jumping :( )
        .setLatLng( coords ) //not jumping :( )        
        .setContent("You clicked the map at " + coords )
        .openOn(map);
        ;
}

map.on('click', onMapClick);
const victoriaCoordinates = [48.428813, -123.363040];

let map = L.map('map').setView(victoriaCoordinates, 13); // or var to consistant w leaflet instructions
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// let marker = L.marker([48.4, -123.4]).addTo(map); //Map marker - default
//for custom need a png for image, and a png for shadow
var hotelIcon = L.icon({
    iconUrl: '..\img\icon-park-solid--hotel.svg', //doesnt appear to handle svg
    // shadowUrl: '..\img\icon-park-solid--hotel.svg',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
let marker = L.marker([48.4, -123.4], {icon: hotelIcon}).addTo(map); //Map marker - default


// marker.bindPopup("<b>Hello world!</b><br>I am a popup."); //simple marker note (add openPopup() to open on load)

let popup = L.popup();
function onMapClick(e) {
    popup //this structure is good for when need to attach more than a simple note, eg. weather info
        .setLatLng([51.513, -0.09]) //lol jumps to london
        .setContent("You clicked the map at " + e.latlng)
        .openOn(map);
}

map.on('click', onMapClick);
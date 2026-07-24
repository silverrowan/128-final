const victoriaCoordinates = [48.428813, -123.363040];

var map = L.map('map').setView(victoriaCoordinates, 13); // or var to consistant w leaflet instructions
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
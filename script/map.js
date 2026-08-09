"user strict";

const victoriaCoordinates = [48.428813, -123.363040];

let map = L.map('map').setView(victoriaCoordinates, 5); // or var to consistant w leaflet instructions
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
    iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
    shadowAnchor: [16, 0],  // the same for the shadow
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
});

//Add demo image marker & simple pop up
// let marker = L.marker([48.43, -123.36], {icon: hotelIcon}).addTo(map); //Map marker - default
// marker.bindPopup("<b>Hello world!</b><br>I am a popup."); //simple marker note (add openPopup() to open on load)

//more complex popup
let popup = L.popup();
function onMapClick(e) {
        let lat = Number( e.latlng.lat.toFixed(3) );
        let lng = Number( e.latlng.lng.toFixed(3) );
        let coords = [ lat, lng ];
    map.panTo( coords ); //not centering properly; but variable is correct type...

    popup //this structure is good for when need to attach more than a simple note, eg. weather info
        // .setLatLng(e.latlng) //not jumping :( )
        .setLatLng( coords ) //not jumping :( )        
        .setContent("You clicked the map at " + coords )
        .openOn(map);
        ;
}

map.on('click', onMapClick);

// Add Hotel Icons to the map (map created in map.js script)

const addHotelsToMap = ( hotelArray, roomArray ) => {
    
    let markerArray = [];
    for (let i = 0; i < hotelArray.length; i++) {
        markerArray[i] = addHotelIcon( hotelArray[i], roomArray );
    }
    return markerArray;
}

const addHotelIcon = async ( hotelObj, roomArray ) => {
    let marker = L.marker([hotelObj.lat, hotelObj.lng], {icon: hotelIcon}).addTo(map);
    marker.addEventListener("click", () => makeHotelCard( hotelObj, roomArray ));
    
    let weather = await getWeather(48.4284, -123.3656);
    console.log(weather);
    
    marker.bindPopup(`
        <div class="d-flex flex-column justify-content-center align-items-center">
            <img src='${weather.current.condition.icon}' class='weatherIcon icon popup' />
            <p class="popup my-0">The current weather here is ${weather.current.condition.text}.</p>
        </div>
        `);

    marker.on('popupopen', () => {
        $('.weatherIcon.popup')
            .animate({ top: '-5px' }, 500)
            .animate({ top: '0px' }, 500)
            .delay(300)
            .animate({ top: '-5px' }, 500)
            .animate({ top: '0px' }, 500)
        });

    return marker;
}

//find and place user
const placeUserMarker = () => {

    let userLocationMarker = null;
    let clickMarker = null;
    let accuracyMarker = null;

    const locationSuccess = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (userLocationMarker !== null) {
            map.removeLayer(userLocationMarker);
        }

        if (accuracyMarker !== null) {
            map.removeLayer(accuracyMarker);
        }

        userLocationMarker = L.marker([latitude, longitude]).addTo(map);
        userLocationMarker.bindPopup("Your current location!");

        accuracyMarker = L.circle([latitude, longitude], {
            radius: accuracy
        }).addTo(map);

    map.setView([latitude, longitude], 5);
    };

    const locationFailure = (error) => {
        console.log(error);

        if(error.code === error.PERMISSION_DENIED){
            console.log( "Permission denied" );
        } else if(error.code === error.POSITION_UNAVAILABLE){
            console.log( "Position not available" );
        } else if(error.code === error.TIMEOUT){
            console.log( "Time out error" );
        } else {
            console.log( "Unknown reason, couldn't get user location." );
        }
    };

    const options = {
        enableHighAccuracy: true,
        timeout: 10000
    };

    navigator.geolocation.getCurrentPosition(locationSuccess, locationFailure, options);
}


//weather


const getWeather = async (lat, lng) => {
    const apiKey = "e45f31ad3c17405e9ea44045260908";
    
    try{
        const url =
            `https://api.weatherapi.com/v1/current.json` +
            `?key=${apiKey}&q=${lat},${lng}`;

        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok){
                throw new Error("Unable to retrieve weather")
            }

        return data;

    } catch (error) { 
        if(error.code === error.PERMISSION_DENIED){
            console.log( "(weather) Permission denied" );
        } else if(error.code === error.POSITION_UNAVAILABLE){
            console.log( "(weather) Position not available" );
        } else if(error.code === error.TIMEOUT) {
            console.log( "(weather) Time out error" );
        } else {
            console.log( "Unknown reason, couldn't get location weather." );
        }
    }
}
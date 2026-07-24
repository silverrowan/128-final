"use strict";
// #region Setting up Classes
// Setting up Hotel Class
class Hotel {
    #id;
    #name;
    #city;
    #country;
    #lat;
    #lng;
    #rating;
    #description;
    #image;

    //constructors
    constructor( id, name, city, country, lat, lng, rating, description, image ) {
        this.#id=id;
        this.#name=name;
        this.#city=city;
        this.#country=country;
        this.#lat=lat;
        this.#lng=lng;
        this.#rating=rating;
        this.#description=description;
        this.#image=image
    }

    //setters & getters
    get id() { return this.#id; }
    set id(  n) { this.#id = n; }

    get name() { return this.#name; }
    set name( n ) { this.#name = n; }

    get city() { return this.#city; }
    set city( n ) { this.#city = n; }

    get country() { return this.#country; }
    set country(  n) { this.#country = n; }

    get lat() { return this.#lat; }
    set lat( n ) { this.#lat = n; }

    get lng() { return this.#lng; }
    set lng( n ) { this.#lng = n; }

    get rating() { return this.#rating; }
    set rating(  n) { this.#rating = n; }

    get description() { return this.#description; }
    set description( n ) { this.#description = n; }

    get image() { return this.#image; }
    set image( n ) { this.#image = n; }

    //additional obj functions
}

// Setting up Hotel Room Class
class Room {
    #id;
    #hotelId;
    #name;
    #type;
    #beds;
    #maxGuests;
    #pricePerNight;
    #rating;
    #available;
    #image;

    //constructors
    constructor( id, hotelId, name, type, beds, maxGuests, pricePerNight, rating, available, image ) {
        this.#id=id;
        this.#hotelId=hotelId;
        this.#name=name;
        this.#type=type;
        this.#beds=beds;
        this.#maxGuests=maxGuests;
        this.#pricePerNight=pricePerNight;
        this.#rating=rating;
        this.#available=available;
        this.#image=image
    }

    //setters & getters
    get id() { return this.#id; }
    set id(  n) { this.#id = n; }

    get hotelId() { return this.#hotelId; }
    set hotelId( n ) { this.#hotelId = n; }

    get name() { return this.#name; }
    set name( n ) { this.#name = n; }

    get type() { return this.#type; }
    set type( n ) { this.#type = n; }

    get beds() { return this.#beds; }
    set beds(  n) { this.#beds = n; }

    get maxGuests() { return this.#maxGuests; }
    set maxGuests( n ) { this.#maxGuests = n; }

    get pricePerNight() { return this.#pricePerNight; }
    set pricePerNight( n ) { this.#pricePerNight = n; }

    get rating() { return this.#rating; }
    set rating(  n) { this.#rating = n; }

    get available() { return this.#available; }
    set available( n ) { this.#available = n; }

    get image() { return this.#image; }
    set image( n ) { this.#image = n; }

    //additional obj functions    
}
// #endregion

// #region getting and parsing JSON functions: get_Info, make_Array, _ = Hotel or Room
const getHotelInfo = async () => {
    const hotelLocation = "/public/hotels.json";
    try {
        const response = await fetch( hotelLocation );
        if ( !response.ok ) throw new Error('cannot find file');

        const hotelData = await response.json();
        return hotelData;
    } catch (e) { console.error('Failed to load hotels') }
    finally { console.log( "this happens when hotels.js fetch happens - regardless of success or failure");
    }
}

const getRoomInfo = async () => {
    const roomLocation = "/public/rooms.json";
    try {
        const response = await fetch( roomLocation );
        if ( !response.ok ) throw new Error('cannot find file');

        const roomData = await response.json();
        return roomData;
    } catch (e) { console.error('Failed to load rooms') }
}

const makeHotelArray = ( hotelsRaw ) => {
    let hotelArray = [];
    for ( let i = 0; i < hotelsRaw.length; i++) {
        let h = hotelsRaw[i];

        hotelArray[i] = new Hotel( h.id, h.name, h.city, h.country, 
                h.lat, h.lng, h.rating, h.description, h.image );
    }
    return hotelArray;
}

const makeRoomArray = ( roomsRaw ) => {
    let roomArray = [];
    for ( let i = 0; i < roomsRaw.length; i++) {
        let r = roomsRaw[i];

        roomArray[i] = new Room( r.id, r.hotelId, r.name, r.type, r.beds, 
            r.maxGuests, r.pricePerNight, r.rating, r.available, r.image );
    }
    return roomArray;    
}
//#endregion


//#region Initial Page SetUp: Add Hotel Icons to the map (map created in map.js script)
$( async function() {
    const hotelsRaw = await getHotelInfo();
    const roomsRaw = await getRoomInfo();
    console.log( hotelsRaw );
    console.log( roomsRaw );

    let hotelsArray = makeHotelArray( hotelsRaw )
    console.log( hotelsArray );
    let roomsArray = makeRoomArray( roomsRaw )
    console.log( roomsArray );

    addHotelsToMap( hotelsArray );
});
//#endregion


const addHotelsToMap = ( hotelsArray ) => {
    let markerArray = [];
    for (let i = 0; i < hotelsArray.length; i++) {
        markerArray[i] = addHotelIcon( hotelsArray[i] );
    }
    return markerArray;
}

const addHotelIcon = ( hotelObj ) => {  
    let marker = L.marker([hotelObj.lat, hotelObj.lng], {icon: hotelIcon}).addTo(map);
    return marker;
}

    

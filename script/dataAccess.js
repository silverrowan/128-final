"use strict";
//using local storage to store room and cart data so that it can be
//altered and persisted across page reloads.
//This is a simple data access layer that abstracts the local storage API.

//not using local storage for hotels for now as that file does not need to be adjusted.

const savedRooms = localStorage.getItem('rooms');
const savedCart = localStorage.getItem('cart');

// #region fetch functions
const getHotelArray = async () => {
    hotelArray = await getHotelInfo();
    return hotelArray;
}

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

const getRoomArray = async () => {
    if ( savedRooms ) {
        roomArray = JSON.parse( savedRooms );
    } else {    
        roomArray = await getRoomInfo();
        localStorage.setItem('rooms', JSON.stringify( roomArray ));
    }
    return roomArray;
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

const saveRoomsChange = () => localStorage.setItem("rooms", JSON.stringify( roomArray ));

const getCartArray = async () => {
    if ( savedCart ) {
        cartArray = JSON.parse( savedCart );
    } else {
        cartArray = [];    
        localStorage.setItem('cart', JSON.stringify( cartArray ));
    }
    return cartArray;
}

const saveCartChange = () => localStorage.setItem("cart", JSON.stringify( cartArray ));

// const makeHotelArray = ( hotelsRaw ) => {
//     let hotelArray = [];
//     for ( let i = 0; i < hotelsRaw.length; i++) {
//         let h = hotelsRaw[i];

//         hotelArray[i] = new Hotel( h.id, h.name, h.city, h.country, 
//                 h.lat, h.lng, h.rating, h.description, h.image );
//     }
//     return hotelArray;
// }

// const makeRoomArray = ( roomsRaw ) => {
//     let roomArray = [];
//     for ( let i = 0; i < roomsRaw.length; i++) {
//         let r = roomsRaw[i];

//         roomArray[i] = new Room( r.id, r.hotelId, r.name, r.type, r.beds, 
//             r.maxGuests, r.pricePerNight, r.rating, r.available, r.image );
//     }
//     return roomArray;    
// }
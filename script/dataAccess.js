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
        const stringArray = await JSON.parse( savedCart );
        console.log( stringArray );
        
        Booking.toObjInstance( stringArray );
    } else {
        cartArray = [];    
        localStorage.setItem('cart', JSON.stringify( cartArray ));
    }
    return cartArray;


    // const cartArray = data.map(obj => {
    // const booking = new Booking(
    //     obj.id,
    //     obj.roomID,
    //     obj.roomName,
    //     obj.hotelID,
    //     obj.hotelName,
    //     obj.costPerNight
    // );

    // booking.customerID = obj.customerID;
    // booking.startDate = obj.startDate;
    // booking.endDate = obj.endDate;
    // booking.stage = obj.stage;
    // booking.roomTotal = obj.roomTotal;
    // booking.adjustPriceBy = obj.adjustPriceBy;

    // return booking;
// });



}

const saveCartChange = () => localStorage.setItem("cart", JSON.stringify( cartArray ));
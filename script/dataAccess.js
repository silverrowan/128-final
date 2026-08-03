"use strict";
//using local storage to store room and cart data so that it can be
//altered and persisted across page reloads.
//This is a simple data access layer that abstracts the local storage API.

//not using local storage for hotels for now as that file does not need to be adjusted.

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

const getRoomInfo = async () => {
    const roomLocation = "/public/rooms.json";
    try {
        const response = await fetch( roomLocation );
        if ( !response.ok ) throw new Error('cannot find file');

        const roomData = await response.json();
        return roomData;
    } catch (e) { console.error('Failed to load rooms') }
}

const setRoomsSave = ( roomArray ) => localStorage.setItem("rooms", JSON.stringify( roomArray ));
const getRoomsSave = async () => {
    const savedRooms = localStorage.getItem('rooms');
    let roomArray = [];


    
    if ( savedRooms == undefined ) {
        roomArray = JSON.parse( savedRooms );
    } else {    
        roomArray = await getRoomInfo();
        localStorage.setItem('rooms', JSON.stringify( roomArray ));
    }
    return roomArray;
}

const setCartSave = ( cartArray ) => localStorage.setItem("cart", JSON.stringify( cartArray ));
const getCartSave = async () => {
    const savedCart = localStorage.getItem('cart');
    let cartArray = [];

    if ( savedCart ) {
        let parsedArray = JSON.parse( savedCart );
        cartArray = parsedArray.map( a => {
            let book = new Booking(
            a._id, a._roomID, a._roomName, a._hotelID, a._hotelName, a._costPerNight 
        );

        book.startDate = a._startDate;
        book.endDate = a._endDate;
        book.numNights = a._numNights;
        book.stage = a._stage;
        book.roomTotal = a._roomTotal;
        book.adjustPriceBy = a._adjustPriceBy;

        return book;
        });

        console.log( cartArray );
        
        // Booking.toObjInstance( cartArray );
    } else { 
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
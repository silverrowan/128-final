"use strict";
//using local storage to store room and cart data so that it can be
//altered and persisted across page reloads.
//This is a simple data access layer that abstracts the local storage API.

//not using local storage for hotels for now as that file does not need to be adjusted.

// #region fetch functions
const getHotelArray = async () => {
    try { 
        hotelArray = await getHotelInfo();
        return hotelArray;
    } catch (e) { console.error('Failed to load hotels'); }
}

const getHotelInfo = async () => {
    const hotelLocation = "/public/hotels.json";
    try {
        const response = await fetch( hotelLocation );
        if ( !response.ok ) throw new Error('cannot find file');

        const hotelData = await response.json();
        return hotelData;
    } catch (e) { console.error('Failed to load hotels'); }
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
    } catch (e) { console.error('Failed to load rooms'); }
}

const setRoomsSave = ( roomArray ) => {
    try {
        localStorage.setItem("rooms", JSON.stringify( roomArray ));
    } catch (e) { console.error('Failed to save rooms')  }
}

const getRoomsSave = async () => {
    try {
        const savedRooms = localStorage.getItem('rooms');
        let roomArray = [];
    
        //checking for undefined & null state, and the *string* 'undefined'
        if ( savedRooms != undefined && savedRooms !== 'undefined' ) {
            roomArray = JSON.parse( savedRooms );
        } else {    
            roomArray = await getRoomInfo();
            try {
                localStorage.setItem('rooms', JSON.stringify( roomArray ));
            } catch (e) { console.error('Failed to save rooms to localStorage'); }
        }
        return roomArray;        
    } catch (e) { console.error('Failed to load rooms from localStorage'); }


}

const setCartSave = ( cartArray ) => {
    try {
        localStorage.setItem("cart", JSON.stringify( cartArray ));
    } catch (e) { console.error('Failed to save cart'); }
}

const getCartSave = async () => {
    try {
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
            
            // Booking.toObjInstance( cartArray );
        } else {
            try{
                localStorage.setItem('cart', JSON.stringify( cartArray ));
            } catch (e) { console.error('Failed to save cart to localStorage'); }
        }
        return cartArray;
    } catch (e) { console.error('Failed to load cart from localStorage'); }
}

const setOrderSave = ( order ) => {
    try {
        localStorage.setItem("order", JSON.stringify( order ));
    } catch (e) { console.error('Failed to save order');}
}

const getOrderSave = ( ) => {
    try {
        const savedOrder = localStorage.getItem('order');

        let order = {};

        //if it exists, but paid is not true (false, unset, etc)
        if ( savedOrder != undefined && savedOrder.paid !== true ){
            order = JSON.parse( savedOrder );
        } else {
            try{
                localStorage.setItem('order', JSON.stringify( order ));
            } catch (e) { console.error('Failed to save order to localStorage'); }
        }
        return order;
    } catch (e) { console.error('Failed to load order from localStorage'); }

}

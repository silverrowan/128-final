const openCheckout = async () => {
    cartBS.hide();

    let coutModalDiv = $("#coutModal")[0]
    
    const coutModal = bootstrap.Modal.getOrCreateInstance( coutModalDiv );
    coutModal.show();
}

const validateCheckoutForm = () => {};

const confirmOrder = () => {};

const validateName = (fieldID, fieldRegEx, tipLabelID) => {
    // if name like /[\w\s\.'-]+/
    is ok { 
        // remove class error from input field
        // add class hidden to formTip
    } else {
        // add class error to input field
        // remove class hidden from formTip
    }
}


// const openBookModal = async ( room, hotel ) => {
//     let cart = await getCartSave();
//     let bookModelElmt = $( '#bookingModal' )[0]; //get the element from jQuery selector to pass to bootstrap modal instance
    
//     //create booking obj and assign variables
//     let book = new Booking( cart.length, room.id, room.name, room.hotelId, hotel.name, room.pricePerNight );
//     await setRoomAvailabilityAndSave( room.id, false );
//     await makeRoomCards( hotel ); // rebuild room availability (visible in background)

//     //create the modal HTML; includes attaching it to the modal DOM element 
//     buildBookingModal( book, cart, hotel );  
//     // make & show Bootstrap Modal window
//     const bookingModal = bootstrap.Modal.getOrCreateInstance( bookModelElmt );
//     bookingModal.show();
// }

// const checkRoomAvailability = ( roomID ) => {
//     let roomArray = getRoomsSave();

//     for (let room of roomArray) {
//         if (room.id === roomID) {
//             return room.available
//         } else {
//             throw new Error( 'cannot find room' )
//         }
//     }
// }

// const setRoomAvailabilityAndSave = async ( roomID, isAvailable ) => {
//     let roomArray = await getRoomsSave();
//     console.log( "in set room avail and save: get: ");
//     console.log( roomArray);
    
//     let isFound = false;

//     for (let i = 0; i < roomArray.length; i++) {
//         if ( roomArray[i].id === roomID ) {
//             roomArray[i].available = isAvailable;
//             isFound = true;
//             break
//         }
//     } 

//     if (isFound === true ) {
//         console.log(  "in set room avail and save: found room: " );
//         console.log( roomArray );
//         setRoomsSave( roomArray );
//     } else {
//     throw new Error ('cannot find room')
//     }
// }

// const buildBookingModal = ( book, cart, hotel ) => {
//     updateModalTitleHTML( book );
//     updateModalTotalHTML( book, cart );
//     updateModalListeners( book, hotel );
// }

// const updateModalTitleHTML = ( book ) => {
//     let modalTitleHTML = `
//                         <h4 class="modal-title">${book.roomName}</h4>
//                         <h5 class="h6 fst-italic">${book.hotelName}</h5>
//                         `
//     $("#BookingModalTitle").html( modalTitleHTML )
// }

// const updateModalTotalHTML = ( book, cart ) => {  
//     let bookNum = cart.length;
//     book.startDate = new Date( $('#checkInDate').val() );
//     book.endDate = new Date( $('#checkOutDate').val() );

//     book.numNights = book.calcNights();    
//     if ( book.numNights == null ){ return; }

//     let modalRoomTotalDivHTML = `
//         <p id="${bookNum}Math" class="">${book.numNights} x $${book.costPerNight}/night</p>
//         <h5 id="${bookNum}roomTotal" class="h5" >$${book.calcRoomTotal()}</h5>
//         `;
//     $("#modalroomTotalDiv").html( modalRoomTotalDivHTML );
// }

// const updateModalListeners = ( book, hotel ) => {
//     //attach listener to updates as dates updated
//     $('#checkInDate').on('change', async () => {
//         let cart = await getCartSave();
//         updateModalTotalHTML( book, cart ) 
//     });
//     $('#checkOutDate').on('change', async () => {
//         let cart = await getCartSave();
//         updateModalTotalHTML( book, cart ) 
//     });
    
//     //listen for modal buttons
//     $("#closeBtn").click( () => {
//         setRoomAvailabilityAndSave( book.roomID, true);
//         makeRoomCards( hotel );
//         $("#bookingModal").modal('hide');
//     });
//     $("#cancelBtn").click( () => {
//         setRoomAvailabilityAndSave( book.roomID, true);
//         makeRoomCards( hotel );
//         $("#bookingModal").modal('hide');
//     });
//     $("#bookBtn").click( async () => {
//         let cart = await getCartSave();
//         $("#bookingModal").modal('hide')
//         addCartItem( book, cart ); //
//         openCart(); //dont use same cart b/c modified it in addCartItem() abv
//      } );
// }
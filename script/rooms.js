"use strict";

//#region Initial on load + addHotelsToMap() & addHotelIcon() + cartListener: 

// Add Hotel Icons to the map (map created in map.js script)
$( async function() {
    hotelArray = await getHotelArray();  
    roomArray = await getRoomArray();
    cartArray = await getCartArray();

    addHotelsToMap( hotelArray );
    buildCart()
});

const addCartBtnListener = () => {
    $("#navCartBtn").click( () => openCart() );
}

const initialCartBuild = () => {
    
}

addCartBtnListener();

//#endregion

//#region define cards makeHotelCard() and makeRoomCard/s() ratingToStart()
const makeHotelCard = ( hotel ) => {
    $("#roomCards").html( '' ); 
    let cardHTML = `       
            <div class="card m-3 d-flex">
                <div class="d-flex align-items-stretch">
                    <img class="card-img-top card-img-bottom card-img imgCoverFit " src="${hotel.image}" alt="a photo of ${hotel.name}">
                </div>	
                <div class="card-body d-flex flex-column">
                    <h3 class="card-title" id="hotelTitle" hotelId="${hotel.id}">${hotel.name}</h3>
                    <div class="flex-row">
                    `
    cardHTML += ratingToStars( hotel.rating );
    cardHTML += `
                    </div>
                    <hr class="w100">                    
                    <h4>${hotel.city}, ${hotel.country}</h4>
                    <p class="card-text" id="">${hotel.description}</p>                       
                    <button id="roomsBtn" class="btn btn-success align-self-end">Available Rooms</button>
                </div>
            </div>
        </div>    
    `
    $("#initialCard").html(cardHTML);
    $("#roomsBtn").click( () => makeRoomCards( hotel ) );
}

const makeRoomCards = ( hotel ) => {
    $("#roomCards").html( '' );    
    for ( let i = 0 ; i < roomArray.length ; i++ ){
        let room = roomArray[i];
        if ( hotel.id == room.hotelId ) {
            if ( room.available ){
                $("#roomCards").append( makeRoomCard( room, true ) );
                // $("#roomsBtn").click(  );
                $(`#bookRoom${room.id}`).click( () => {
                    // room.available = false;
                    //chg room to unavailable - in array and json
                    //make booking obj, dont add to array yet
                    openBookModal( room, hotel );
                });
            } else {
                $("#roomCards").append( makeRoomCard( room, false ) );
            }
                
        }
    }
};

const makeRoomCard = ( room ) => {
    let cardHTML = `       
        <div class="col col-sm-6 col-lg-4">            
            <div class="card m-3 d-flex ${availToActiveClass( room )}">
                <div class=" d-flex align-items-stretch">
                    <img class="card-img-top card-img-bottom card-img imgCoverFit ${ availToActiveClass( room ) }" src="${room.image}">
                </div>	
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${room.name}</h5>
                    <div>
                    `
                    cardHTML += ratingToStars( room.rating );
                    cardHTML += `
                    </div>
                    <hr class="w100">
                    <p class="card-text">${room.type} room type</p>
                    <p class="card-text">${room.beds} beds</p>  
                    <p class="card-text">up to ${room.maxGuests} guests</p>  
                    <p class="card-text align-self-end"><span class="h3">$${room.pricePerNight}</span><span class="h6">/ night</span></p>
                    
                    ${makeRoomBookBtn( room )}
                </div>
            </div>
        </div>
        `
    return cardHTML;
}

const availToActiveClass = ( room ) => {
    let activeClass;
    if ( room.available == false ) { activeClass = 'inactive'; }
    else { activeClass = 'active' }
    return activeClass;
}

const makeRoomBookBtn = ( room ) => {
    let btnClass;
    if ( room.available == false ) { btnClass = 'btn-secondary inactive" disabled>Unavailable'; }
    else { btnClass = 'btn-success">Book' }    
    let btnHTML = `
        <button id="bookRoom${room.id}" roomNum="${room.id}" 
                class="btn align-self-end ${btnClass}</button>
                `
    return btnHTML;    
}

const ratingToStars = (rating) => {
    // round to nearest half integer
    rating = Math.round(rating * 2); 
    rating = rating / 2 //convert back to original scale (5)

    let starsOut = "";
    let count = 0;
    //add whole stars until number of stars = int of rating
    for (let i = 1 ; i <= rating ; i++){
        starsOut += `<img class='icon star' src='/img/star.png' />`;
        count++;
    }
    //add a half star if the rating ends in .5
    let halfStar = rating-count > 0;
    if ( halfStar ) {
        starsOut += `<img class='icon star' src='/img/starHalf.png' />`;
    }
    //calculate the number of empty stars to bring to 5
    let emptyStars = 5 - rating;
    if ( halfStar ) { emptyStars -= 1 };
    
    //add empty stars until count matches
    for (let i = 1 ; i <= emptyStars ; i++){
        starsOut += `<img class='icon star' src='/img/starEmpty.png' />`;
    }

    return starsOut;
}
//#endregion

//#region making bookings: openBookModal(), buildBookingModal(), updateBookModalroomTotal(), addBookingToCart()

const openBookModal = ( room, hotel ) => {
    let bookModelElmt = $( '#bookingModal' )[0]; //get the element from jQuery selector to pass to bootstrap modal instance
    
    //create booking obj and assign variables
    let book = new Booking( cartArray.length, room.id, room.name, room.hotelId, hotel.name, room.pricePerNight );
    setRoomAvailabilityAndSave( room.id, false );
    //rebuild room availability (visible as background)
    makeRoomCards( hotel );
    //create the modal HTML; includes attaching it to the modal DOM element 
    buildBookingModal( book, hotel );  
    // make & show Bootstrap Modal window
    const bookingModal = bootstrap.Modal.getOrCreateInstance( bookModelElmt );
    bookingModal.show();
}

const checkRoomAvailability = ( roomID ) => {
    for (let room of roomArray) {
        if (room.id === roomID) {
            return room.available
        } else {
            throw new Error( 'cannot find room' )
        }
    }
}

const setRoomAvailabilityAndSave = ( roomID, isAvailable ) => {
    let isFound = false;
    for (let room of roomArray) {
        if ( room.id == roomID ){
            room.available = isAvailable;
            isFound = true;
            break;
        }
    }
    if (isFound === true ) {
        saveRoomsChange();
    } else {
    throw new Error ('cannot find room')
    }
}

const buildBookingModal = ( book, hotel ) => {
    updateModalTitleHTML( book );
    updateModalTotalHTML( book );
    attachModalListeners( book, hotel );
}

const updateModalTitleHTML = ( book ) => {
    let modalTitleHTML = `
                        <h4 class="modal-title">${book.roomName}</h4>
                        <h5 class="h6 fst-italic">${book.hotelName}</h5>
                        `
    $("#BookingModalTitle").html( modalTitleHTML )
}

const updateModalTotalHTML = ( book ) => {  
    let bookNum = cartArray.length;
    book.startDate = new Date( $('#checkInDate').val() );
    book.endDate = new Date( $('#checkOutDate').val() );

    book.numNights = book.calcNights();    
    if ( book.numNights == null ){ return; }

    let modalRoomTotalDivHTML = `
        <p id="${bookNum}Math" class="">${book.numNights} x $${book.costPerNight}/night</p>
        <h5 id="${bookNum}roomTotal" class="h5" >$${book.calcRoomTotal()}</h5>
        `;
    $("#modalroomTotalDiv").html( modalRoomTotalDivHTML );
}

const attachModalListeners = ( book, hotel ) => {
    //attach listener to updates as dates updated
    $('#checkInDate').on('change', () => updateModalTotalHTML( book ));
    $('#checkOutDate').on('change', () => updateModalTotalHTML( book ));
    
    //listen for modal buttons
    $("#closeBtn").click( () => {
        setRoomAvailabilityAndSave( book.roomID, true);
        makeRoomCards( hotel );
        $("#bookingModal").modal('hide');
    });
    $("#cancelBtn").click( () => {
        setRoomAvailabilityAndSave( book.roomID, true);
        makeRoomCards( hotel );
        $("#bookingModal").modal('hide');
    });
    $("#bookBtn").click( () => { 
        $("#bookingModal").modal('hide')
        addCartItem( book ); //
        openCart();
     } );
}

// #endregion

// #region cart offCanvase & functions | openCart(), addToCart(), makeCartEntry(), updateCartTotals()

const openCart = () => {
    console.log(`open cart`);
    
    if ( !cartBS ) {
        buildCart();
        cartBS = bootstrap.Offcanvas.getOrCreateInstance( offcanvasElmt );
    }   
    cartBS.show();

    //attach listeners
    $("#cartClearBtn").click( () => clearCart() );
    $("#cartCheckoutBtn").click( () => checkout() );
}

const addCartItem = ( book ) => { //new booking
    let posn = cartArray.length - 1;
    book.advanceStage(); //change booking stage to cart from null
    cartArray.push( book ); //add booking to cart array
        console.log( cartArray );
    saveCartChange();
    console.log( cartArray );
    makeCartEntry( book, posn )

    // $("#cartCardsDiv").append( makeCartEntry( book ) );
    // let arrayPosn = cartArray.length - 1;
    // $(`#removeCartItem${arrayPosn}Btn`).click( () => removeCartItem( arrayPosn ) );

    addToCartTotals( book );
};

const removeCartItem = ( arrayPosn ) => {
        cartArray[arrayPosn] = null; //remove from the array; faster, potentially clogs memory vs splice & rebuild cart.
        saveCartChange();
        $(`#removeCartItem${arrayPosn}Btn`).parent().parent().parent().remove(); // remove entire cart item card from the html
        removeFromCartTotals( cartArray[arrayPosn] );
}

const clearCart = () => {
    let isConfirmed = confirm("Are you sure you want to remove everything? You will lose your holds on all rooms in the cart.");
    if ( !isConfirmed ) { return; }
    cartArray = [];
    saveCartChange();
    cartBS.dispose();
    $("#cartCardsDiv").html( '' );
    resetCartTotalsTo0();
}

const makeCartEntry = ( book, posn ) => { //booking already exists
    if ( book == undefined ) { // also checks for null
        $("#cartCardsDiv").html( '' );
    } else {
        let cartItemHTML = `
        <div class="card m-3 d-flex">
        <div class="card-body d-flex flex-column justify-content-between align-items-stretch"> 
        <div class="d-flex justify-content-between mb-0"> 
        <button id="removeCartItem${posn}Btn" cartItem="${posn}" class="btn btn-outline-secondary 
        btn-sm align-items-start me-5 py-1 px-2">X</button> 
        <h5 class=" h4 mb-1">${book.roomName}</h5>
        </div>
        <h5 class="mb-0 align-self-end">${book.hotelName}</h5>
        <hr class="my-0">
        <div class="cartItemCount d-flex flex-column align-items-end justify-content-end my-0">
        <p class="${posn}dates my-0">${book.startDate.toDateString()} to ${book.endDate.toDateString()}</p>
        <p class="${posn}math my-0">${book.numNights} x $${book.costPerNight}<span class="subscr">/night</span></p>
        <h5 class="${posn}subtotal h5 my-1">$${book.roomTotal}</h5>
        </div>
        </div>
        </div> 
        `
        $("#cartCardsDiv").append( cartItemHTML );
        addToCartTotals( book );
        
        $(`#removeCartItem${posn}Btn`).click( () => removeCartItem( posn ) );
    }
}

const resetCartTotalsTo0 = () => {
    cartTotals.roomsTotal = 0;
    cartTotals.fees = 0;
    cartTotals.discounts = 0;
    
    updateCartTotals();
}

const addToCartTotals = ( book ) => { //booking already exists
    cartTotals.roomsTotal += book.roomTotal;
    
    let adjustments = book.adjustPriceBy;
    for ( let i = 0 ; i < adjustments.length ; i++ ) {
        if ( adjustments[i] > 0 ) { cartTotals.fees += adjustments[i]; }
        else if ( adjustments[i] < 0 ) { cartTotals.discounts += adjustments[i]; }
    }

    updateCartTotals();

}

const removeFromCartTotals = ( book ) => {
    cartTotals.roomsTotal -= book.roomTotal;

    let adjustments = book.adjustPriceBy;
    for ( let i = 0 ; i < adjustments.length ; i++ ) {
        if ( adjustments[i] > 0 ) { cartTotals.fees -= adjustments[i]; }
        else if ( adjustments[i] < 0 ) { cartTotals.discounts -= adjustments[i]; }
    }

    updateCartTotals();
}

const updateCartTotals = () => {
    let subtotal = cartTotals.roomsTotal + cartTotals.fees + cartTotals.discounts;
    let taxes = subtotal * 0.13;
    let total = subtotal + taxes;

    let cartTotalsHTML = `
                <div class="d-flex">
                    <div class="d-flex flex-column align-items-end">
                        <p class="my-0 me-3">Fees: </p>
                        <p class="my-0 me-3">Discounts: </p>
                        <p class="my-0 me-3">Subtotal: </p>
                        <p class="my-0 me-3">Taxes: </p>
                        <hr class="w100 my-2 btn-success-outline">
                        <p class="h5 mt-1 mb-3 me-3">Total: </p>
                        </div>
                        <div class="d-flex flex-column align-items-end">
                        <p class="my-0">$${cartTotals.fees.toFixed(2)}</p>
                        <p class="my-0">$${cartTotals.discounts.toFixed(2)}</p>
                        <p class="my-0">$${subtotal.toFixed(2)}</p>
                        <p class="my-0">$${taxes.toFixed(2)}</p>
                        <hr class="w100 my-2 btn-success-outline">
                        <p class="h5 mt-1 mb-3">$${total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `      
    $("#cartSumLines").html(cartTotalsHTML);
}

const buildCart = () => {
    if ( cartBS ){ cartBS.dispose(); }
    if ( cartArray.length <= 0 || cartArray == undefined ) {
        makeCartEntry( null, cartArray.length  );
        resetCartTotalsTo0();
    }
    for (let i = 0 ; i < cartArray.length ; i++ ){
            let book = cartArray[i];
        if ( book != 'paid' ) {
            makeCartEntry(  cartArray[i], i);
            addToCartTotals();
        }
    }
    cartBS = bootstrap.Offcanvas.getOrCreateInstance( offcanvasElmt );

}




// #endregion
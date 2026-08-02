"use strict";

//#region Initial on load + addHotelsToMap() & addHotelIcon() + cartListener: 

// Add Hotel Icons to the map (map created in map.js script)
$( async function() {
    hotelArray = await getHotelArray();  
    roomArray = await getRoomArray();
    cartArray = await getCartArray();

    addHotelsToMap( hotelArray, roomArray );   
});



const addCartBtnListener = () => {
    $("#navCartBtn").click( () => openCart() );
}

//#endregion

//#region define cards makeHotelCard() and makeRoomCard/s() ratingToStart()
const makeHotelCard = ( hotel, roomArray ) => {
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
    $("#roomsBtn").click( () => makeRoomCards( roomArray, hotel ) );
}

const makeRoomCards = ( roomArray, hotel ) => {
    $("#roomCards").html( '' );    
    for ( let i = 0 ; i < roomArray.length ; i++ ){
        let room = roomArray[i];
        if ( hotel.id == room.hotelId && room.available ){
            $("#roomCards").append( makeRoomCard( room ) );
            // $("#roomsBtn").click(  );
            $(`#bookRoom${room.id}`).click( () => {
                // room.available = false;
                //chg room to unavailable - in array and json
                //make booking obj, dont add to array yet
                openBookModal( room, hotel );
                
            });
        }
    }   
}

const makeRoomCard = ( room ) => {
    let cardHTML = `       
        <div class="col col-sm-6 col-lg-4">            
            <div class="card m-3 d-flex">
                <div class=" d-flex align-items-stretch">
                    <img class="card-img-top card-img-bottom card-img imgCoverFit " src="${room.image}">
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
                    
                    <button id="bookRoom${room.id}" roomNum="${room.id}" class="btn btn-success align-self-end">Book Room</button>
                </div>
            </div>
        </div>
        `
    return cardHTML;
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

//#region making bookings: openBookModal(), buildBookingModal(), updateBookModalroomTotal(), makeBooking(), addBookingToCart()

const openBookModal = ( room, hotel ) => {
    let bookModelElmt = $( '#bookingModal' )[0]; //get the element from jQuery selector to pass to bootstrap modal instance
    
    //create booking obj and assign variables
    let book = new Booking( cartArray.length, room.id, room.name, room.hotelId, hotel.name, room.pricePerNight );
   
    //create the modal HTML; includes attaching it to the modal DOM element 
    buildBookingModal( book );  
    // make & show Bootstrap Modal window
    const bookingModal = bootstrap.Modal.getOrCreateInstance( bookModelElmt );
    bookingModal.show();
}

const buildBookingModal = ( book ) => {
    updateModalTitleHTML( book );
    updateModalTotalHTML( book );
    attachModalListeners( book );
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

const attachModalListeners = ( book ) => {
    //attach listener to updates as dates updated
    $('#checkInDate').on('change', () => updateModalTotalHTML( book ));
    $('#checkOutDate').on('change', () => updateModalTotalHTML( book ));
    
    //listen for modal buttons
    $("#closeBtn").click( () => $("#bookingModal").modal('hide') );
    $("#cancelBtn").click( () => $("#bookingModal").modal('hide') );
    $("#bookBtn").click( () => { makeBooking( book ) } );
}

const makeBooking = ( book ) => {
    console.log( book );
    console.log(`make booking for room ${book.roomID}`);
    
    $("#bookingModal").modal('hide')
    addCartItem( book ); //
    openCart();
}
// #endregion

// #region cart offCanvase & functions | openCart(), addToCart(), makeCartItemHTML(), updateCartTotalsHTML()
// reference & create modal itselfoffcanvase
// const loginModal = document.querySelector('#loginModal');
// const loginModalBS = bootstrap.Modal.getOrCreateInstance( document.querySelector('#loginModal') );
//get login form input boxes & values
// const usernameIn = document.querySelector("#userNameIn");
// const userPassIn = document.querySelector("#userPasswordIn");
// const loginErrorMsg = document.querySelector("#incorrect");
//Get login form buttons & add listenters
// const enterLogin = document.querySelector("#loginModalButton");
// const cancelLogin = document.querySelector("#loginCancelButton");
// const cancelLoginX = document.querySelector("#modalX");

const openCart = () => {
    console.log(`open cart`);
    const offcanvasElmt = document.querySelector('#cartWrapperDiv');
    const offcanvasBS = bootstrap.Offcanvas.getOrCreateInstance( offcanvasElmt );
    offcanvasBS.show();

    //attach listeners
    $("#cartClearBtn").click( () => clearCart() );
    $("#cartCheckoutBtn").click( () => checkout() );
}

const addCartItem = ( book ) => {
    book.advanceStage(); //change booking stage to cart from null
    cartArray.push( book ); //add booking to cart array

    $("#cartCardsDiv").append( makeCartItemHTML( book ) );
    let arrayPosn = cartArray.length - 1;
    $(`#removeCartItem${arrayPosn}Btn`).click( () => removeCartItem( arrayPosn ) );

    addToCartTotals( book );
    updateCartTotalsHTML( book );
};

const removeCartItem = ( arrayPosn ) => {
        cartArray[arrayPosn] = null; //remove from the array; faster, potentially clogs memory vs splice & rebuild cart.
        $(`#removeCartItem${arrayPosn}Btn`).parent().parent().parent().remove(); // remove entire cart item card from the html
        removeFromCartTotals( cartArray[arrayPosn] );
        updateCartTotalsHTML( book );
}

const clearCart = () => {
    let isConfirmed = confirm("Are you sure you want to remove everything? You will lose your holds on all rooms in the cart.");
    if ( !isConfirmed ) { return; }
    cartArray = [];
    $("#cartCardsDiv").html( '' );
    cartTotals.roomsTotal = 0;
    cartTotals.fees = 0;
    cartTotals.discounts = 0;
    updateCartTotalsHTML();
}

const makeCartItemHTML = ( book ) => {
    let posn = cartArray.length - 1;

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
return cartItemHTML;
}

const addToCartTotals = ( book ) => {
    cartTotals.roomsTotal += book.roomTotal;

    let adjustments = book.adjustPriceBy;
    for ( let i = 0 ; i < adjustments.length ; i++ ) {
        if ( adjustments[i] > 0 ) { cartTotals.fees += adjustments[i]; }
        else if ( adjustments[i] < 0 ) { cartTotals.discounts += adjustments[i]; }
    }
}

const removeFromCartTotals = ( book ) => {
    cartTotals.roomsTotal -= book.roomTotal;

    let adjustments = book.adjustPriceBy;
    for ( let i = 0 ; i < adjustments.length ; i++ ) {
        if ( adjustments[i] > 0 ) { cartTotals.fees -= adjustments[i]; }
        else if ( adjustments[i] < 0 ) { cartTotals.discounts -= adjustments[i]; }
    }
}

const updateCartTotalsHTML = ( book ) => {
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




// #endregion
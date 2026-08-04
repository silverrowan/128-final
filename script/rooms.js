"use strict";

//#region Initial on load + addHotelsToMap() & addHotelIcon() + cartListener: 

// Add Hotel Icons to the map (map created in map.js script)
$( async function() {
    hotelArray = await getHotelArray();  
    let initialRoomArray = await getRoomsSave();
    let initialCartArray = await getCartSave();

    console.log("----initial array gets-----");
    console.log("hotel: " + hotelArray );
    console.log("room: " + initialRoomArray );
    console.log("cart: " + initialCartArray );
    console.log("---------------------------");
    

    addHotelsToMap( hotelArray );
    reBuildCart( initialCartArray )


    //attach listeners to permanent buttons - inclues invisible ones
    $("#navCartBtn").click( () => openCart() );
    //like those on the offcanvas cart, that do not get built in the JS
    $("#cartClearBtn").click( () => clearCart() );
    $("#cartCheckoutBtn").click( () => checkout() );
    // the modal listeners need information on current state, so are attached 
    // later with that information, using .off(...).on(...) to avoid build-up
    // of multiple listeners.

});

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

const makeRoomCards = async ( hotel ) => {
    $("#roomCards").html( '' );
    console.log( "cleared room cards...");
    
    
    let roomArray = await getRoomsSave();
    console.log( "making room cards");
    console.log( roomArray );
    
    for ( let i = 0 ; i < roomArray.length ; i++ ){
        let room = roomArray[i];
        if ( hotel.id == room.hotelId ) {
            if ( room.available ){
                $("#roomCards").append( makeRoomCard( room, true ) );
                $(`#bookRoom${room.id}`).click( () => {
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

const openBookModal = async ( room, hotel ) => {
    let cart = await getCartSave();
    let bookModelElmt = $( '#bookingModal' )[0]; //get the element from jQuery selector to pass to bootstrap modal instance
    
    //create booking obj and assign variables
    let book = new Booking( cart.length, room.id, room.name, room.hotelId, hotel.name, room.pricePerNight );
    await setRoomAvailabilityAndSave( room.id, false );
    await makeRoomCards( hotel ); // rebuild room availability (visible in background)

    //create the modal HTML; includes attaching it to the modal DOM element 
    buildBookingModal( book, cart, hotel );  
    // make & show Bootstrap Modal window
    const bookingModal = bootstrap.Modal.getOrCreateInstance( bookModelElmt );
    bookingModal.show();
}

const checkRoomAvailability = ( roomID ) => {
    let roomArray = getRoomsSave();

    for (let room of roomArray) {
        if (room.id === roomID) {
            return room.available
        } else {
            throw new Error( 'cannot find room' )
        }
    }
}

const setRoomAvailabilityAndSave = async ( roomID, isAvailable ) => {
    let roomArray = await getRoomsSave();
    console.log( "in set room avail and save: get: ");
    console.log( roomArray);
    
    let isFound = false;

    for (let i = 0; i < roomArray.length; i++) {
        if ( roomArray[i].id === roomID ) {
            roomArray[i].available = isAvailable;
            isFound = true;
            break
        }
    } 

    if (isFound === true ) {
        console.log(  "in set room avail and save: found room: " );
        console.log( roomArray );
        setRoomsSave( roomArray );
    } else {
    throw new Error ('cannot find room')
    }
}

const buildBookingModal = ( book, cart, hotel ) => {
    updateModalTitleHTML( book );
    updateModalTotalHTML( book, cart );
    attachModalListeners( book, hotel );
}

const updateModalTitleHTML = ( book ) => {
    let modalTitleHTML = `
                        <h4 class="modal-title">${book.roomName}</h4>
                        <h5 class="h6 fst-italic">${book.hotelName}</h5>
                        `
    $("#BookingModalTitle").html( modalTitleHTML )
}

const updateModalTotalHTML = ( book, cart ) => {  
    let bookNum = cart.length;
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
    $('#checkInDate').on('change', async () => {
        let cart = await getCartSave();
        updateModalTotalHTML( book, cart ) 
    });
    $('#checkOutDate').on('change', async () => {
        let cart = await getCartSave();
        updateModalTotalHTML( book, cart ) 
    });
    
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
    $("#bookBtn").click( async () => {
        let cart = await getCartSave();
        $("#bookingModal").modal('hide')
        addCartItem( book, cart ); //
        openCart(); //dont use same cart b/c modified it in addCartItem() abv
     } );
}

// #endregion

// #region cart offCanvase & functions | openCart(), addToCart(), makeCartItemHTML(), updateCartTotals()

const openCart = async () => {
    console.log(`open cart`);
    let cart = await getCartSave();

    reBuildCart( cart )
    cartBS.show();
}

const addCartItem = ( book, cart ) => { //new booking
    // let posn = cart.length;
    book.advanceStage(); //change booking stage to cart from null
    cart.push( book );
    setCartSave( cart );

    // makeCartItemHTML( book )
    // addToCartTotals( book );
};

const removeCartItem = async ( itemID ) => {
    let cart = await getCartSave();

    let removedIndex = cart.findIndex( item => item.id == itemID )
    let removed = cart.splice( removedIndex , 1 ); //save removed obj as removed (array)
    $(`#${itemID}removeCartItemBtn`).parent().parent().parent().remove(); // remove entire cart item card from the html
    removeFromCartTotals( removed[0] );
    setCartSave( cartArray );
}

const clearCart = () => {
    let isConfirmed = confirm("Are you sure you want to remove everything? You will lose your holds on all rooms in the cart.");
    if ( !isConfirmed ) { return; }
    cartArray = [];
    setCartSave( cartArray );
    cartBS.dispose();
    $("#cartCardsDiv").html( '' );
    resetCartTotalsTo0();
}

const clearCartItemHTML = () => $("#cartCardsDiv").html( '' );


const makeCartItemHTML = async ( book ) => { //booking already exists
    if ( book != undefined ) { // also checks for null

        let cartItemHTML = `
            <div class="card m-3 d-flex">
                <div class="card-body d-flex flex-column justify-content-between align-items-stretch"> 
                    <div class="d-flex justify-content-between mb-0"> 
                        <button id="${book.id}removeCartItemBtn" cartBookID="${book.id}" class="btn btn-outline-secondary 
                                btn-sm align-items-start me-5 py-1 px-2">X</button> 
                        <h5 class=" h4 mb-1">${book.roomName}</h5>
                    </div>
                    <h5 class="mb-0 align-self-end">${book.hotelName}</h5>
                    <hr class="my-0">
                     <div class="cartItemCount d-flex flex-column align-items-end justify-content-end my-0">
                        <p class="${book.id}dates my-0">${book.startDate.toDateString()} to ${book.endDate.toDateString()}</p>
                        <p class="${book.id}math my-0">${book.numNights} x $${book.costPerNight}<span class="subscr">/night</span></p>
                        <h5 class="${book.id}subtotal h5 my-1">$${book.roomTotal}</h5>
                    </div>
                </div>
            </div> 
        `
        $("#cartCardsDiv").append( cartItemHTML );
        addToCartTotals( book );
        
        $(`#${book.id}removeCartItemBtn`).click( () => removeCartItem( book.id ) );
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

const reBuildCart = ( cartArray ) => {
    if ( cartBS ){ cartBS.dispose(); }
    clearCartItemHTML();
    resetCartTotalsTo0();

    for (let i = 0 ; i < cartArray.length ; i++ ){
            let book = cartArray[i];
        if ( book != 'paid' ) {
            makeCartItemHTML( cartArray[i] );
        }
    }
    cartBS = bootstrap.Offcanvas.getOrCreateInstance( offcanvasElmt );

}




// #endregion
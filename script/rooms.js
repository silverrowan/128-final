"use strict";
const isBlank = value => value === null || value === undefined || value === '';
const isNotNaN = value => !( isNaN(value) || value == null || value == undefined || value == '') ; 

//Global Variables
let cartArray = [];
let cartTotals = {  roomsTotal: 0, fees: 0, discounts: 0};

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

    get ratcartArraying() { return this.#rating; }
    set ratcartArraying(  n) { this.#rating = n; }

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
    set rating(  n) { this.#rating = n; };

    get available() { return this.#available; }
    set available( n ) { this.#available = n; }

    get image() { return this.#image; }
    set image( n ) { this.#image = n; }

    //additional obj functions    
}

// Setting up Booking Class
class Booking {
    #id;
    #roomID;
    #roomName;
    #hotelID;
    #hotelName;
    #customerID;
    #costPerNight;
    #startDate;
    #endDate;
    #numNights;
    #stage;
    #timeAdded;
    #timePaid;
    #roomTotal;
    #adjustPriceBy;

    //constructors
    constructor( id, roomID, roomName, hotelID, hotelName, costPerNight ){
        this.#id = id;
        this.#roomID = roomID;
        this.#roomName = roomName;
        this.#hotelID = hotelID;
        this.#hotelName = hotelName;
        this.#costPerNight = costPerNight;
        this.#startDate = null;
        this.#endDate = null;
        this.#numNights = null;
        this.#stage = "initial";
        this.#timeAdded = new Date();
        this.#timePaid = null;
        this.#roomTotal= null; 
        this.#adjustPriceBy = [];
    }

    //setters and getters
    get id() { return this.#id; }
    set id( n ) { this.#id = n; }
    
    get roomID() { return this.#roomID; }
    set roomID( n ) { this.#roomID = n; }

    get roomName() { return this.#roomName; }
    set roomName( n ) { this.#roomName = n; }

    get hotelID() { return this.#hotelID; }
    set hotelID( n ) { this.#hotelID = n; }

    get hotelName() { return this.#hotelName; }
    set hotelName( n ) { this.#hotelName = n; }

    get customerID() { return this.#customerID; }
    set customerID( n ) { this.#customerID = n; }
    
    get costPerNight() { return this.#costPerNight; }
    set costPerNight( n ) { this.#costPerNight = n; }
    
    get startDate() { return this.#startDate; }
    set startDate( n ) { this.#startDate = n; }

    get endDate() { return this.#endDate; }
    set endDate( n ) { this.#endDate = n; }
    
    get stage() { return this.#stage; }
    set stage( n ) { this.#stage = n; }

    get roomTotal() { return this.#roomTotal; }
    set roomTotal( n ) { this.#roomTotal = n; }
    
    get adjustPriceBy() { return this.#adjustPriceBy; }
    set adjustPriceBy( n ) { this.#adjustPriceBy = n; }

    //additional obj functions
    calcRoomTotal() {
        if ( !isNotNaN( this.#endDate ) || !isNotNaN( this.#startDate ) ) { 
            return null; 
        }
        this.#roomTotal = this.#costPerNight * this.calcNights();
        return this.#roomTotal;
    }

    calcNights() {
        if ( !isNotNaN( this.#endDate ) || !isNotNaN( this.#startDate ) ) { 
            this.#numNights = null;
            return null; 
        }
        else {
            let startMSeconds = this.#startDate.valueOf();
            let endMSeconds = this.#endDate.valueOf();
            this.#numNights =  endMSeconds - startMSeconds; //difference in milliseconds
            this.#numNights = this.#numNights / ( 1000 * 60 * 60 * 24 ); //convert to days
            return this.#numNights; 
        }
    }

    advanceStage() {
        // if customer clicked remove/cancel then
        //      if cart/paying then make room available else leave along
                // if cancelCheckout change state to interrupted
                // if cancel remove change state to ( prvState + 'cancel' )
        //      change state to ( prvState + 'cancel' )
        switch ( this.#stage ) {
            case null:
                this.#stage = "cart";
                break;
            case 'cart':
                //when click pay
                this.#stage = "paid";
                // related  room.available = false;
                break;
            case 'paid':
                this.#stage = "staying"
                break;
            case 'staying':
                this.#stage = "complete"
                break;
            //should checkout process consider length of holdning room availability in cart?
            //reserved at add to cart, start
        }
    }
}
// #endregion

// #region getting and parsing JSON functions: get_Info, make_Array, _ = Hotel or Room, related arrays
let hotelArray = [];
let roomArray = [];

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

//#region Initial on load + addHotelsToMap() & addHotelIcon() + cartListener: 

// Add Hotel Icons to the map (map created in map.js script)
$( async function() {
    const hotelsRaw = await getHotelInfo();
    const roomsRaw = await getRoomInfo();

    hotelArray = makeHotelArray( hotelsRaw )
    roomArray = makeRoomArray( roomsRaw )

    addHotelsToMap( hotelArray, roomArray );   
});

const addHotelsToMap = ( hotelArray, roomArray ) => {
    let markerArray = [];
    for (let i = 0; i < hotelArray.length; i++) {
        markerArray[i] = addHotelIcon( hotelArray[i], roomArray );
    }
    return markerArray;
}

const addHotelIcon = ( hotelObj, roomArray ) => {  
    let marker = L.marker([hotelObj.lat, hotelObj.lng], {icon: hotelIcon}).addTo(map);
    marker.addEventListener("click", () => makeHotelCard( hotelObj, roomArray ));
    return marker;
}

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

    let numNights = book.calcNights();    
    if ( numNights == null ){ return; }

    let modalRoomTotalDivHTML = `
        <p id="${bookNum}Math" class="">${numNights} x ${ book.costPerNight }/night</p>
        <h5 id="${bookNum}roomTotal" class="h5" >${ book.calcRoomTotal() }</h5>
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
                <div class="card-body d-flex flex-column justify-content-between"> 
                    <div class="d-flex justify-content-between mb-0"> 
                        <button id="removeCartItem${posn}Btn" cartItem="${posn}" class="btn btn-outline-secondary 
                        btn-sm align-items-start me-5 py-1 px-2">X</button> 
                        <div>
                            <h5 class="inline mb-0">${book.hotelName} | ${book.roomName}</h5>
                            <hr class="my-0">
                        </div>
                    </div>
                    <div class="cartItemCount d-flex flex-column align-items-end justify-content-end my-0">
                        <p class="${posn}dates my-0">${book.startDate} to ${book.endDate}</p>
                        <p class="${posn}math my-0">${book.numNights} x $${book.roomCost}<span class="subscr">/night</span></p>
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
                <p class="h5 my-0">fees: ${cartTotals.fees.toFixed(2)}</p>
                <p class="h5 my-0">discounts: ${cartTotals.discounts.toFixed(2)}</p>
                <p class="h5 my-0">subtotal: ${subtotal.toFixed(2)}</p>
                <p class="h5 my-0">taxes: ${taxes.toFixed(2)}</p>
                <hr class="w100 my-2 btn-success-outline">
                <p class="h5 mt-1 mb-3">total: ${total.toFixed(2)}</p>
        `      
    $("#cartSumLines").html(cartTotalsHTML);
}




// #endregion
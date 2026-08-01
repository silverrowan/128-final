"use strict";
const isBlank = value => value === null || value === undefined || value === '';
const isNotNaN = value => !( isNaN(value) || value == null || value == undefined || value == '') ; 

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
    constructor( id, roomID, costPerNight ){
        this.#id=id;
        this.#roomID=roomID;
        // this.#customerID=customerID;
        this.#costPerNight=costPerNight;
        this.#startDate = null;
        this.#endDate = null;
        this.#numNights = null;
        this.#stage = "initial";
        this.#timeAdded = new Date();
        this.#timePaid = null;
        this.#roomTotal= null; 
        this.#adjustPriceBy = 0;
    }

    //setters and getters
    get id() { return this.#id; }
    set id( n ) { this.#id = n; }
    
    get roomID() { return this.#roomID; }
    set roomID( n ) { this.#roomID = n; }

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
                this.#stage = "initial"
                break;
            case initial:
                //when click pay
                this.#stage = "cart";
                // related  room.available = false;
                break;
            case cart:
                //when click pay
                this.#stage = "paying";
                // related  room.available = false;
                break;
            case paying:
                this.#stage = "paid";
                break;
            case paid:
                this.#stage = "staying"
                break;
            case staying:
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
    $("#roomsBtn").click( () => makeRoomCards( roomArray, hotel.id ) );
}

const makeRoomCards = ( roomArray, hotelId ) => {
    $("#roomCards").html( '' );    
    for ( let i = 0 ; i < roomArray.length ; i++ ){
        let room = roomArray[i];
        if ( hotelId == room.hotelId && room.available ){
            $("#roomCards").append( makeRoomCard( room ) );
            // $("#roomsBtn").click(  );
            $(`#bookRoom${room.id}`).click( () => openBookModal( room ) );
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

//#region making bookings
let bookingArray = [];

const openBookModal = ( room ) => {
    console.log(`open book modal for room ${room.id}`);
    let bookModelElmt = $( '#bookingModal' )[0];
    
    //create booking obj and assign variables
    let book = new Booking( bookingArray.length, room.id, room.pricePerNight );
    bookingArray.push( book );
    
    book.calcRoomTotal();
    
    //instanciate Bootstrap Modal window
    buildBookingModal( book, room );
    const bookingModal = bootstrap.Modal.getOrCreateInstance( bookModelElmt );
    bookingModal.show();
    
    //attach listener to updates as dates updated
    $('#checkInDate').on('change', () => updateBookModalroomTotal( book ));
    $('#checkOutDate').on('change', () => updateBookModalroomTotal( book ));
}

const buildBookingModal = ( book, room ) => {
    //get hotel id from '#makeCartEntry'
    let hotelId = $('#hotelTitle').attr('hotelId');
    let hotel = hotelArray[hotelId];

    let modalHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header flex-row justify-space-between">
                    <div class="flex-column align-start">
                        <h4 class="modal-title">${room.name}</h4>
                        <h5 class="h6 fst-italic">${hotel.name}</h5>
                    </div>
                    <button type="button" id="closeBtn" class="btn-close align-self-start" aria-label="Close"></button>
                </div>  
                <div class="modal-body">    
                    <form id="cartForm" action="" method="POST">
                        <div class="cartItemDateDiv d-flex justify-content-center mb-2">
                            <div class="d-flex justify-content-evenly align-items-center flex-column mx-3">
                                <label for="checkInDate">Check In (4pm)</label>
                                <input type="date" id="checkInDate" name="roomStart" />
                            </div>
                            <div class="d-flex justify-content-evenly align-items-center flex-column mx-3">
                                <label for="checkOutDate">Check Out (11am)</label>
                                <input type="date" id="checkOutDate" name="roomEnd" />
                            </div>
                        </div>
                        <div id="modalroomTotalDiv" class="cartItemCount d-flex flex-column align-items-end justify-content-end">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" id="cancelBtn" class="btn btn-outline-secondary">Cancel</button>
                    <button type="button" id="bookBtn" class="btn btn-primary">Book</button>
                </div>
            </div>
        </div>
                `;
    updateBookModalroomTotal( book );
    //listen for updates to dates
    $("#bookBtn").click( () => { makeBooking( book ) } );
    $("#bookingModal").html( modalHTML );

    //listen for modal buttons
    $("#closeBtn").click( () => $("#bookingModal").modal('hide') );
    $("#cancelBtn").click( () => $("#bookingModal").modal('hide') );
    $("#bookBtn").click( () => { makeBooking( book ) } );
}

const updateBookModalroomTotal = ( book ) => {  
    let bookNum = bookingArray.length;
    book.startDate = new Date( $('#checkInDate').val() );
    book.endDate = new Date( $('#checkOutDate').val() );

    let numNights = book.calcNights();    
    if ( numNights == null ){ return; }

    let costPer = book.costPerNight;
    let roomTotal = book.calcRoomTotal();

    let modalroomTotalDivHTML = `
        <p id="${bookNum}Math" class="">${numNights} x ${costPer}/night</p>
        <h5 id="${bookNum}roomTotal" class="h5" >${roomTotal}</h5>
        `;
    
    $("#modalroomTotalDiv").html( modalroomTotalDivHTML );
}

const makeBooking = ( booking ) => {
    console.log( booking );
    console.log(`make booking for room ${booking.roomID}`);
    
    $("#bookingModal").modal('hide')
    addBookingToCart( booking );
    openCart();
}

const addBookingToCart = ( room ) => {
    console.log(`add booking to cart for room ${room.id}`);
    bookingArray.push( room );
}

// #endregion
    
    //window contents
    //ATTACH LISTENERS TO ALL BUTTONS - close, book, etc
    //return booking obj - add to array and return that?
    // makeBooking( room );

// #region cart offCanvase & functions | makeCart() & makeCartEntry()
// reference & create modal itself
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

let cartArray = []

const openCart = () => {
    console.log(`open cart`);
    console.log( bootstrap );
    const offcanvasElmt = document.querySelector('#cartWrapperDiv');
    const offcanvasBS = bootstrap.Offcanvas.getOrCreateInstance( offcanvasElmt );
    offcanvasBS.show();
}

const makeCart = ( cart ) => {
    let cartHTML = `
        <div id="cartWrapperDiv" class="card justify-content-start align-items-end flex-column">
        <form id="cartForm" action="" method="POST">
            <div id="cartCardsDiv">
        `
        let fees = 0;
        let discounts = 0;
        let subtotal = 0;
        for ( let i = 0 ; i < cartArray.length ; i++ ){
            let room = cartArray[i];
            cartHTML += makeCartEntry( room, i );
            subtotal += book.roomTotal;
            if ( room.adjustPriceBy > 0 ) { fees += room.adjustPriceBy; }
            else if ( room.adjustPriceBy < 0 ) { discounts += room.adjustPriceBy }
            //ATTACH LISTENERS TO REMOVE BUTTONS
        }
        
        let taxes = ( subtotal + fees - discounts ) * ( 0.13 );
        let total = ( subtotal + fees - discounts + taxes ) 
        cartHTML += `
                </div>
                <!-- TOTALS -->
                <div id="cartSumLines" class="d-flex flex-column align-items-end 
                        mx-3 mb-3">
                    <p class="h5 my-0">Fees: ${fees}</p>
                    <p class="h5 my-0">Discounts: ${discounts}</p>
                    <p class="h5 my-0">Taxes: ${taxes}</p>
                    <hr class="w100 my-2 btn-success-outline">
                    <p class="h5 mt-1 mb-3">Total: ${total}</p>
                    <button id="cartCheckoutBtn" class="btn btn-lg 
                            btn-success">CHECKOUT</button>
                </div>

            </form>
        </div>
        `        
        $("#cartWrapperDiv").html(cartHTML);
    }

const makeCartEntry = ( room, index ) => {
    let roomNum = room.id;
    let roomName = room.name;
    let hotelId = room.hotelId;
    let startDate = room.startDate;
    let endDate = room.endDate;
    let numberOfNights = room.numberOfNights;
    let costPerNight = room.pricePerNight;
    let roomTotal = room.roomTotal;

    let hotelName = "hotel.name"; //WHERE HOTEL ID MATCHES ROOM HOTEL ID

    roomBookedHTML = `
            <div class="card m-3 d-flex">
                <div class="card-body d-flex flex-column justify-content-between"> 
                    <div class="d-flex justify-content-between mb-0"> 
                        <button id="removeCartItem${roomNum}-${index}Btn" roomNum="${roomNum}" class="btn btn-outline-secondary btn-sm 
                                    align-items-start me-5 py-1 px-2">X</button> 
                        <div>
                            <h5 id="${roomNum}-${index}Cart" class="inline mb-0" 
                                    roomNum="${roomNum}">${hotelName} | ${roomName}</h5>
                            <hr class="my-0">
                        </div>
                    </div>
                    <div class="cartItemCount d-flex flex-column align-items-end justify-content-end my-0">
                        <p class="${roomNum}-${index}Dates my-0">${startDate} to ${endDate}</p>
                        <p class="${roomNum}-${index}Math my-0">${numberOfNights} x ${costPerNight}<span class="subscr">/night</span></p>
                        <h5 class="${roomNum}-${index}roomTotal h5 my-1">${roomTotal}</h5>
                    </div>
                </div>
            </div>
            `;
    return roomBookedHTML; //FORGOT TO INCL CLEAR CART BUTTON
}
// #endregion
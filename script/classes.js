"use strict";
const isBlank = value => value === null || value === undefined || value === '';
const isNotNaN = value => !( isNaN(value) || value == null || value == undefined || value == '') ; 

//Global Variables
let hotelArray = [];
let cartTotals = {  roomsTotal: 0, fees: 0, discounts: 0};
let cartBS = null;
const offcanvasElmt = document.querySelector('#cartWrapperDiv');

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
    set rating( n ) { this.#rating = n; }

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
    _id;
    _roomID;
    _roomName;
    _hotelID;
    _hotelName;
    _customerID;
    _costPerNight;
    _startDate;
    _endDate;
    _numNights;
    _stage;
    _timeAdded;
    _timePaid;
    _roomTotal;
    _adjustPriceBy;

    //constructors
    constructor( id, roomID, roomName, hotelID, hotelName, costPerNight ){
        this._id = id;
        this._roomID = roomID;
        this._roomName = roomName;
        this._hotelID = hotelID;
        this._hotelName = hotelName;
        this._costPerNight = costPerNight;
        this._startDate = null;
        this._endDate = null;
        this._numNights = null;
        this._stage = "initial";
        this._timeAdded = new Date();
        this._timePaid = null;
        this._roomTotal= null; 
        this._adjustPriceBy = [];
    }

    //setters and getters
    get id() { return this._id; }
    set id( n ) { this._id = n; }
    
    get roomID() { return this._roomID; }
    set roomID( n ) { this._roomID = n; }

    get roomName() { return this._roomName; }
    set roomName( n ) { this._roomName = n; }

    get hotelID() { return this._hotelID; }
    set hotelID( n ) { this._hotelID = n; }

    get hotelName() { return this._hotelName; }
    set hotelName( n ) { this._hotelName = n; }

    get customerID() { return this._customerID; }
    set customerID( n ) { this._customerID = n; }
    
    get costPerNight() { return this._costPerNight; }
    set costPerNight( n ) { this._costPerNight = n; }
    
    get startDate() { return this._startDate; }
    set startDate( n ) { this._startDate = new Date(n); }

    get endDate() { return this._endDate; }
    set endDate( n ) { this._endDate = new Date(n); }

    get numNights() { return this._numNights; }
    set numNights( n ) { this._numNights = n; }
    
    get stage() { return this._stage; }
    set stage( n ) { this._stage = n; }

    get roomTotal() { return this._roomTotal; }
    set roomTotal( n ) { this._roomTotal = n; }
    
    get adjustPriceBy() { return this._adjustPriceBy; }
    set adjustPriceBy( n ) { this._adjustPriceBy = n; }

    //additional obj functions
    calcRoomTotal() {
        if ( !isNotNaN( this.endDate ) || !isNotNaN( this.startDate ) ) { 
            return null; 
        }
        this.roomTotal = this.costPerNight * this.calcNights();
        return this.roomTotal;
    }

    calcNights() {
        if ( !isNotNaN( this.endDate ) || !isNotNaN( this.startDate ) ) { 
            this.numNights = null;
            return null; 
        }
        else {
            let startMSeconds = this.startDate.valueOf();
            let endMSeconds = this.endDate.valueOf();
            this.numNights =  endMSeconds - startMSeconds; //difference in milliseconds
            this.numNights = this.numNights / ( 1000 * 60 * 60 * 24 ); //convert to days
            return this.numNights; 
        }
    }

    advanceStage() {
        // if customer clicked remove/cancel then
        //      if cart/paying then make room available else leave along
                // if cancelCheckout change state to interrupted
                // if cancel remove change state to ( prvState + 'cancel' )
        //      change state to ( prvState + 'cancel' )
        switch ( this.stage ) {
            case null:
                this.stage = "cart";
                break;
            case 'cart':
                //when click pay
                this.stage = "paid";
                // related  room.available = false;
                break;
            case 'paid':
                this.stage = "staying"
                break;
            case 'staying':
                this.stage = "complete"
                break;
            //should checkout process consider length of holdning room availability in cart?
            //reserved at add to cart, start
        }
    }
}
// #endregion
"use strict";
const isBlank = value => value === null || value === undefined || value === '';
const isNotNaN = value => !( isNaN(value) || value == null || value == undefined || value == '') ; 

//Global Variables
let hotelArray = [];
let roomArray = [];
let cartArray = [];
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
// don't actually end up using because I dont have any functions that needs it
// and the JSON parse turns it into regular objects, not instances of the class
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
// this one I do have class functions to use, so it needs to be 
// coverted into Booking instances
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

    get numNights() { return this.#numNights; }
    set numNights( n ) { this.#numNights = n; }
    
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
            case 'initial':
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

    toJSON() {
        return {
            id: this.#id,
            roomID: this.#roomID,
            roomName: this.#roomName,
            hotelID: this.#hotelID,
            hotelName: this.#hotelName,
            customerID: this.#customerID,
            costPerNight: this.#costPerNight,
            startDate: this.#startDate,
            endDate: this.#endDate,
            numNights: this.#numNights,
            stage: this.#stage,
            timeAdded: this.#timeAdded,
            timePaid: this.#timePaid,
            roomTotal: this.#roomTotal,
            adjustPriceBy: this.#adjustPriceBy
        };
    }



    static toObjInstance( stringArray ) {
        console.log( stringArray );
        

        cartArray = stringArray.map( obj => {
            const booking = new Booking(
                obj.id,
                obj.roomID,
                obj.roomName,
                obj.hotelID,
                obj.hotelName,
                obj.costPerNight
            );

            console.log( cartArray );
            

            booking.customerID = obj.customerID;
            booking.startDate = new Date( obj.startDate );
            booking.endDate = new Date( obj.endDate );
            booking.stage = obj.stage;
            booking.roomTotal = obj.roomTotal;
            booking.adjustPriceBy = obj.adjustPriceBy;

            return booking;
        });
    }
}
// #endregion
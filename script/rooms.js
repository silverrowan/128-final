"use strict";

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
    let roomCardsDiv = $("#roomCards");
    roomCardsDiv.html( '' );

    let roomArray = await getRoomsSave();
    
    makeRoomFilterSortHeader( roomCardsDiv, hotel, roomArray );
    
    makeFilteredRooms( hotel, roomArray)
};

const makeRoomFilterSortHeader = ( jQDiv, hotel, roomArray ) => {
    let filterHTML = `
        <div class="col w100">            
            <div class="card m-3 d-flex">
                <div class="card-body">
                    <div class="row g-3 justify-content-around align-items-stretch">
                        ${makeFilterByMaxGuests()}
                        ${makeSortBy()}
                    </div>
                </div>
            </div>
        </div>                
    `
    //attach html to page before jq element
    jQDiv.before(  filterHTML );

    //attach listeners to filter options
    $('#guestFilter').on('change', () => {
        makeFilteredRooms(hotel, roomArray)
    });
    $('#roomSort').on('change', () => {
        makeFilteredRooms(hotel, roomArray) 
    });
}

const makeFilterByMaxGuests = () => {
    let filterHTML = `
        <div class="d-flex flex-column justify-content-end col">
            <h6>Filter by number of guests staying</h6>
            <select id="guestFilter" class="form-select">
                <option value="all">Any Number of Guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests<option>
                <option value="4">4 Guests</option>
            </select>    
        </div>
    `
    return filterHTML;
}

const makeSortBy = () => {
    let sortHTML = `
        <div class="d-flex flex-column justify-content-end col">
            <h6>Sort by: </h6>
            <select id="roomSort" class="form-select">
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="guests">Max Guests</option>
                <option value="rating">Rating</option>
            </select>
        </div>   
    `
    return sortHTML;
}

const filterRooms = ( rooms ) => {
    const maxGuests = $('#guestFilter').val();
    if ( maxGuests == 'all' ) {
        return rooms;
    } else {
        let filteredRooms = rooms.filter( rooms => rooms.maxGuests >= Number(maxGuests) )
        return filteredRooms;
    }
}

const sortRooms = ( rooms ) => {
    const sort = $('#roomSort').val();

    rooms.sort((a, b) => {
        switch (sort) {
            case 'price-low':
                return a.pricePerNight - b.pricePerNight;

            case 'price-high':
                return b.pricePerNight - a.pricePerNight;

            case 'guests':
                return b.maxGuests - a.maxGuests;

            default:
                return 0;
        }
    });

    return rooms;
};

const updateRooms = async () => {
    let roomArray = await getRoomsSave();
    let rooms = filterRooms(roomArray);
    rooms = sortRooms(rooms);

    return rooms;
};

const makeFilteredRooms = ( hotel, allRooms ) => {
    let roomCardsDiv = $("#roomCards");
    roomCardsDiv.html( '' );

    let roomArray = allRooms.filter( room => room.hotelId == hotel.id );
    
    roomArray = filterRooms(roomArray);
    roomArray = sortRooms(roomArray);

    for ( let i = 0 ; i < roomArray.length ; i++ ){
        let room = roomArray[i];
        if ( hotel.id == room.hotelId ) {
            if ( room.available ){
                roomCardsDiv.append( makeRoomCard( room, true ) );
                $(`#bookRoom${room.id}`).click( () => {
                    openBookModal( room, hotel );
                });
            } else {
                roomCardsDiv.append( makeRoomCard( room, false ) );
            }
                
        }
    }
}   


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
    
    let isFound = false;

    for (let i = 0; i < roomArray.length; i++) {
        if ( roomArray[i].id === roomID ) {
            roomArray[i].available = isAvailable;
            isFound = true;
            break
        }
    } 

    if (isFound === true ) {
        setRoomsSave( roomArray );
    } else {
    throw new Error ('cannot find room')
    }
}

const buildBookingModal = ( book, cart, hotel ) => {
    updateModalTitleHTML( book );
    updateModalTotalHTML( book, cart );
    updateModalListeners( book, hotel );
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

const updateModalListeners = ( book, hotel ) => {
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
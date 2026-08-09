
"use strict";
// cart offCanvase & functions | openCart(), addToCart(), makeCartItemHTML(), updateCartTotalsHTML()        

const clearCartItemHTML = () => $("#cartCardsDiv").html( '' );

const resetCartTotalsTo0 = () => {
    cartTotals.roomsTotal = 0;
    cartTotals.fees = 0;
    cartTotals.discounts = 0;
    
    updateCartTotalsHTML();
}

const reBuildCart = ( cartArray ) => {
    // if ( cartBS ){ cartBS.dispose(); }
    clearCartItemHTML();
    resetCartTotalsTo0();

    for (let i = 0 ; i < cartArray.length ; i++ ){
        let book = cartArray[i];
        if ( book != 'paid' ) {
            makeCartItemHTML( cartArray[i] );
            addToCartTotals( cartArray[i] );
        }
    }
    updateCartTotalsHTML();
    cartBS = bootstrap.Offcanvas.getOrCreateInstance( offcanvasElmt );
}

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
};

const removeCartItem = async ( itemID ) => {
    console.log( "in remove cart item" );
    console.log( itemID );
    
    let cart = await getCartSave();

    let removedIndex = cart.findIndex( item => item.id == itemID )
    let removed = cart.splice( removedIndex , 1 ); //save removed obj as removed (array)

    await setRoomAvailabilityAndSave( removed[0].roomID, true);
    await makeRoomCards( removed[0].hotelID );
    await setCartSave( cart );

    openCart();
}

const clearCart = async () => {
    let isConfirmed = confirm("Are you sure you want to remove everything? You will lose your holds on all rooms in the cart.");
    if ( !isConfirmed ) { return; }
    clearCartYes();
    cartBS.hide();
    openCart();    
}

const clearCartYes = async () => {
    let cart = await getCartSave();
    for ( let i = 0; i < cart.length ; i++ ){
        await setRoomAvailabilityAndSave( cart[i].roomID, true);
        cart[i]='';
    }

    cart = [];
    await setCartSave( cart );
}

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

        $(`#${book.id}removeCartItemBtn`).click( () => removeCartItem( book.id ) );
    }
}

const addToCartTotals = ( book ) => { //booking already exists
    cartTotals.roomsTotal += book.roomTotal;
    
    let adjustments = book.adjustPriceBy;
    for ( let i = 0 ; i < adjustments.length ; i++ ) {
        if ( adjustments[i] > 0 ) { cartTotals.fees += adjustments[i]; }
        else if ( adjustments[i] < 0 ) { cartTotals.discounts += adjustments[i]; }
    }

    updateCartTotalsHTML();
}

const updateCartTotalsHTML = () => {
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
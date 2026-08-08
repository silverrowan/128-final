//on load setup:
// addHotelsToMap() & addHotelIcon() + cartListeners: 

// Add Hotel Icons to the map (map created in map.js script)
$( async function() {
    console.log("--------------------------page initial loading-------------------------")
    hotelArray = await getHotelArray();  
    let initialRoomArray = await getRoomsSave();
    let initialCartArray = await getCartSave();
    

    addHotelsToMap( hotelArray );
    reBuildCart( initialCartArray )


    //initial modals and offcanvases
    let coutModal = bootstrap.Modal.getOrCreateInstance( $("#coutModal")[0] );
    let confModal = bootstrap.Modal.getOrCreateInstance( $("#confCheckoutDetailsContent")[0] );


    // the initial booking modal listeners need information on current state, so are attached 
    // later with that information, tried using using .off(...).on(...) to avoid
    // build-up of multiple listeners, but didn't seem to work right, leaving as
    // is for now, as behaves correctly. 

    //attach listeners to permanent buttons - inclues invisible ones -- as long as not built/depend on in the JS
    // Cart Listeners
    $("#navCartBtn").click( () => openCart() );
    $("#cartClearBtn").click( () => clearCart() );
    $("#cartCheckoutBtn").click( () => openCheckout() );
    //Checkout P1 Btn Listeners
    $("#coutCloseBtn").click( () => $("#coutModal").modal('hide') );
    $("#coutCancelBtn").click( () => $("#coutModal").modal('hide') );
    $("#coutContinueBtn").click( () => {
        if ( validatePersonalFields() && validateAddressFields( "p" ) ){
            showConfirmOrder();
        }
    });
    //Confirmation (Checkout p2) Btn Listeners
    $("#coutConfCloseBtn").click( () => $("#coutConfModal").modal('hide') );
    $("#coutConfPrevBtn").click( () => $("#coutConfModal").modal('hide') );
    $("#coutConfContinueBtn").click( () => {
        updateOrderInfo();
        showPayModal();
        $("#coutConfModal").modal('hide')
        $("#pmtModal").modal('show');


    //Payment (Checkout p3) Btn Listeners


    //Order Success/Problem Btn Listeners
    } );


    $('#pmtMethods').on('change', () => { 
        validatePersonalFields();
        updatePmtFields( );
    });
   

});
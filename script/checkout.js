//regex strings for confirming input text meets requirements
const nameRegEx = /^[a-zA-Z\s\.\-'\(\)]+$/;
const emailRegEx = /^[\w\.\-]+@[\w\.\-]+\.[\w\.\-]+$/;
const phoneRegEx = /^(\(\d\) ?|\d ?|)(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}/;

const addressRegEx = /^[\w\s\.\-'\/]+$/;
const postCodeRegEx = /^[a-zA-Z]\d[a-zA-Z] ?\d[a-zA-Z]\d$/;
const zipCodeRegEx = /^\d{5}$/;

const ccNumRegEx = /^\d{4}[\- ]?\d{4}[\- ]?\d{4}[\- ]?\d{4}$/ ;
const yearRegEx = /^((20)|())\d{2}$/;
const cvcRegEx = /^\d{3}$/;

const makeFormInputObj = ( fieldID ) => {
    let input = {
        //Named the Title Label and the tiptext IDs as a modification of the
        //field ID, so could be selected with just th eone input
        field: $(`#${fieldID}`),
        label: fieldLabel = $(`#${fieldID}Lbl`),
        tip: $(`#${fieldID}Tip`),   
    }
    //get the value of the input box and trim off any start/end whitespace
    input.value = input.field.val().trim()
    input.required = input.field.attr('required');
    return input;
}

const validateField = (fieldID, fieldRegEx) => {
    let input = makeFormInputObj( fieldID )

    //if the input is not required and its value is empty/null/undef/etc then its valid
    if (!input.required && (input.value == "" || !input.value) ) { return true; }
    else { //otherwise check matches string & set classes appropriately
        return validateClassToggle ( fieldRegEx.test( input.value ), input ) 
    }
}

const validateSelect = ( selectID ) => { 
    //only checking that it has been selected as
    // the values are pre-set
    //See validateField for comments if needed
    let input = {
        field: $(`#${fieldID}`),
        label: fieldLabel = $(`#${fieldID}Lbl`),
        tip: $(`#${fieldID}Tip`),   
    }
    input.value = input.field.val().trim()
    
    if ( input.value != null && input.value != undefinedd && 
            !input.value.equals('') ) {
        validateClassToggle( true, input )
    } else {         
        validateClassToggle( false, input )
    }
    return input.value;
}

const validateMonthNum = ( fieldID ) => {
    let input = {
        field: $(`#${fieldID}`),
        label: fieldLabel = $(`#${fieldID}Lbl`),
        tip: $(`#${fieldID}Tip`),   
    }
    input.value = input.field.val().trim().parseInt()

    validateClassToggle ( input.value <= 12 && input.value >= 1, input );
}

const validateClassToggle = ( isValid, input ) => {
    if ( typeof( input ) == 'string') {
        input = makeFormInputObj( input );
    }
    if ( isValid ) {
        input.tip.addClass("hidden") 
        input.field.removeClass( "error" ); 
        input.label.removeClass("error");
        // fieldTip.removeClass("error");
        return true;
    } else {         
        input.tip.removeClass( "hidden" );
        input.field.addClass("error");
        input.label.addClass("error");
        // fieldTip.addClass("error");
        return false;
    }    
}

const resetValidationCOut = () => {
    validateClassToggle( true , 'firstNameTxt');
    validateClassToggle( true , 'lastNameTxt');
    validateClassToggle( true , 'phoneIn');
    validateClassToggle( true , 'emailIn');
    validateClassToggle( true , 'pstAddressTxt');
    validateClassToggle( true , 'pcityTxt');
    validateClassToggle( true , 'pzipTxt');
    validateClassToggle( true , 'pstateTxt');
    validateClassToggle( true , 'pcountryTxt');
}

const validatePersonalFields = () => {
    //if all validate to true, return true (passed validation) otherwise
    // fails validation. Short-circuits, so may have incorrect options beyond.
    //prevents needed to fix many at the same time and potentially overwhealming
    //customer
    if ( validateField( 'firstNameTxt', nameRegEx ) &&
            validateField( 'lastNameTxt', nameRegEx ) &&
            validateField( 'phoneIn', phoneRegEx ) &&
            validateField( 'emailIn', emailRegEx ) ) {
        return true;
    } else { return false; }
};

const validateAddressFields = ( addressPrefix ) => {
    //see validatePersonalFields for comments, they're the same.
    if ( validateField( `${addressPrefix}stAddressTxt`, addressRegEx ) &&
            validateField( `${addressPrefix}cityTxt`, addressRegEx ) && 
            ( validateField( `${addressPrefix}zipTxt`, postCodeRegEx ) || 
                        validateField( `${addressPrefix}zipTxt`, zipCodeRegEx ) ) &&
            validateField( `${addressPrefix}stateTxt`, addressRegEx ) &&
            validateField( `${addressPrefix}countryTxt`, addressRegEx ) ){
        return true;
    } else { return false; }
}

const addPmtFields = () => {
    pmtHTML = `
                        <div class="row g-3 my-3"><h5>Payment</h5></div>
                        <label class="form-label" for="pmtMethods" id="pmtMethodsLbl">Payment Method*</label>
                        <select name="paymentMethods" id="pmtMethods" required>
                            <option value="" selected disabled hidden>Choose one</option>
                            <option value="Credit">Credit Card</option>
                            <option value="Debit">Debit</option>
                            <option value="Cash">Cash</option>
                            <option value="Paypal">PayPal</option>
                        </select>
                        <label class="form-label hidden" for="pmtMethods" id="pmtMethodsTip">
                            A payment method is required. Please choose a payment method.</label>
                    </div>



                        <div class="row g-3 my-3"><hr></div>
                        <div id="paymentMethodSpecific">
                            <div class="row g-3 my-3"><h5>Billing Address</h5></div>
                            <div class="row g-3 mb-3">
                                <div class="form-floating col g-3" >
                                    <input type="text" class="form-control" id="stAddressTxt" name="stAddress" placeholder=" " required/>
                                    <label class="form-label" for="stAddressTxt">Address</label>
                                    <label class="form-label hidden formTip" for="stAddressTxt">Please enter a valid address.</label>
                                </div>                        
                            </div>
                            <div class="row g-3 mb-3">
                                <div class="form-floating col-7 g-3" >
                                    <input type="text" class="form-control" id="cityTxt" name="city" placeholder=" " required/>
                                    <label class="form-label" for="cityTxt">City</label>
                                    <label class="form-label hidden formTip" for="cityTxt">Please enter a valid city name.</label>
                                </div>
                                <div class="form-floating  col-5 g-3" >                                
                                    <input type="text" class="form-control" id="zipTxt" name="zip" placeholder=" " required/>
                                    <label class="form-label" for="zipTxt">Postal Code / ZIP</label>
                                    <label class="form-label hidden formTip" for="zipTxt">Please enter a valid postal or zip code.</label>
                                </div>                        
                            </div>
                            <div class="row g-3 mb-3">
                                <div class="form-floating  col-5 g-3" >
                                    <input type="text" class="form-control" id="stateTxt" name="state" placeholder=" " required/>
                                    <label class="form-label" for="stateTxt">Provence / State</label>
                                    <label class="form-label hidden formTip" for="citystateTxtTxt">Please enter a valid region name.</label>
                                </div>
                                <div class="form-floating  col-7 g-3" >
                                    <input type="text" class="form-control" id="countryTxt" name="country" placeholder=" " required/>
                                    <label class="form-label" for="countryTxt">Country</label>
                                    <label class="form-label hidden formTip" for="countryTxt">Please enter a valid region name.</label>
                                </div>
                            </div>
                            <div class="row g-3 my-3"><hr></div>
                            <div class="row g-3 my-3"><h5>Credit Cart</h5></div>
                            <div class="row g-3 mb-3">
                                <div class="form-floating col g-3" >
                                    <input type="text" class="form-control" id="ccNumber" name="ccNum" placeholder=" " required/>
                                    <label class="form-label" for="ccNumber">Credit Card Number</label>
                                    <label class="form-label hidden formTip" for="ccNumber">Please enter a Credit Card Number.</label>
                                </div>
                            </div>
                            <div class="row g-3 mb-3">
                                <div class="form-floating col g-3" >
                                    <label class="form-label" for="ccMonth">Expiration</label>
                                </div>
                            </div>
                            <div class="row g-3 mb-3">
                                <div class="form-floating col-4 g-3" >
                                    <input type="number" class="form-control" id="ccMonth" name="ccMonth" placeholder=" " required/>
                                    <label class="form-label" for="ccMonth">Month</label>
                                    <label class="form-label hidden formTip" for="ccNumber">Please select a month.</label>
                                </div>
                                <div class="form-floating col-4 g-3" >
                                    <input type="number" class="form-control" id="ccYear" name="ccYear" placeholder=" " required/>
                                    <label class="form-label" for="ccYear">Year</label>
                                    <label class="form-label hidden formTip" for="ccNumber">Please enter a valid Year.</label>
                                </div>
                                <div class="form-floating col-4 g-3" >
                                    <input type="number" class="form-control" id="ccCVC" name="ccCVC" placeholder=" " required/>
                                    <label class="form-label" for="ccCVC">CVC</label>
                                    <label class="form-label hidden formTip" for="ccNumber">Please enter a valid CVC.</label>
                                </div>
                            </div>
                        </div>    
    `
}

const validatePmtFields = () => {
    let pmtChoice = validateSelect( pmtMethods );
    switch ( pmtChoice ) {
        case 'Cash':
        case 'Debit':
        case 'PayPal':
            //no additional fields to validate
            return true;
        case 'Credit':
            //see validatePersonalFields for comments, they're the same.
            if ( validateField( ccNumber, ccNumRegEx ) &&
                    validateField( ccMonth, validateMonthNum( ccMonth ) ) &&
                    validateField( ccYear, yearRegEx ) &&
                    validateField( ccCVC, cvcRegEx ) ) {
            return true;
        } else { return false; }
    }
}

const openCheckout = async ( cart ) => {
    cartBS.hide();
    let order = await getOrderSave();
    let coutModalDiv = $("#coutModal")[0];

    resetValidationCOut(); //clear previous validation errors

    //create order obj & address obj and assign variables
    // let mailingAddress = new Address();
    // let order = new Order( cart );

    attachCustomerListeners();
    attachAddressListeners( 'p' );

    //make & show bootstrap Modal window
    const coutModal = bootstrap.Modal.getOrCreateInstance( coutModalDiv );
    coutModal.show();
}

const attachCustomerListeners = () => {
    //Customer information listeners
    listenFieldAndUpdate( $('#firstNameTxt'), nameRegEx, 'customerFName' );
    listenFieldAndUpdate( $('#lastNameTxt'), nameRegEx, 'customerLName' );
    listenFieldAndUpdate( $('#phoneIn'), phoneRegEx, 'customerPhone' );
    listenFieldAndUpdate( $('#emailIn'), emailRegEx, 'customerEmail' );
}

const attachAddressListeners = ( addressPrefix, addressOrderName ) => {
    let stAddress = $(`#${addressPrefix}stAddressTxt`);
    let city = $(`#${addressPrefix}cityTxt`);
    let zip = $(`#${addressPrefix}zipTxt`);
    let state = $(`#${addressPrefix}stateTxt`);
    let country = $(`#${addressPrefix}countryTxt`);
    
    listenFieldAndUpdate( stAddress, addressRegEx, `${addressOrderName}.stAddress` );
    listenFieldAndUpdate( city, addressRegEx, `${addressOrderName}.city` );
    listenFieldAndUpdate( state, addressRegEx, `${addressOrderName}.state` );
    listenFieldAndUpdate( country, addressRegEx, `${addressOrderName}.country` );
    
    //zip is slightly different, as there are two acceptable patterns
    zip.on('change', async () => {
        if ( validateField(zip, postCodeRegEx)  ||  validateField(zip, zipCodeRegEx) ) {
            updateValidatedOrderField( zip, addressOrderName.orderProperty )
        }});
}

const listenFieldAndUpdate = ( fieldID, fieldRegEx, orderProperty ) => {
    //Customer information listeners
    //each triggers on change of related input field, checks if its a valid value 
    // (and when doing that triggers the class toggle or not), then if it is valid, 
    // gets the current state of the order, and updates the field and saves it
   fieldID.on('change', async () => {
        if ( validateField( fieldID, fieldRegEx ) ) {
            updateValidatedOrderField( fieldID, orderProperty )
        }});       
}

const updateValidatedOrderField = async ( fieldID, orderProperty ) => {
    let order = await getOrderSave();
    order[orderProperty] = fieldID.val();
    await setOrderSave( order );
}

const showConfirmOrder = () => {
    console.log( " show confirmation page ");
};

// const openBookModal = async ( room, hotel ) => {
//     let order = await getCartSave();
//     let bookModelElmt = $( '#bookingModal' )[0]; //get the element from jQuery selector to pass to bootstrap modal instance
    
//     //create booking obj and assign variables
//     let order = new Order(  );
//     await setRoomAvailabilityAndSave( room.id, false );
//     await makeRoomCards( hotel ); // rebuild room availability (visible in background)

//     //create the modal HTML; includes attaching it to the modal DOM element 
//     buildBookingModal( book, cart, hotel );  
//     // make & show Bootstrap Modal window
//     const bookingModal = bootstrap.Modal.getOrCreateInstance( bookModelElmt );
//     bookingModal.show();
// }

// const checkRoomAvailability = ( roomID ) => {
//     let roomArray = getRoomsSave();

//     for (let room of roomArray) {
//         if (room.id === roomID) {
//             return room.available
//         } else {
//             throw new Error( 'cannot find room' )
//         }
//     }
// }

// const setRoomAvailabilityAndSave = async ( roomID, isAvailable ) => {
//     let roomArray = await getRoomsSave();
//     console.log( "in set room avail and save: get: ");
//     console.log( roomArray);
    
//     let isFound = false;

//     for (let i = 0; i < roomArray.length; i++) {
//         if ( roomArray[i].id === roomID ) {
//             roomArray[i].available = isAvailable;
//             isFound = true;
//             break
//         }
//     } 

//     if (isFound === true ) {
//         console.log(  "in set room avail and save: found room: " );
//         console.log( roomArray );
//         setRoomsSave( roomArray );
//     } else {
//     throw new Error ('cannot find room')
//     }
// }

// const buildBookingModal = ( book, cart, hotel ) => {
//     updateModalTitleHTML( book );
//     updateModalTotalHTML( book, cart );
//     updateModalListeners( book, hotel );
// }

// const updateModalTitleHTML = ( book ) => {
//     let modalTitleHTML = `
//                         <h4 class="modal-title">${book.roomName}</h4>
//                         <h5 class="h6 fst-italic">${book.hotelName}</h5>
//                         `
//     $("#BookingModalTitle").html( modalTitleHTML )
// }

// const updateModalTotalHTML = ( book, cart ) => {  
//     let bookNum = cart.length;
//     book.startDate = new Date( $('#checkInDate').val() );
//     book.endDate = new Date( $('#checkOutDate').val() );

//     book.numNights = book.calcNights();    
//     if ( book.numNights == null ){ return; }

//     let modalRoomTotalDivHTML = `
//         <p id="${bookNum}Math" class="">${book.numNights} x $${book.costPerNight}/night</p>
//         <h5 id="${bookNum}roomTotal" class="h5" >$${book.calcRoomTotal()}</h5>
//         `;
//     $("#modalroomTotalDiv").html( modalRoomTotalDivHTML );
// }

// const updateModalListeners = ( book, hotel ) => {
//     //attach listener to updates as dates updated
//     $('#checkInDate').on('change', async () => {
//         let cart = await getCartSave();
//         updateModalTotalHTML( book, cart ) 
//     });
//     $('#checkOutDate').on('change', async () => {
//         let cart = await getCartSave();
//         updateModalTotalHTML( book, cart ) 
//     });
    
//     //listen for modal buttons
//     $("#closeBtn").click( () => {
//         setRoomAvailabilityAndSave( book.roomID, true);
//         makeRoomCards( hotel );
//         $("#bookingModal").modal('hide');
//     });
//     $("#cancelBtn").click( () => {
//         setRoomAvailabilityAndSave( book.roomID, true);
//         makeRoomCards( hotel );
//         $("#bookingModal").modal('hide');
//     });
//     $("#bookBtn").click( async () => {
//         let cart = await getCartSave();
//         $("#bookingModal").modal('hide')
//         addCartItem( book, cart ); //
//         openCart(); //dont use same cart b/c modified it in addCartItem() abv
//      } );
// }
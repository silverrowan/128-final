//--------------------------------------------------------------------------------------
//-----------------------------CHECKOUT MULTIPLE WINDOWS--------------------------------
//--------------------------------------------------------------------------------------
//these functions are not specific to any one checkout window, but used across multiple

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

// Convert **input field** JQuery element or id-String into Object, 
// returns the object
// references input, main label, and tip or comment label as jQuery 
// elements, and if the field is required, and its current value
const makeFormInputObj = ( jQElement ) => {
    if ( typeof( jQElement ) == 'string') {
        jQElement = $(`#${jQElement}`);
    }    
    let input = {
        // relies on order of input field and elements.
        //below didn't work;
        //Named the Title Label and the tiptext IDs as a modification of the
        //field ID, so could be selected with just the one input
        field: jQElement,
        label: jQElement.prev(),
        tip: jQElement.next(),
        isRequired: jQElement.prop('required')
        // isRequired = $(`#${fieldID}`).attr('required');
    }
    //get the value of the input box and trim off any start/end whitespace
    input.value = input.field.val().trim()
    return input;
}

//attach a listener to the field that:
    // triggers on change of input field
    // checks if its a valid value ( and triggers validateClassToggle() as appropriate)
    // then if it is valid
    // updates the order field and saves it
const listenFieldAndUpdate = ( jQString, fieldRegEx, orderProperty ) => {
    jQString.on('change', async () => {
        let inputObj = makeFormInputObj ( jQString )
        if ( validateField( inputObj, fieldRegEx ) ) {
            updateValidatedOrderField( inputObj, orderProperty )
        }});       
}

const validateField = (inputObj, fieldRegEx) => {
    //if the input is not required and its value is empty/null/undef/etc then its valid
    if ( (inputObj.value == "" || !inputObj.value) && !inputObj.isRequired ) { 
        validateClassToggle ( true , inputObj );
        return true; }
    else { //otherwise check matches string & set classes appropriately
        let isValid = fieldRegEx.test( inputObj.value );
        return validateClassToggle ( isValid, inputObj ) 
    }
}

//turn hidden and error classes of input element and related 
// labels on and off by validity state
const validateClassToggle = ( isValid, inputObj ) => {
    if ( isValid ) {
        inputObj.tip.addClass("hidden") 
        inputObj.field.removeClass( "error" ); 
        inputObj.label.removeClass("error");
        // fieldTip.removeClass("error");
        return true;
    } else {         
        inputObj.tip.removeClass( "hidden" );
        inputObj.field.addClass("error");
        inputObj.label.addClass("error");
        // fieldTip.addClass("error");
        return false;
    }    
}

const updateValidatedOrderField = async ( inputObj, orderProperty ) => {
    let order = await getOrderSave();
    order[orderProperty] = inputObj.value;
    await setOrderSave( order );
}

//--------------------------------------------------------------------------------------
//-----------------------------CHECKOUT CUSTOMER DETAILS--------------------------------
//--------------------------------------------------------------------------------------
const openCheckout = async ( cart ) => {
    cartBS.hide();
    let order = await getOrderSave(); //from dataAccess
    let coutModalDiv = $("#coutModal")[0];

    resetValidationCOut(); //clear previous validation errors

    attachCustomerListeners();

    // find in 'multiple windows' section

    //make & show bootstrap Modal window
    coutModal = bootstrap.Modal.getOrCreateInstance( coutModalDiv );
    coutModal.show();
}

//sepecific to page 1 of checkout
const resetValidationCOut = () => {
    validateClassToggle( true , makeFormInputObj( 'firstNameTxt' ) );
    validateClassToggle( true , makeFormInputObj( 'lastNameTxt') );
    validateClassToggle( true , makeFormInputObj( 'phoneIn') );
    validateClassToggle( true , makeFormInputObj( 'emailIn') );
    validateClassToggle( true , makeFormInputObj( 'pstAddressTxt') );
    validateClassToggle( true , makeFormInputObj( 'pcityTxt') );
    validateClassToggle( true , makeFormInputObj( 'pzipTxt') );
    validateClassToggle( true , makeFormInputObj( 'pstateTxt') );
    validateClassToggle( true , makeFormInputObj( 'pcountryTxt') );
}

const attachCustomerListeners = () => {
    //Customer information listeners
    listenFieldAndUpdate( $('#firstNameTxt'), nameRegEx, 'customerFName' );
    listenFieldAndUpdate( $('#lastNameTxt'), nameRegEx, 'customerLName' );
    listenFieldAndUpdate( $('#phoneIn'), phoneRegEx, 'customerPhone' );
    listenFieldAndUpdate( $('#emailIn'), emailRegEx, 'customerEmail' );

    attachAddressListeners( 'p', 'customer' );
}

const validatePersonalFields = () => {
    //if all validate to true, return true (passed validation) otherwise
    // fails validation. Short-circuits, so may have incorrect options beyond.
    //prevents needed to fix many at the same time and potentially overwhealming
    //customer
    if ( validateField( makeFormInputObj( 'firstNameTxt') , nameRegEx )&&
            validateField( makeFormInputObj( 'lastNameTxt') , nameRegEx )&&
            validateField( makeFormInputObj( 'phoneIn') , phoneRegEx )&&
            validateField( makeFormInputObj( 'emailIn') , emailRegEx ) ) {
        return true;
    } else { return false; }
};




const attachAddressListeners = ( addressIDPrefix, addressObjPrefix ) => {
    let stAddress = $(`#${addressIDPrefix}stAddressTxt`);
    let city = $(`#${addressIDPrefix}cityTxt`);
    let zip = $(`#${addressIDPrefix}zipTxt`);
    let state = $(`#${addressIDPrefix}stateTxt`);
    let country = $(`#${addressIDPrefix}countryTxt`);
    
    listenFieldAndUpdate( stAddress, addressRegEx, `${addressObjPrefix}StAddress` );
    listenFieldAndUpdate( city, addressRegEx, `${addressObjPrefix}City` );
    listenFieldAndUpdate( state, addressRegEx, `${addressObjPrefix}State` );
    listenFieldAndUpdate( country, addressRegEx, `${addressObjPrefix}Country` );
    
    //zip is slightly different, as there are two acceptable patterns
    zip.on('change', async () => {
        zipObj = makeFormInputObj( zip );
        if ( validateField(zipObj, postCodeRegEx)  ||  validateField(zipObj, zipCodeRegEx) ) {
            updateValidatedOrderField( zipObj, `${addressObjPrefix}Zip` )
        }});
}

const validateAddressFields = ( addressIDPrefix ) => {
    //see validatePersonalFields for comments, they're the same.
    if ( validateField( makeFormInputObj(  `${addressIDPrefix}stAddressTxt` ), addressRegEx ) &&
            validateField( makeFormInputObj(  `${addressIDPrefix}cityTxt` ), addressRegEx ) && 
            ( validateField( makeFormInputObj(  `${addressIDPrefix}zipTxt` ), postCodeRegEx ) || 
                        validateField( makeFormInputObj(  `${addressIDPrefix}zipTxt` ), zipCodeRegEx ) ) &&
            validateField( makeFormInputObj(  `${addressIDPrefix}stateTxt` ), addressRegEx ) &&
            validateField( makeFormInputObj( `${addressIDPrefix}countryTxt` ), addressRegEx ) ){
        return true;
    } else { return false; }
}








const showConfirmOrder = () => {
    console.log( " show confirmation page ");
    coutModal.hide();
    
    buildConfirmationWindow();
    let confModalDiv = $("#coutConfModal")[0];
    //make & show bootstrap Modal window
    confModal = bootstrap.Modal.getOrCreateInstance( confModalDiv );
    confModal.show();
};

//directly related, but dont want to have to make them back into order objs
const checkCustomerAddressComplete = ( object ) => {
    let { customerStAddress, customerCity, customerZip,
        customerState, customerCountry } = object;

    if ( !!customerStAddress && !!customerCity && !!customerZip && 
        !!customerState && !!customerCountry ) {
        return true;
    } else { return false; }
}


const buildConfirmationWindow = async () => {
    let order = await getOrderSave(); //from dataAccess

    let { bookingArray, isPaid, customerFName, customerLName, customerPhone, 
        customerEmail, customerStAddress, customerCity, customerZip,
        customerState, customerCountry } = order;
    console.log( order );

    //Personal Details section, including mailing address only if entered
    // a *complete* mailing address, otherwise treats entire address as empty
    let confHTML = `
        <h4>Personal Details</h4>
        <h5 class="mb-0 mt-3">${customerFName} ${customerLName}</h5>     
        `
    let isComplete =  checkCustomerAddressComplete( order ) ;
    console.log( isComplete );
    
    if ( isComplete == true ) {
        confHTML += `
            <p>${customerStAddress}<br>
            ${customerCity}, ${customerState}<br>
            ${customerZip}<br>
            ${customerCountry}<br></p>
            <p class="mt-2">
        ` }        
    if ( customerPhone != null ){
    // if ( !phone ){
        confHTML += `Phone: ${customerPhone}<br>`
    }
    confHTML += `
        Email: ${customerEmail}</p>
        <hr>
    `
    //Order Details Section

        confHTML += `
        <h4>Purchase Details</h4>
        `
        let subtotal = 0;

        bookings = await getCartSave();
        console.log( bookings );
        console.log( order );
        
        for (book of bookings){
            let { id, roomID, roomName, hotelID, hotelName, customerID, 
                    cost, start, end, nights, stage, timeBooked, 
                    roomTotal, adjust } = book;
            subtotal += roomTotal;
            confHTML += `
                <div class="d-flex justify-space-between mt-3">
                    <p>${hotelName} | ${roomName} | ${start} to ${end}</p>
                    <p>$${roomTotal}</p>
                </div>
                <div class="aside justify-space-evenly">
                    <p>${start} to ${end}</p>
                    <p>|</p>
                    <p>${nights} nights</p>
                    <p>|</p>
                    <p>$${cost} per night</p>
                </div>
        ` }
        confHTML += `
            <div class="d-flex mt-3">
                <p><b>$${subtotal}</b></p>
                <p><b>$${ (subtotal * 0.13).toFixed(2) }</b></p>
                <p><b>$${ (subtotal * 1.13).toFixed(2) }</b></p>
            </div>
            <hr>
        ` 
    $('#confCheckoutDetailsContent').html( confHTML );
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
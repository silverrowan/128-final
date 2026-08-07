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

const makeFormInputObj = ( jQElement ) => {
    if ( typeof( jQElement ) == 'string') {
        jQElement = $(`#${input}`);
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

const validateField = (inputObj, fieldRegEx) => {
    // if ( typeof( jQElement ) == 'string') {
    //     input = makeFormInputObj( $(`#${jQElement}`) );
    // }
    // let input = makeFormInputObj( jQElement )

    //if the input is not required and its value is empty/null/undef/etc then its valid
    if ( (inputObj.value == "" || !inputObj.value) && !inputObj.isRequired ) { 
        validateClassToggle ( true , inputObj );
        return true; }
    else { //otherwise check matches string & set classes appropriately
        return validateClassToggle ( fieldRegEx.test( inputObj.value ), inputObj ) 
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

const validateClassToggle = ( isValid, inputObj ) => {
    // if ( typeof( input ) == 'string') {
    //     input = makeFormInputObj( $(`#${input}`) );
    // }
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

const validatePersonalFields = () => {
    //if all validate to true, return true (passed validation) otherwise
    // fails validation. Short-circuits, so may have incorrect options beyond.
    //prevents needed to fix many at the same time and potentially overwhealming
    //customer
    if ( validateField( makeFormInputObj( 'firstNameTxt', nameRegEx ) )&&
            validateField( makeFormInputObj( 'lastNameTxt', nameRegEx ) )&&
            validateField( makeFormInputObj( 'phoneIn', phoneRegEx ) )&&
            validateField( makeFormInputObj( 'emailIn', emailRegEx ) ) ) {
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

const listenFieldAndUpdate = ( jQString, fieldRegEx, orderProperty ) => {
    //Customer information listeners
    //each triggers on change of related input field, checks if its a valid value 
    // (and when doing that triggers the class toggle or not), then if it is valid, 
    // gets the current state of the order, and updates the field and saves it
    let inputObj = makeFormInputObj ( jQString )


    inputObj.on('change', async () => {
        if ( validateField( inputObj, fieldRegEx ) ) {
            updateValidatedOrderField( inputObj, orderProperty )
        }});       
}

const updateValidatedOrderField = async ( inputObj, orderProperty ) => {
    let order = await getOrderSave();
    order[orderProperty] = inputObj.val();
    await setOrderSave( order );
}

const showConfirmOrder = () => {
    console.log( " show confirmation page ");
};
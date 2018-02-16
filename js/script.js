$(document).ready(function() {

    var $body = $('html,body');
    var $popupOpen = $('[data-popup-open]');
    var $popupClose = $('[data-popup-close]');
    var $querySection = $('#querySection');
    var queryForm = document.getElementById('queryForm');

    /**
     * show/hide popups
     */

    // OPEN Popup-learn-more (event listener)
    $popupOpen.on('click', function(e) {
        var targeted_popup_class = $(this).attr('data-popup-open');

        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

        //prevent the page for reloading
        e.preventDefault();
    });


    //function to show Popup-query-success when needed
    function showPopup(popup) {
        $('[data-popup="' + popup + '"]').fadeIn(350);

        //add background image in backdrop
        $querySection.addClass("query-background-submission");
    }


    // CLOSE all Popups (event listener)
    $popupClose.on('click', function(e) {
        var targeted_popup_class = $(this).attr('data-popup-close');

        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

        e.preventDefault();
    });


    /**
     * scrolling
     */

    //event listener for scrolling (from Apply button to Query form)
    $("#linkQuery").on('click', function() {
        var target = $(this.hash);

        $body.animate({
            scrollTop: target.offset().top
        }, 1000);
        return false;
    });


    /**
     * email autocomplete
     */

        //available emails
    var availableEmails  =  [
            "alextest@gmail.com",
            "peter.test@itncorp.com",
            "daniel.test@itncorp.com",
            "bruce.test@itncorp.com",
            "bondar.test@dyninno.com",
            "svetlana.example@dyninno.com",
            "abbas.example@itncorp.com",
            "marina.example@itncorp.com",
            "jeffrey.example@itncorp.com"
        ];

    //jQuery UI Autocomplete plugin
    $( "#emailAutomplete" ).autocomplete({
        minLength:2,
        source: availableEmails
    });


    /**
     * ajax request for select box
     */

    //ajax request
    $.get( "/api/countries", function( data ) {
        var countries = [];
        $.each( data.response.data, function( index, value ) {
            countries.push( value );
        });

        //add elements from ajax request to HTML as options
        $.each(countries, function(key, value) {
            $('#selectLocation')
                .append($("<option></option>")
                    .attr("value",value)
                    .text(value));
        });
    })

    //if error occur
        .fail(function() {
            alert( "Sorry, Error occurred!" );
        })


    /**
     * form validation
     */

    // function to validate all form fields and add error classes if the form field is not valid
    function validateFormField(element) {
        var validationError = false;
        if(element.name=='location'&&element.selectedIndex == '0'){

            //add 'error" styling
            element.classList.add("error-form-field");

            validationError = true;
        }

        else if( element.name!='location' && element.value == "") {
            element.classList.add("error-form-field");
            validationError = true;
        }

        else if (element.name=='email'&&!validateEmail(element.value) ){
            element.classList.add("error-form-field");
            validationError = true;
        }
        else {
            //if the field is valid
            element.classList.remove("error-form-field");
        }
        return validationError;
    }

    //function to validate email with regExp
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    //event listener - when submit button is pressed, the form validation is executed
    queryForm.addEventListener("submit", function (event) {

        var title = document.querySelector("input[name='title']");
        var nameSurname = document.querySelector("input[name='name_surname']");
        var phone = document.querySelector("input[name='phone']");
        var email = document.querySelector("input[name='email']");
        var location = document.querySelector("select[name='location']");

        //validate all form fields
        var titleError = validateFormField(title);
        var nameError = validateFormField(nameSurname);
        var phoneError = validateFormField(phone);
        var locationError = validateFormField(location);
        var emailError = validateFormField(email);

        event.preventDefault();

        //if submission is valid and there are no errors
        if(!titleError && !nameError && !phoneError && !locationError && !emailError){

            //get data from form in an object and print in console
            var formData = {
                title: title.value,
                name: nameSurname.value,
                phone: phone.value,
                email: email.value,
                location: location.value};
            console.log('form_data');
            console.log(formData);

            //clear out all form fields
            queryForm.reset();

            //and show popup2 for success
            showPopup('popup-query-success');
        }
    });

});

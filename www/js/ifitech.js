/********App Initialization *************/
var myApp = new Framework7({

    material : true,
    materialRipple : true,
    materialRippleElements : '.ripple',
    modalTitle : 'Ifitech Limited',
    fastClicks : false,
    sortable : false
   });

// Export selectors engine
var $$ = Dom7;


var fireUpPayments;
document.addEventListener("deviceready", deviceIsReady, false);


function deviceIsReady(){
StatusBar.backgroundColorByHexString("#0c1e3e");
document.addEventListener("backbutton", trapBackButton, false);

  window.open = cordova.InAppBrowser.open;

  fireUpPayments = function(thePaymentUrl){

    var ref = cordova.InAppBrowser.open(thePaymentUrl, '_blank', 'location=yes');
    ref.addEventListener('exit', exitInappBrowser);
  }

  function exitInappBrowser(){
    
      mainView.router.loadPage("dashboard.html");
  }

}


function trapBackButton(){        

            navigator.app.exitApp();
}


// Add main view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
/******** App Initialization *************/


myApp.onPageInit('mainstart', function(page){

    window.setTimeout(function(){

      mainView.router.loadPage("dashboard.html");

    },1000);

});


var loadProperty;
myApp.onPageInit('dashboard', function(page){
// $$(".nylon").show();

   $$("#account-check-in").on("click", function(){

    $$(".nylon").show();


        $$(".nylon").hide();
        mainView.router.loadPage("login.html");
     

  });

     
     $$.post("http://ifitechltd.com/app/pull_properties.php",
        
            function(data, status, xhr){
              $$(".nylon").hide();
              $$("#page-content").html(data);
            }
            ,
            function(){

              myApp.alert("Error occured fetching projects");
          
            });


     loadProperty = function(propID){

          $$.getJSON("http://ifitechltd.com/app/pull_this_property.php",

            {"this_property" : propID},
        
            function(data, status, xhr){
              
                window.localStorage.setItem("thisProperty", JSON.stringify(data));
                mainView.router.loadPage("property.html");
                
            }
            ,
            function(){

              myApp.alert("Error occured fetching projects");
          
            });

     }



    
});



myApp.onPageInit('property', function(page){





    var prop = window.localStorage.getItem("thisProperty");
    prop = JSON.parse(prop);

    var propID = prop.property_id;
    var propName = prop.project_name;
    var propSize = prop.size;
    var propDetails = prop.details;
    var propPrice = prop.price;
    var propIntPrice = prop.int_price;
    var firstImg = prop.first_img;
    var secondImg = prop.second_img;
    var thirdImg = prop.third_img;
    var fourthImg = prop.fourth_img;

    $$("#property-name").text(propName);
    $$("#first-property-img").attr("style", "height: 200px; background-size: cover; background-image: url('http://ifitechltd.com/admin/uploads/" + firstImg + "')");
    $$("#second-property-img").attr("style", "height: 200px; background-size: cover; background-image: url('http://ifitechltd.com/admin/uploads/" + secondImg + "')");
    $$("#third-property-img").attr("style", "height: 200px; background-size: cover; background-image: url('http://ifitechltd.com/admin/uploads/" + thirdImg + "')");
    $$("#fourth-property-img").attr("style", "height: 200px; background-size: cover; background-image: url('http://ifitechltd.com/admin/uploads/" + fourthImg + "')");

    $$(".property-name").text(propName);
    $$("#property-size").text(propSize);
    $$("#property-price").text("NGN" + propPrice);
    $$("#property-details").html(propDetails);


    $$("#buy-property-btn").on("click", function(){

      /*$$(".nylon").show();*/
        myApp.prompt('Enter your email', function (val) {


            var theEmail = val;
            $$.post("http://ifitechltd.com/portal/includes/buy_property.php",

            {
              "buyer_email" :theEmail,
              "buyer_memo" : "Buy Property at Ifitech Limited",
              "buyer_price" : propIntPrice,
              "property_id" : propID

            },
        
            function(data, status, xhr){
              
                
                 if(data == "Please enter your email"){
                                           myApp.alert(data);
                                       }
                                       else{
                                           var splitData = data.split(" ");
                                           var rTnx = splitData[0];
                                           
                                           $$.post("http://ifitechltd.com/portal/includes/paystack_init.php", {
                                               "tnx_reference" : rTnx,
                                               "buyer_email" : theEmail,
                                               "amount_2_pay" : propIntPrice * 100
                                               
                                           }, function(rawData){
                                               
                                               var parsedData = JSON.parse(rawData);
                                                var authUrl = parsedData.data.authorization_url;
                                               fireUpPayments(authUrl);
                                               
                                           },function(){
                                               
                                               myApp.alert("Unable to connect to Paystack");
                                           });
                                                                   
                                        
                                                                   }



                
            }
            ,
            function(){

              myApp.alert("Error occured posting transaction");
          
            });



              
              
        });

    });

});










myApp.onPageInit('signup', function(page){


  $$("#register-user").on('click', function(e){

          $$('form.ajax-submit').trigger('submit');

      });



        $$('form.ajax-submit').on('form:beforesend', function (e) {
            $$(".nylon").show();
        });
        

        $$('form.ajax-submit').on('form:error', function (e) {
            
            $$(".nylon").hide();
            var xcode = e.detail.data;
            myApp.alert("An error has occured, try again later");

          });
              

        $$('form.ajax-submit').on('form:success', function (e) {
            var xhr = e.detail.xhr; // actual XHR object
           
            var data = e.detail.data; // Ajax response from action file
            $$(".nylon").hide();

            var splitData = data.split(" ");            
            if(splitData[0] == "success"){
                
                
                if(splitData[2] == "Consultant"){
                  mainView.router.loadPage("consultant.html");
                }
                else{
                  mainView.router.loadPage("client.html");
                }
                
          }

          else{
            
            $$(".nylon").hide();
            myApp.alert(data);
          }

            

          });
            





});






myApp.onPageInit('login', function(page){



  $$("#login-user").on('click', function(e){

          $$('form.ajax-submit').trigger('submit');

      });



        $$('form.ajax-submit').on('form:beforesend', function (e) {
            $$(".nylon").show();
        });
        

        $$('form.ajax-submit').on('form:error', function (e) {
            
            $$(".nylon").hide();
            var xcode = e.detail.data;
            myApp.alert("An error has occured, try again later");

          });
              

        $$('form.ajax-submit').on('form:success', function (e) {
            var xhr = e.detail.xhr; // actual XHR object
           
            var data = e.detail.data; // Ajax response from action file
            $$(".nylon").hide();

                
                var splitData = data.split(" ");
                
                if(splitData[0] == "success"){

                  window.localStorage.setItem("myCheckIn", splitData[2]);
                  if(splitData[1] == "consultant"){
                    mainView.router.loadPage("consultant.html");
                  }
                  else{
                    mainView.router.loadPage("client.html");
                  }
                }
                else{
                  myApp.alert("Invalid Username / Password");
                }
         
            

          });
            





});






myApp.onPageInit('consultant', function(page){

  $$(".nylon").show();

  var theSerial = window.localStorage.getItem("myCheckIn");


  //Grab fields from the server
  $$.getJSON("http://ifitechltd.com/portal/includes/load_consultant_fields.php",

            {"my_serial" : theSerial},
        
            function(data, status, xhr){
              
               $$("#consultant-title").val(data.title);
               $$("#consultant-surname").val(data.surname);
               $$("#consultant-othernames").val(data.othernames);
               $$("#consultant-phone").val(data.phone);
               $$("#consultant-email").val(data.mail);
               $$("#consultant-occupation").val(data.occupation);
               $$("#consultant-postal-address").val(data.postal_address);
               $$("#consultant-residential-address").val(data.residential_address);
               $$("#consultant-employer-address").val(data.employer_address);


                $$(".nylon").hide();
            }
            ,
            function(){

              myApp.alert("Error occured fetching projects");
          
            });




  
  $$("#consultant-serial").val(theSerial);

  
           

      $$("#update-consultant-form").on('click', function(e){

          $$('form.ajax-submit').trigger('submit');

      });



        $$('form.ajax-submit').on('form:beforesend', function (e) {
            $$(".nylon").show();
        });
        

        $$('form.ajax-submit').on('form:error', function (e) {
            
            $$(".nylon").hide();
            var xcode = e.detail.data;
            myApp.alert("An error has occured, try again later");

          });
              

        $$('form.ajax-submit').on('form:success', function (e) {
            var xhr = e.detail.xhr; // actual XHR object
           
            var data = e.detail.data; // Ajax response from action file
            $$(".nylon").hide();

            
              myApp.alert("Update Successful");

            

          });



        $$("#logout-btn").on("click", function(){

          $$(".nylon").show();
          window.localStorage.removeItem("myCheckIn");
          $$(".nylon").hide();
          mainView.router.loadPage("dashboard.html");

        })
            

});







myApp.onPageInit('client', function(page){

  $$(".nylon").show();

  var theSerial = window.localStorage.getItem("myCheckIn");
  


  //Grab fields from the server
  $$.getJSON("http://ifitechltd.com/portal/includes/load_client_fields.php",

            {"my_serial" : theSerial},
        
            function(data, status, xhr){
              
               $$("#client-fullname").val(data.full_name);
               $$("#client-contact-person").val(data.contact_person);
               $$("#client-client-phone").val(data.othernames);
               $$("#client-phone").val(data.phone);
               $$("#client-email").val(data.email);
               $$("#client-occupation").val(data.occupation);
               $$("#client-mailing-address").val(data.mailing_address);
               $$("#client-current-employer").val(data.current_employer);
               $$("#client-employer-mailing-address").val(data.employer_mailing_address);
               $$("#client-nationality").val(data.nationality);


                $$(".nylon").hide();
            }
            ,
            function(){

              myApp.alert("Error occured fetching projects");
          
            });




  
  $$("#client-serial").val(theSerial);

  
           

      $$("#update-client-form").on('click', function(e){

          $$('form.ajax-submit').trigger('submit');

      });



        $$('form.ajax-submit').on('form:beforesend', function (e) {
            $$(".nylon").show();
        });
        

        $$('form.ajax-submit').on('form:error', function (e) {
            
            $$(".nylon").hide();
            var xcode = e.detail.data;
            myApp.alert("An error has occured, try again later");

          });
              

        $$('form.ajax-submit').on('form:success', function (e) {
            var xhr = e.detail.xhr; // actual XHR object
           
            var data = e.detail.data; // Ajax response from action file
            $$(".nylon").hide();

            
              myApp.alert("Update Successful");

            

          });



        $$("#logout-btn").on("click", function(){

          $$(".nylon").show();
          window.localStorage.removeItem("myCheckIn");
          $$(".nylon").hide();
          mainView.router.loadPage("dashboard.html");

        })
            

});
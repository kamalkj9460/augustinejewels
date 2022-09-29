var StoresApp = StoresApp || {};
var locale = StoresApp.locale || "en";
StoresApp.markers = [];
StoresApp.cartFormSelector = 'form[action*="cart"][method="post"]:visible';
StoresApp.appUrl 	= 'https://app.globosoftware.net/stores';
StoresApp.CDNUrl 	= 'https://app2-czlirk8m8k.stackpathdns.com/stores';
StoresApp.searchUrl = StoresApp.appUrl+'/search?shop='+StoresApp.shopUrl;
var zoomLv = StoresApp.zoomLevel;
loadScript = function(url, callback, errcallback){
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  if (script.readyState){
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" || script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
    setTimeout(function(){
      if(script.onreadystatechange !== null){
        if(errcallback !== undefined) errcallback();
      }
    },3000);
  } else {
    script.onload = function(){
      callback();
    };
    script.onerror = function(){
      if(errcallback !== undefined) errcallback();
    }
  }

  document.getElementsByTagName("head")[0].appendChild(script);
},

  StoresApp.init = function($){
  window.spuritJQ = $;
  // Check install
    var installed = false;
    $("script").each(function() {
         if ($(this).text().indexOf("globostores_init.js?") != -1 && $(this).text().indexOf("asyncLoad") != -1 && $(this).text().indexOf("initSchema") == -1) {
             installed = true;
         }
    });
    if(!installed) {return false;}
  loadScript(StoresApp.CDNUrl+'/assets/js/plugins.js', function(){
        loadScript(StoresApp.CDNUrl+'/assets/js/bootstrap-multiselect.js', function(){

    $(document).ready(function(){
        // Find Cart
        $('body').on('click','a[href="/cart"]',function() {
            setTimeout(function(){
                var classCheckout = $('#ajaxifyCart').find('#checkout').attr('class');
                var html = '<a href="/cart" class="'+classCheckout+'">Cart</a>';
                var cartSelector = $('#ajaxifyCart').find('a[href="/cart"]');
                if(!cartSelector.length){
                    var parentCheckoutBtn = $('#ajaxifyCart').find('#checkout').parent().append(html);
                    $('#ajaxifyCart').find('#checkout').remove();
                }
            }, 1500);
        })
        $('body').on('mouseenter','form[action*="/cart"] input[type="text"], form[action*="/cart"] input[type="number"]',function(e) {
          	$(this).closest('form').prop('action','/cart');
        });
    if(typeof masonry !== 'undefined'){
        $('.store-wrapper').masonry({
          // options...
          itemSelector: '.g-md-1-3',
          columnWidth: 200
        });
    }

        $(StoresApp.cartFormSelector).prop('action','/cart?step=contact_information&checkout[shipping_address][company]=&checkout[shipping_address][address1]=&checkout[shipping_address][address2]=&checkout[shipping_address][city]=&checkout[shipping_address][country]=&checkout[shipping_address][zip]=&checkout[shipping_address][province]=&locale='+locale);
            var settings = JSON.parse(StoresApp.settings);
            var check_quantity = false;
            var check_subtotal = false;
            var pass = false;
            var res = true;
            if(settings&&(settings.quantity!==null&&settings.subtotal!==null)){
                if(StoresApp.item_count>settings.quantity.greater||StoresApp.item_count<settings.quantity.less)
                    check_quantity = true;
                if(StoresApp.total_price>settings.subtotal.greater||StoresApp.total_price<settings.subtotal.less)
                    check_subtotal = true;

                if(settings.operator=="AND"){
                    if(check_quantity&&check_subtotal){
                        pass = true;
                    }
                }else if(settings.operator=="OR"){
                    if(check_quantity||check_subtotal){
                        pass = true;
                    }
                }
            }else {
                pass=true;
            }

            if(pass){
                if(settings.quantity.greater==null&&settings.quantity.less==null&&settings.subtotal.greater==null&&settings.subtotal.less==null)
                    res = true;
                else {
                    if(settings.enable_pickup=="0"){
                        res = false;
                    }else if(settings.enable_pickup=="1") {
                        res = true;
                    }
                }



            }

            if(res){
                if($( StoresApp.cartFormSelector ).length > 0){
                    StoresApp.downloadUrl(StoresApp.appUrl+'/pickup?shop='+StoresApp.shopUrl, function(data) {
                        var checkout_btn = $( StoresApp.cartFormSelector).first().addClass('globo-stores-form').find('button[name="checkout"]:visible, input[name="checkout"]:visible');
                        if(checkout_btn.length > 0){
                          if(StoresApp.shopUrl == 'knot-rope-supply.myshopify.com'){
                            	var checkout_group = $(checkout_btn).closest('.cart-checkout')
                              $(StoresApp.cartFormSelector).append(data.HTML);
                              jQuery(checkout_group).appendTo(StoresApp.cartFormSelector);

                          }else{
                          	var checkout_btn_html = checkout_btn[0].outerHTML;
                              $(checkout_btn).hide();
                              $(StoresApp.cartFormSelector).append(data.HTML);
                              $(StoresApp.cartFormSelector).append(checkout_btn_html);
                          }

                        }else{
                        $( StoresApp.cartFormSelector ).append(data.HTML);
                      }
                      $('.attributes-checkout-method').change(function(){
                        $('.shipping-method, .method-content').removeClass('active');
                        $(this).closest('li').addClass('active');
                        // Remove require attr
                        if($(this).val()=="Shipping"){
                          $('#stores-container').find('input.PUS_ID').prop('required',false);
                        }else {
                        	$('#stores-container').find('input.PUS_ID').prop('required',true);
                        }
                        $($(this).attr('data-toggle')).addClass('active');
                        // Change action
                        $(StoresApp.cartFormSelector).prop('action','/cart?step=contact_information&checkout[shipping_address][company]=&checkout[shipping_address][address1]=&checkout[shipping_address][address2]=&checkout[shipping_address][city]=&checkout[shipping_address][country]=&checkout[shipping_address][zip]=&checkout[shipping_address][province]=&locale='+locale);
                      });
                      StoresApp.initMap();
                    });
                  }else{
                    StoresApp.initMap();
                  }



            }




    });

    $(document).mouseup(function(e)
    {
        var container = $("button.dropdown-toggle.btn");

        // if the target of the click isn't the container nor a descendant of the container
        // if (!container.is(e.target) && container.has(e.target).length === 0)
        // {
        //         container.siblings('ul.multiselect-container').hide();
        // }

        var ul_container = container.siblings('ul.multiselect-container');
        if (!ul_container.is(e.target) && ul_container.has(e.target).length === 0)
        {
                ul_container.hide();
        }
    });

    // Onsubmit
    $(StoresApp.cartFormSelector).on('submit',function(e){
        var is_pickup=$('#attributes-checkout-method-pickup')[0].checked;
      	if(!$('#attributes-checkout-method-shipping')||$('#attributes-checkout-method-shipping').length==0) is_pickup = true;
        var picked = false;

        $.each($('[name="PUS_ID"]'),function(key,item){
            if(item.checked) picked=true;
        });
        var timed = $("#datetime").val();
        $("#map-container").find('small.error').remove();
        if(is_pickup&&(!picked||timed=="")){
            if(!picked){
                $("#stores-list-table").addClass('error');
                $("#stores-list-table").after('<small class="error" style="margin-top:-15px;">Please pickup a store</small>');
                e.preventDefault();
            }
            if(!timed&& !$("#date-time-picker").hasClass("hidden")){
                $("#datetime").addClass('error');
                $("#date-time-picker").append('<small class="error">Please pick a time</small>');
                e.preventDefault();
            }

        }
        // When back to top and changing quantity
      	var action_ = $(StoresApp.cartFormSelector).attr('action');
      	var checkout_checked = $("input[name='attributes[Shipping Method]']:checked").val();
        if(checkout_checked=="Store Pickup"&&action_!="/cart"){
            $('#stores-table').find('input[name="PUS_ID"]:checked').click();
        }

    });



});
});



},


StoresApp.CheckCondition = function(){

},


  StoresApp.initMap = function(){

      $('[data-allow-pickup="0"]').addClass('hidden');




  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(StoresApp.defaultLat, StoresApp.defaultLong),
    zoom: parseInt(zoomLv),
    styles:JSON.parse(StoresApp.shopGoogleMapStyle),
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
  });
  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': pos}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            //$('#addressInput').val(results[0].formatted_address);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }



  $('#addressInput').keypress(function(e) {
    code = e.keyCode ? e.keyCode : e.which;
    if(code.toString() == 13)
      StoresApp.searchLocations();
  });

  $(document).on('click', '#getLocation', function(e){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': pos}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              $('#addressInput').val(results[0].formatted_address);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });

        StoresApp.createCustomMarker(map,pos);
        map.setCenter(pos);


      }, function() {handleLocationError(true, infoWindow, map.getCenter())});
    } else {handleLocationError(false, infoWindow, map.getCenter())}
  });
  var array_TimeOpen = {};
  var arr_timeOp = [];
  $(document).on('click', '.stores-list-container', function(e){
      if($(this).attr('data-allow-pickup')=="0") {
          return false;
      }

    $(this).addClass('active').siblings().removeClass('active');
    markerNum = $(this).attr("data-markerid");
    google.maps.event.trigger(StoresApp.markers[markerNum], 'click');
    $(this).find('input[type=radio]').prop('checked', true);
    // Render DateTime
    var ele = $(this);
    StoresApp.DateTimePicker(ele);

    // Update input
    var infoSelector = $('ul#stores-table li.stores-list-container.active input[type="radio"]:nth-child(1)').closest('.location-form-inputs');
        var store_id = infoSelector.find('input.PUS_ID').val();
       var store_name = infoSelector.find('input.PUS_Name').val();
       var store_address = infoSelector.find('input.PUS_Address').val();
       var store_city = infoSelector.find('input.PUS_City').val();
       var store_state = infoSelector.find('input.PUS_State').val();
       var store_postalcode = infoSelector.find('input.PUS_PostalCode').val();
       var store_country = infoSelector.find('input.PUS_Country').val();

       $("#dataPickup").find('[name="attributes[Checkout-Method]"]').val('pickup');
       $("#dataPickup").find('[name="attributes[Pickup-Location-Id]"]').val(store_id);
       $("#dataPickup").find('[name="attributes[Pickup-Location-Company]"]').val(store_name);
       $("#dataPickup").find('[name="attributes[Pickup-Location-Address-Line-1]"]').val(store_address);
       $("#dataPickup").find('[name="attributes[Pickup-Location-City]"]').val(store_city);
       $("#dataPickup").find('[name="attributes[Pickup-Location-State]"]').val(store_state);
       $("#dataPickup").find('[name="attributes[Pickup-Location-PostalCode]"]').val(store_postalcode);
       $("#dataPickup").find('[name="attributes[Pickup-Location-Country]"]').val(store_country);


       var action = '/cart?step=contact_information&method=shipping&checkout[shipping_address][company]='+store_name+'&checkout[shipping_address][address1]='+store_address+'&checkout[shipping_address][address2]=&checkout[shipping_address][city]='+store_city+'&checkout[shipping_address][country]='+store_country+'&checkout[shipping_address][zip]='+store_postalcode+'&checkout[shipping_address][province]='+store_state+'&locale='+locale+'-SCASP';
       $(StoresApp.cartFormSelector).attr('action',action);

  });












  $(document).on('click', 'button[name=search_locations]', function(e){
    e.preventDefault();
    StoresApp.searchLocations();
  });





  StoresApp.initMarkers();
  $('#example-getting-started').multiselect();
    // Tag Dropdown
    $('body').on('click','button.dropdown-toggle.btn',function(){
        $(this).siblings('ul.multiselect-container').toggle();
    });
    var num_tags = $('.tag-option').length;
    if(num_tags==0){
        $('ul.multiselect-container').css('border','none').css('padding',0);
    }
    $('.filter-select button.multiselect.btn').text($('#example-getting-started').attr('data-title'));

    },

StoresApp.initDateTimePicker = function(openning_hours_json) {
    // Initial datepicker
          var datepicker = $('#date').pickadate({
          container: '#outlet',
          formatSubmit: 'yyyy/mm/dd',
          onSet: function(item) {
              if ( 'select' in item ) setTimeout( timepicker.open, 0 )
              // Disable
              if(datepicker.get('select')){
                  var h_from = StoresApp.convertTo24Hour(array_TimeOpen[datepicker.get('select').day].from);
                  var h_to = StoresApp.convertTo24Hour(array_TimeOpen[datepicker.get('select').day].to);
                  arr_timeOp = StoresApp.ConvertTimeToFormat(h_from,h_to);

              } else {
                  return false;
              }
        }
        }).pickadate('picker');
        // Get Current Date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        today = mm + '/' + dd + '/' + yyyy;
  		if(StoresApp.shopUrl=='alishascupcakes.myshopify.com')
          today = mm + '/' + (parseInt(dd)+2) + '/' + yyyy;
        datepicker.set('min', new Date(today));
        var timepicker = $('#time').pickatime({
          container: '#outlet',
          formatSubmit: 'h:i a',
          onOpen: function(){
              if(datepicker.get('select')){
                  timepicker.set('disable', false);
                  timepicker.set('disable', [{ from: [0,00], to: [23,30] }]);
                  timepicker.set('enable', [
                      {
                          from: [arr_timeOp["from"][0],arr_timeOp["from"][1]],
                          to: [arr_timeOp["to"][0],arr_timeOp["to"][1]]
                      }
                  ]);
                  var td= new Date(today);
                  var cd = new Date(datepicker.get());
                  if(cd.getTime()===td.getTime()){
                    timepicker.set('min',true);
                  } else {
                    timepicker.set('min',false);
                  }
              }
          },
          onStart: function(){
          },
          onRender: function(){
          },
          onSet: function(item) {

            if ( 'select' in item ) setTimeout( function() {
              $datetime.off('focus').val( datepicker.get() + ' ' + timepicker.get() ).focus().on('focus', datepicker.open);
           var infoSelector = $('ul#stores-table li.stores-list-container.active input[type="radio"]:nth-child(1)').closest('.location-form-inputs');
               var store_id = infoSelector.find('input.PUS_ID').val();
              var store_name = infoSelector.find('input.PUS_Name').val();
              var store_address = infoSelector.find('input.PUS_Address').val();
              var store_city = infoSelector.find('input.PUS_City').val();
              var store_state = infoSelector.find('input.PUS_State').val();
              var store_postalcode = infoSelector.find('input.PUS_PostalCode').val();
              var store_country = infoSelector.find('input.PUS_Country').val();

              $("#dataPickup").find('[name="attributes[Checkout-Method]"]').val('pickup');
              $("#dataPickup").find('[name="attributes[Pickup-Location-Id]"]').val(store_id);
              $("#dataPickup").find('[name="attributes[Pickup-Location-Company]"]').val(store_name);
              $("#dataPickup").find('[name="attributes[Pickup-Location-Address-Line-1]"]').val(store_address);
              $("#dataPickup").find('[name="attributes[Pickup-Location-City]"]').val(store_city);
              $("#dataPickup").find('[name="attributes[Pickup-Location-State]"]').val(store_state);
              $("#dataPickup").find('[name="attributes[Pickup-Location-PostalCode]"]').val(store_postalcode);
              $("#dataPickup").find('[name="attributes[Pickup-Location-Country]"]').val(store_country);
              $("#dataPickup").find('[name="attributes[Pickup-Date]"]').val(datepicker.get('select','yyyy/mm/dd'));
              $("#dataPickup").find('[name="attributes[Pickup-Time]"]').val(timepicker.get());


              var action = '/cart?step=contact_information&method=shipping&checkout[shipping_address][company]='+store_name+'&checkout[shipping_address][address1]='+store_address+'&checkout[shipping_address][address2]=&checkout[shipping_address][city]='+store_city+'&checkout[shipping_address][country]='+store_country+'&checkout[shipping_address][zip]='+store_postalcode+'&checkout[shipping_address][province]='+store_state+'&locale='+locale+'-SCASP';
              $(StoresApp.cartFormSelector).attr('action',action);
            }, 0 )
          }
        }).pickatime('picker');
        //timepicker.set('min',true);
        var $datetime = $('#datetime').on('focus', datepicker.open).on('click', function(event) { event.stopPropagation(); datepicker.open() });



    var DOW_Monday = -1;
    var DOW_Tuesday = -1;
    var DOW_Wednesday = -1;
    var DOW_Thusday = -1;
    var DOW_Friday = -1;
    var DOW_Saturday = -1;
    var DOW_Sunday = -1;
    var array_DayOfWeek_Disable = [1,2,3,4,5,6,7];
    array_TimeOpen = {
        0:  {
            'from'  :'0',
            'to'    :'0'
            }
        ,
        1:  {
            'from'  :'0',
            'to'    :'0'
            }
        ,
        2: {
            'from'  :'0',
            'to'    :'0'
            }
        ,
        3: {
            'from'  :'0',
            'to'    :'0'
            }
        ,
        4: {
            'from'  :'0',
            'to'    :'0'
            }
        ,
        5: {
            'from'  :'0',
            'to'    :'0'
            }
        ,
        6: {
            'from'  :'0',
            'to'    :'0'
            }


    };
    datepicker.set('enable', array_DayOfWeek_Disable)
    timepicker.set('enable', true)
    if(openning_hours_json!=""){
        $.each(JSON.parse(openning_hours_json),function(k,item){
            if(item.status==1&&k=="sunday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 1 })
                array_TimeOpen['0']['from'] = item.from;
                array_TimeOpen['0']['to'] = item.to;
            }
            if(item.status==1&&k=="monday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 2 })
                array_TimeOpen['1']['from'] = item.from;
                array_TimeOpen['1']['to'] = item.to;
            }
            if(item.status==1&&k=="tuesday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 3 })
                array_TimeOpen['2']['from'] = item.from;
                array_TimeOpen['2']['to'] = item.to;
            }
            if(item.status==1&&k=="wednesday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 4 })
                array_TimeOpen['3']['from'] = item.from;
                array_TimeOpen['3']['to'] = item.to;
            }
            if(item.status==1&&k=="thursday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 5 })
                array_TimeOpen['4']['from'] = item.from;
                array_TimeOpen['4']['to'] = item.to;
            }
            if(item.status==1&&k=="friday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 6 })
                array_TimeOpen['5']['from'] = item.from;
                array_TimeOpen['5']['to'] = item.to;
            }
            if(item.status==1&&k=="saturday") {
                array_DayOfWeek_Disable = array_DayOfWeek_Disable.filter(function(item) { return item !== 7 })
                array_TimeOpen['6']['from'] = item.from;
                array_TimeOpen['6']['to'] = item.to;
            }
        });
    }
    datepicker.set('disable', array_DayOfWeek_Disable)




    },
  StoresApp.getPageType = function(){
  var url = window.location.toString();
  if(url.match(/\/cart/) !== null){
    return 'cart';
  }else if(url.match(/\/apps\/stores/) !== null){
    return 'stores';
  }else{
    return '';
  }
},

  StoresApp.initMarkers = function(){


  var downloadUrl = StoresApp.searchUrl;
  if(StoresApp.isCartPage)
    var downloadUrl = StoresApp.searchUrl+'&pickup=true';

  StoresApp.downloadUrl(downloadUrl, function(data) {
    var xml = StoresApp.parseXml(data.map_info.trim());
    var markerNodes = xml.documentElement.getElementsByTagName('marker');
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markerNodes.length; i++){
      var name = markerNodes[i].getAttribute('name');
      var listHTML = markerNodes[i].getAttribute('details_short');
      var id_store = markerNodes[i].getAttribute('id_store');
      var latlng = new google.maps.LatLng(parseFloat(markerNodes[i].getAttribute('lat')), parseFloat(markerNodes[i].getAttribute('lng')));
      var icon_store = markerNodes[i].getAttribute('icon');
      StoresApp.createMarker(latlng, name, id_store,icon_store);
      bounds.extend(latlng);
    }
    $('#stores-table').html(data.listHTML);
    // var monkeyList = new List('store-locator', {
    //     valueNames: ['store-name']
    // });
    if (!!$.prototype.fancybox)
      $('.more-info').fancybox();

    map.fitBounds(bounds);
    var zoomOverride = map.getZoom();
    if(zoomOverride > 10)
      zoomOverride = 10;
    map.setZoom(zoomOverride);
  });
},
StoresApp.DateTimePicker = function(ele) {
    if($(ele).attr('data-allow-date-picker')=="0") {
        $("#date-time-picker").addClass('hidden');
        return false;
    }else {
        $("#date-time-picker").removeClass('hidden');
    }

    var json_PUS_Opening = $(ele).find('input.PUS_Opening').val()
    if (typeof pickadate === "function"&&typeof pickatime === "function") {
        StoresApp.initDateTimePicker(json_PUS_Opening);
    }else {
        loadScript('https://app.globosoftware.net/stores/assets/js/plugin-pickadate.js', function(){
            StoresApp.initDateTimePicker(json_PUS_Opening);
        });
    }
}



  StoresApp.searchLocations = function(){
  // var address = document.getElementById('addressInput').value;
  // var geocoder = new google.maps.Geocoder();
  // geocoder.geocode({address: address}, function(results, status) {
  //   console.log("Before If");
  //   //if (status === google.maps.GeocoderStatus.OK)
  //   if(true)
  //   {
  //       StoresApp.searchLocationsNear(results[0].geometry.location);
  //       console.log('inside If ');
  //       console.log(results[0].geometry.location);
  //   }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': pos}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            StoresApp.searchLocationsNear(results[0].geometry.location);
          }
        }
      });
    });
  }




    // else
    // {
    //   if (!!$.prototype.fancybox && isCleanHtml(address))
    //     $.fancybox.open([
    //       {
    //         type: 'inline',
    //         autoScale: true,
    //         minHeight: 30,
    //         content: '<p class="fancybox-error">' + address + ' ' + translation_6 + '</p>'
    //       }
    //     ], {
    //       padding: 0
    //     });
    //   else
    //     alert(address + ' ' + translation_6);
    // }
},

  StoresApp.clearLocations = function(n){
  infoWindow.close();
  for (var i = 0; i < StoresApp.markers.length; i++)
    StoresApp.markers[i].setMap(null);

  StoresApp.markers.length = 0;
  $('#stores-table').html('');
},

  StoresApp.searchLocationsNear = function(center){

  ajaxsearchUrl = StoresApp.searchUrl+'&latitude=' + center.lat() + '&longitude=' + center.lng() + '&distance=' + document.getElementById('radiusSelect').value+'&title='+encodeURI(document.getElementById('addressInput').value)+'&group='+document.getElementById('groupSelect').value+'&tags='+encodeURI(StoresApp.getSelectValues(document.getElementById('example-getting-started')));

  if(StoresApp.isCartPage)
    var ajaxsearchUrl = ajaxsearchUrl+'&pickup=true';


  StoresApp.downloadUrl(ajaxsearchUrl, function(data) {
    var xml = StoresApp.parseXml(data.map_info.trim());
    var markerNodes = xml.documentElement.getElementsByTagName('marker');
    var bounds = new google.maps.LatLngBounds();

    StoresApp.clearLocations(markerNodes.length);
    $('#stores-table').html(data.listHTML);
    // var monkeyList = new List('store-locator', {
    //     valueNames: ['store-name']
    // });
    for (var i = 0; i < markerNodes.length; i++)
    {
      var name = markerNodes[i].getAttribute('name');
      var icon_store = markerNodes[i].getAttribute('icon');

      var distance = parseFloat(markerNodes[i].getAttribute('distance'));
      var id_store = parseFloat(markerNodes[i].getAttribute('id_store'));

      var latlng = new google.maps.LatLng(parseFloat(markerNodes[i].getAttribute('lat')), parseFloat(markerNodes[i].getAttribute('lng')));

      StoresApp.createMarker(latlng, name, id_store,icon_store);
      bounds.extend(latlng);

    }
    if (!!$.prototype.fancybox)
      $('.more-info').fancybox();

    if (markerNodes.length)
    {
      map.fitBounds(bounds);
      var listener = google.maps.event.addListener(map, "idle", function() {
        if (map.getZoom() > 13) map.setZoom(13);
        google.maps.event.removeListener(listener);
      });
    }

  });
},

  StoresApp.createMarker = function(latlng, name, id_store,url_icon){
      if(url_icon === undefined || url_icon === null||url_icon=="") url_icon = StoresApp.defaultIcon;
      //else url_icon = url_icon;
  var image = new google.maps.MarkerImage(url_icon);
  var marker = '';

  if (StoresApp.hasStoreIcon)
    marker = new google.maps.Marker({ map: map, icon: image, position: latlng });
  else
    marker = new google.maps.Marker({ map: map, position: latlng });

  google.maps.event.addListener(marker, 'click', function() {
    map.setCenter(latlng);
    map.setZoom(parseInt(zoomLv));
    $('input[value="'+id_store+'"]').parent().children('input[type="radio"]').attr('checked',true);
    $('input[value="'+id_store+'"]').closest('.stores-list-container').addClass('active');
    var ele = $('input[value="'+id_store+'"]').closest('.stores-list-container');
    StoresApp.DateTimePicker(ele);
  });
  StoresApp.markers.push(marker);


},
StoresApp.getSelectValues = function(select){
    if(select&&select.length){
            var result = [];
          var options = select && select.options;
          var opt;

          for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
              result.push(opt.value || opt.text);
            }
          }
          return result.toString();
    }
    else
        return '';

},
// Anh EZ
StoresApp.createCustomMarker = function(map, location){
var marker = new google.maps.Marker({
        position: location,
        label:"A",
        map: map
      });
    google.maps.event.addListener(marker, 'click', function() {
      map.setCenter(location);
      map.setZoom(parseInt(zoomLv));
    });
    StoresApp.markers.push(marker);
},
StoresApp.ConvertTimeToFormat = function(from,to){
        const regex = /\d+/g;
        let m;
        var arr_t_from = [];
        var arr_t_to = [];
        while ((m = regex.exec(from)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            arr_t_from.push(m[0]);

        }
        while ((m = regex.exec(to)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            if(!m[0]) m[0] = 0;
            arr_t_to.push(m[0]);

        }
        var res = [];
        res['from'] = arr_t_from;
        res['to'] = arr_t_to;
        return res;

},
StoresApp.convertTo24Hour = function(time) {
    var hours = parseInt(time.substr(0, 2));
    if(time.indexOf('AM') != -1 && hours == 12) {
        time = time.replace('12', '00');
    }
    if(time.indexOf('PM')  != -1 && hours < 12) {
        time = time.replace(time.substr(0, 2), (hours + 12));
    }
    return time.replace(/(AM|PM)/, '');
},

  StoresApp.downloadUrl = function(url, callback){
  $.ajax({
    url: url,
    dataType: 'jsonp',
    type: "get",
    success: function(result){
      if(result.success == true){
        callback(result);
      }
    }
  });
},

  StoresApp.parseXml = function(str){
  if (window.ActiveXObject)
  {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  }
  else if (window.DOMParser)
    return (new DOMParser()).parseFromString(str, 'text/xml');
};


try{
  if ( typeof jQuery === 'undefined' || (jQuery.fn.jquery.split(".")[0] < 2 && jQuery.fn.jquery.split(".")[1] < 7)) {
    var doNoConflict = true;
    if (typeof jQuery === 'undefined') {doNoConflict = false;}
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js', function(){
      if (doNoConflict) {
        jQuery17 = jQuery.noConflict(true);
      } else {
        jQuery17 = jQuery;
      }
      StoresApp.init(jQuery17);
    });
  } else {
    StoresApp.init(jQuery);
  }
}catch (e){ console.log('Menu app exception: ' + e)}

//window.onload = function() {
    document.querySelector('.map').style.display=('none'); /**,pu dimiourgouse problhma epeidh den to ebriske */
//};


var btns_map =document.querySelectorAll(".button-map");

for(let i=0;i<btns_map.length; i++){
    btns_map[i].addEventListener('click',function(e){
        e.preventDefault();
    });
}

function getLanLon(){
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE){
            const obj = JSON.parse(xhr.responseText);
            var btn;
            var btn_img;
            var btn_label;
            btn=document.querySelector(".check-answer");
            btn_img=document.querySelector(".check-answer .image");
            btn_label=document.querySelector(".check-answer .button-label");
            address_change = getAddress();
            btn.style.display="flex";
            document.querySelector(".check-address").style.display="none";
            if(obj[0]!= undefined && document.querySelector(".add-name-num .add-name").value !=""){
                var lat=obj[0].lat;
                var lon=obj[0].lon;
                var latlon = lat + " " +lon;
                setLat(lat);
                setLon(lon);
                
                var Crete=obj[0].display_name;
                if(Crete.includes("Crete")){
                    address_checker=1;
                    btn_label.innerText="Address Verified";
                    btn_label.style.color="white";
                    btn.style.border="none"
                    btn_label.style.margin="0 auto";
                    btn_img.src="img/check.png";
                    btn.style.background="green";
                    My_Map(1);
                }else{
                    address_checker=2;
                    btn_label.innerText="Service available only in Crete";
                    btn_label.style.margin="0";
                    btn_label.style.color="white";
                    btn.style.border="none"
                    btn_img.src="img/remove.png";
                    btn.style.background="red";
                    My_Map(0);
                }
                return latlon;
            }else if(document.querySelector(".add-name-num .add-name").value ==""){
                btn_label.innerText="Address name is empty";
                btn_img.src="img/remove.png";
                btn_label.style.margin="0 auto";
                btn_label.style.color="white";
                btn.style.background="red";
                btn.style.border="none";
                address_checker=0;
                My_Map(0);
            }
            else{
                address_checker=0;
                btn_label.innerText="Address doesn't exist";
                btn_label.style.margin="0 auto";
                btn_img.src="img/remove.png";
                btn_label.style.color="white";
                btn.style.background="red";
                btn.style.border="none"
                My_Map(0);
            }
            

        }
    });
    
    let address = getAddress();
    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q="+address+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    var key="2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
    xhr.setRequestHeader("x-rapidapi-key", key);
    xhr.send();
    
    
}

function getAddress(){
    let addressName=document.querySelector(".add-name-num .add-name").value;
    let number=document.querySelector(".add-name-num .add-num").value;
    let city=document.querySelector("#city").value;
    let country=document.querySelector("#country").value;
    let address=addressName+" "+number+" " +city+" "+country; 
    return address;
}

var address_change="none";
var address_checker="";
function checkAddress(){
    btn=document.querySelector(".check-address");
    btn_ans=document.querySelector(".check-answer");
    btn_ans_img=document.querySelector(".check-answer .image");
    btn_ans_label=document.querySelector(".check-answer .button-label");
    if(address_change != getAddress()){
       btn.style.display="flex";
       btn_ans.style.display="none";
       btn.style.background="white";
       
       btn.style.border="2px solid green";
       btn.style.color="black";
       My_Map(0);
    }else{
        btn.style.display="none";
        btn_ans.style.display="flex";
        if(address_checker===1){
            btn_ans_label.innerText="Address Verified";
            btn_ans_label.style.color="white";
            btn_ans_label.style.margin="0 auto";
            btn_ans.style.border="none";
            btn_ans_img.src="img/check.png";
            btn_ans.style.background="green";
            My_Map(1);
        }else if(address_checker===2){
            btn_ans_label.innerText="Service available only in Crete";
            btn_ans_label.style.margin="0";
            btn_ans_label.style.color="white";
            btn_ans.style.border="none"
            btn_ans_img.src="img/remove.png";
            btn_ans.style.background="red";
            My_Map(0);
        }else{
            btn_ans_label.style.margin="0 auto";
            btn_ans_img.src="img/remove.png";
            btn_ans_label.style.color="white";
            btn_ans.style.background="red";
            btn_ans.style.border="none";
            My_Map(0);
        }
       
    }
}
var lat=0.00,lon=0.00;
function setLat(lat){
    this.lat=lat;
}
function setLon(lon){
    this.lon=lon;
}
function getLat(){
    return lat;
}
function getLon(){
    return lon;
}



 //Orismos Marker
var map = new OpenLayers.Map("map"); //create the map
var mapnik         = new OpenLayers.Layer.OSM("OpenCycleMap",
 ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
 "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
 "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]); //pws moiazei to map
map.addLayer(mapnik);
var mar;
var markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);

  //Metatroph apo EPSG:4326 se EPSG:900913
function setPosition(lat, lon){
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
    return position;
}

function My_Map(show){
    //Metatroph apo EPSG:4326 se EPSG:900913
    if( show === 1){
        document.querySelector('.map').style.display=('block');
        //Marker	
        var position=setPosition(getLat(),getLon());
        if(mar===undefined){
            mar=new OpenLayers.Marker(position);
        }else{
            markers.removeMarker(mar);
            mar=new OpenLayers.Marker(position);
        }
        markers.addMarker(mar);
        //Orismos zoom	
        const zoom = 18;
        
        map.setCenter(position, zoom);
    }else{
        document.querySelector('.map').style.display=('none');
    }
}



function get_Curr_Location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.querySelector(".current-location .button-label").innerText = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);
    
    let lat = getLat(); 
    let lon = getLon();
    lat = Number(lat.toString().slice(0, -1));/*an den diagrapsw to teleutaio den m ebgaze apotelesma */
    lon = Number(lon.toString().slice(0, -1));
    let addressName=document.querySelector(".add-name-num .add-name");
    let number=document.querySelector(".add-name-num .add-num");
    let city=document.querySelector("#city");
    let country=document.querySelector("#country");
    btn_label=document.querySelector(".current-location .button-label");
    console.log(getLat()+" "+ getLon());
    console.log(lon + " " + lat);
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            if(this.responseText.includes('<?xml version="1.0" encoding="UTF-8" ?>')) {/**mou ta petouse ta data se ena diaforetiko style keimeno */
                btn_label.innerText="Cant find location";
                return 0;
            }
            const obj = JSON.parse(this.responseText);
            if(obj.address!=undefined){
                if(obj.address.house_number!=undefined){
                    number.value=obj.address.house_number;
                }
                if(obj.address.road!=undefined){
                    addressName.value=obj.address.road;
                }
                if(obj.address.city!=undefined){
                    city.value=obj.address.city;
                }
                if(obj.address.country!=undefined){
                    country.value=obj.address.country;
                }
            }else{
                btn_label.innerText="Cant find location";
            }
        }
    });
    
    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat="+lat+"&lon="+lon+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    var key="2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
    xhr.setRequestHeader("x-rapidapi-key", key);
    xhr.send();
   

}




/**
 * $('.check-address').hover(
            function(){
              $(this).css('background', 'rgb(169, 255, 188,0.8)');
        },
        function(){
          $(this).css('background', 'white');
        });

 */



         //Orismos Handler
/**function handler(position, message){
     var popup = new OpenLayers.Popup.FramedCloud("Popup", 
         position, null,
         message, null,
         true // <-- true if we want a close (X) button, false otherwise
     );
     map.addPopup(popup);
     var div = document.getElementById('divID');
     div.innerHTML += 'Energopoitihike o Handler<br>';
 
 }

 ---------------
 mar2.events.register('mousedown', mar2, function(evt) { 
	handler(position2,'Ano Assites: xwrio mike')}); ******an theloume na exei minma
 */



    /** mia idea gia o pws tha mporousa na mou dinei autos kathe fora to div p einai o pinakas
var new_map;
function getNew_Map(map){
    new_map= map;
}
function setNew_Map(){
    return new_map;
}
function test(){
    getNew_Map(document.getElementById('map1').id);
    console.log("'"+setNew_Map()+"'");
    var map = new OpenLayers.Map("'"+setNew_Map()+"'"); //create the map
    var mapnik         = new OpenLayers.Layer.OSM("OpenCycleMap",
    ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
    "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
    "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]); //pws moiazei to map
    map.addLayer(mapnik);
    var mar;
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    var position=setPosition(getLat(),getLon());
        if(mar===undefined){
            mar=new OpenLayers.Marker(position);
        }else{
            markers.removeMarker(mar);
            mar=new OpenLayers.Marker(position);
        }
        markers.addMarker(mar);
        //Orismos zoom	
        const zoom = 18;
        
        map.setCenter(position, zoom);
}
 */
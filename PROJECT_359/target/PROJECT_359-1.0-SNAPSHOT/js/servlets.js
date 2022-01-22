function sendAjaxPOST(){

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if(xhr.responseText.includes("SimpleUser")){
                document.querySelector('.user-already-exist').innerText="Registered. You can log in now."
            }else{
                document.querySelector('.user-already-exist').innerText="Registered. You can log in now.But you must be certified by admin";
            }
        } else if (xhr.status === 403) {
            document.querySelector('.user-already-exist').innerText= xhr.responseText + " already exists.";
        }else {
            
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $('#register-form').serialize();
    xhr.open('POST', 'SignIn');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data+"&lon="+getLon()+"&lat="+getLat());
}
var UserJson;
function sendAjaxPost2(){

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.querySelector('.error-message').innerText="";
            document.querySelector('.error-message').style.display="none";
            UserJson = JSON.parse(xhr.responseText);
            $("#ajaxContent").load("htmlpaths/user/userpage.html");
            UserJson = JSON.parse(xhr.responseText);
            /*elegxei an einai giatros autos pou kanei log in */
            if(UserJson.hasOwnProperty('doctor_id')){
                $("#ajaxContent").load("htmlpaths/doc/docpage.html");
            }else{
                $("#ajaxContent").load("htmlpaths/user/userpage.html");
            }
            setTimeout(function () {
                
                document.querySelector('.user-name label').innerText=UserJson.username;
            }, 200);
            
        } else if (xhr.status !== 200) {
            document.querySelector('.error-message').style.display="block";
            document.querySelector('.error-message').innerText="Invalid username or password.";
        }
    };
    var data = $('#login-form').serialize();
    xhr.open('POST', 'LogIn');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(data);

}

function getUserName(){
    return UserJson.username;
}

function LogOut(){
   
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxContent").load("mainmenu.html");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'LogOut');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();

}


$(document).ready(function () {
    isLoggedIn();
});


function isLoggedIn() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            UserJson = JSON.parse(xhr.responseText);
            if(UserJson.hasOwnProperty('doctor_id')){
                $("#ajaxContent").load("htmlpaths/doc/docpage.html");
            }else{
                $("#ajaxContent").load("htmlpaths/user/userpage.html");
            }
            setTimeout(function () {
                
                document.querySelector('.user-name label').innerText=UserJson.username;
            }, 200);
            
        } else if (xhr.status !== 200) {

             $("#ajaxContent").load("mainmenu.html");
        }
    };
    xhr.open('GET', 'LogIn');
    xhr.send();
}



function DoctorsTable() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            
           let doctors_toJson=JSON.parse(xhr.responseText);

           let i = 0;
           let one_doctor;
           let x="";
           
           while(doctors_toJson[i]!==undefined){
               
               one_doctor = doctors_toJson[i];

               x+=createTableFromJSON(one_doctor);
               i++;
           }
           document.querySelector('#content').innerHTML=x;
        } else if (xhr.status !== 200) {
           document.querySelector('#content').innerHTML ="Failed to show dotors.";
        }
    };

    xhr.open('GET', 'ReturnDoctors');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function createTableFromJSON(data) {
    html="";

    if(data.certified){
        var html = "<div id='doctors-table'><div> <table><tr><th>Category</th><th>Value</th></tr>";
        for (const x in data) {
            
            if(x==="firstname" || x==="lastname" || x==="address" || x==="city" ||x==="doctor_info" || x==="specialty" || x==="telephone"){
                var category = x;
                var value = data[x];
        
                html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
            }
        
        }
        html += "</table> </div></div>";
        return html;
    }
    html += "";
    return html;
}

var Bmi_health_idealweight="";
function GetBmi(){
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            
            var bmiDATA = JSON.parse(this.responseText);
           
            Bmi_health_idealweight="<div>";
            Bmi_health_idealweight+=" <p> Your Bmi is : "+bmiDATA.data.bmi+" and your health is : "+ bmiDATA.data.health +"</p>";
            Bmi_health_idealweight+="</div>";
            idealweight();
        }else{
            Bmi_health_idealweight="Wait a second.";
            document.querySelector('#doctors-table').innerHTML=Bmi_health_idealweight;
        }
    });
    var age = Number(UserJson.birthdate.substring(0,4));
    age = new Date().getFullYear() - age;
    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age="+age+"&weight="+UserJson.weight+"&height="+UserJson.height);
    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
    var key = "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
    xhr.setRequestHeader("x-rapidapi-key",key );

    xhr.send(data);
}

function idealweight(){
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var idealWeight = JSON.parse(this.responseText);
            Bmi_health_idealweight+="<div>";
            Bmi_health_idealweight+=" <p> Ideal Weight is : "+idealWeight.data.Devine+"</p>";
            Bmi_health_idealweight+="</div>";
            document.querySelector('#content').innerHTML=Bmi_health_idealweight;
        }
    });

    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/idealweight?gender="+UserJson.gender.toLowerCase()+"&height="+UserJson.height);
    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
    var key = "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
    xhr.setRequestHeader("x-rapidapi-key",key );

    xhr.send(data);
}

function SeeProfileDetails(){
    $("#content").load("htmlpaths/seeprofile.html");
    setTimeout(function () {
                
        document.querySelector('.curr_data .firstname').innerText=UserJson.firstname;
        document.querySelector('.curr_data .lastname').innerText=UserJson.lastname;
        document.querySelector('.curr_data .username').innerText=UserJson.username;
        document.querySelector('.curr_data .email').innerText=UserJson.email;
        document.querySelector('.curr_data .password').innerText=UserJson.password;
        document.querySelector('.curr_data .birthdate').innerText=UserJson.birthdate;
        document.querySelector('.curr_data .amka').innerText=UserJson.amka;
        document.querySelector('.curr_data .gender').innerText=UserJson.gender;
        document.querySelector('.curr_data .country').innerText=UserJson.country;
        document.querySelector('.curr_data .city').innerText=UserJson.city;
        document.querySelector('.curr_data .address').innerText=UserJson.address;
        document.querySelector('.curr_data .telephone').innerText=UserJson.telephone;
        document.querySelector('.curr_data .weight').innerText=UserJson.weight;
        document.querySelector('.curr_data .height').innerText=UserJson.height;
        document.querySelector('.curr_data .blooddonor').innerText=UserJson.blooddonor;
        document.querySelector('.curr_data .bloodtype').innerText=UserJson.bloodtype;

    }, 100);

}

function changeProfileData(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            UserJson = JSON.parse(xhr.responseText);
            document.querySelector('.email-already-exist').innerText="Changed,reload page to see changes.";
           
        } else if (xhr.status === 403) {
            document.querySelector('.email-already-exist').innerText=xhr.responseText + " already exist.";
            
        }else{
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $("#changeprofile").serialize();
    xhr.open('POST', 'ChangeProfileData');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data+"&username="+UserJson.username);
}

function show(){
    if(document.querySelector(".changeprofile").style.display==="block"){
        document.querySelector(".changeprofile").style.display="none";
        document.querySelector(".curr_data").style.display="block";
        document.querySelector(".Change-Cancel").innerText="Change";
        document.querySelector(".Change-Cancel").style.background="#39a839"
    }else{
        document.querySelector(".changeprofile").style.display="block";
        document.querySelector(".curr_data").style.display="none";
        document.querySelector(".Change-Cancel").innerText="Cancel";
        document.querySelector(".Change-Cancel").style.background="#c94a00"
        loadFrom();
    }
    
}
function loadFrom(){
    document.changeprofile.address.value=UserJson.address;
    document.changeprofile.birthdate.value=UserJson.birthdate;
    document.changeprofile.blooddonor.value = UserJson.blooddonor;
    document.changeprofile.bloodtype.value=UserJson.bloodtype;
    document.changeprofile.city.value=UserJson.city;
    document.changeprofile.country.value=UserJson.country;
    document.changeprofile.email.value=UserJson.email;
    document.changeprofile.firstname.value=UserJson.firstname;
    document.changeprofile.gender.value=UserJson.gender.toLowerCase();
    document.changeprofile.height.value=Number(UserJson.height);
    document.changeprofile.lastname.value=UserJson.lastname;
    document.changeprofile.password.value=UserJson.password;
    document.changeprofile.telephone.value=UserJson.telephone;
    document.changeprofile.weight.value=Number(UserJson.weight);
}


/*project-------- */

function LogIn(){
    $("#main-menu-body").load("login.html");
}
function HomePage(){
    $("#content").load("homecontent.html");
}

function DoctorAppointments(){
    $("#content").load("htmlpaths/doc/docAppointments.html");
}
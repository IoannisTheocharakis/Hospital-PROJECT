function sendAjaxPOST() {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText.includes("SimpleUser")) {
                document.querySelector('.user-already-exist').innerText = "Registered. You can log in now."
            } else {
                document.querySelector('.user-already-exist').innerText = "Registered. You can log in now.But you must be certified by admin";
            }
        } else if (xhr.status === 403) {
            document.querySelector('.user-already-exist').innerText = xhr.responseText + " already exists.";
        } else {

            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $('#register-form').serialize();
    xhr.open('POST', 'SignIn');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data + "&lon=" + getLon() + "&lat=" + getLat());
}
var UserJson;
function sendAjaxPost2() {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.querySelector('.error-message').innerText = "";
            document.querySelector('.error-message').style.display = "none";
            UserJson = JSON.parse(xhr.responseText);
            /*elegxei an einai giatros autos pou kanei log in */
            if (UserJson.hasOwnProperty('doctor_id')) {
                $("#ajaxContent").load("htmlpaths/doc/docpage.html");
            } else {
                $("#ajaxContent").load("htmlpaths/user/userpage.html");
            }
            setTimeout(function () {
                document.querySelector('.user-name label').innerText = UserJson.username;
            }, 200);

        } else if (xhr.status !== 200) {
            document.querySelector('.error-message').style.display = "block";
            document.querySelector('.error-message').innerText = "Invalid username or password.";
        }
    };
    var data = $('#login-form').serialize();
    xhr.open('POST', 'LogIn');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);

}

function getUserName() {
    return UserJson.username;
}

function LogOut() {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            $("#ajaxContent").load("mainmenu.html");
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'LogOut');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
            if (UserJson.hasOwnProperty('doctor_id')) {
                $("#ajaxContent").load("htmlpaths/doc/docpage.html");
            } else {
                $("#ajaxContent").load("htmlpaths/user/userpage.html");
            }
            setTimeout(function () {

                document.querySelector('.user-name label').innerText = UserJson.username;
            }, 200);

        } else if (xhr.status !== 200) {

            $("#ajaxContent").load("mainmenu.html");
        }
    };
    xhr.open('GET', 'LogIn');
    xhr.send();
}



function DoctorsTable() {
    
    if (UserJson.hasOwnProperty('doctor_id')) {
        //$("#content").load("htmlpaths/doc/docpage.html");
    } else {
        $("#content").load("htmlpaths/user/userAppontments.html");
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let doctors_toJson = JSON.parse(xhr.responseText);
            console.log(doctors_toJson);
            let i = 0;
            let one_doctor;
            let x = "";

            while (doctors_toJson[i] !== undefined) {

                one_doctor = doctors_toJson[i];

                x += createTableFromJSON(one_doctor);
                i++;
            }
            if (document.querySelector('#print-doc')) {
                document.querySelector('#print-doc').innerHTML = x;
            } else {
                document.querySelector('#content').innerHTML = x;
            }
        } else if (xhr.status !== 200) {
            if (document.querySelector('#print-doc').length > 0) {
                document.querySelector('.sorting #print-doc').innerHTML = "Failed to show dotors.";
            } else {
                document.querySelector('#content').innerHTML = "Failed to show dotors.";
            }
        }
    };

    xhr.open('GET', 'ReturnDoctors');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function createTableFromJSON(data) {
    html = "";

    if (data.certified) {
        var html = "<div id='doctors-table'><div> <table><tr><th>Category</th><th>Value</th></tr>";

        for (const x in data) {

            if (x === "firstname" || x === "lastname" || x === "address" || x === "city" || x === "doctor_info" || x === "specialty" || x === "telephone") {
                var category = x;
                var value = data[x];

                html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
            }

        }
        html += "</table> </div></div>";
        html += `
        <div class="select-doc" onclick="selectDoc(`+ data.doctor_id + `)">
            Select
        </div>
        `;
        return html;
    }
    html += "";
    return html;
}

var Bmi_health_idealweight = "";
function GetBmi() {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {

            var bmiDATA = JSON.parse(this.responseText);

            Bmi_health_idealweight = "<div>";
            Bmi_health_idealweight += " <p> Your Bmi is : " + bmiDATA.data.bmi + " and your health is : " + bmiDATA.data.health + "</p>";
            Bmi_health_idealweight += "</div>";
            idealweight();
        } else {
            Bmi_health_idealweight = "Wait a second.";
            document.querySelector('#doctors-table').innerHTML = Bmi_health_idealweight;
        }
    });
    var age = Number(UserJson.birthdate.substring(0, 4));
    age = new Date().getFullYear() - age;
    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age=" + age + "&weight=" + UserJson.weight + "&height=" + UserJson.height);
    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
    var key = config.my_key;
    xhr.setRequestHeader("x-rapidapi-key",key );

    xhr.send(data);
}

function idealweight() {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var idealWeight = JSON.parse(this.responseText);
            Bmi_health_idealweight += "<div>";
            Bmi_health_idealweight += " <p> Ideal Weight is : " + idealWeight.data.Devine + "</p>";
            Bmi_health_idealweight += "</div>";
            document.querySelector('#content').innerHTML = Bmi_health_idealweight;
        }
    });

    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/idealweight?gender=" + UserJson.gender.toLowerCase() + "&height=" + UserJson.height);
    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
    var key = config.my_key;
    xhr.setRequestHeader("x-rapidapi-key",key );

    xhr.send(data);
}

function SeeProfileDetails() {
    $("#content").load("htmlpaths/seeprofile.html");
    setTimeout(function () {

        document.querySelector('.curr_data .firstname').innerText = UserJson.firstname;
        document.querySelector('.curr_data .lastname').innerText = UserJson.lastname;
        document.querySelector('.curr_data .username').innerText = UserJson.username;
        document.querySelector('.curr_data .email').innerText = UserJson.email;
        document.querySelector('.curr_data .password').innerText = UserJson.password;
        document.querySelector('.curr_data .birthdate').innerText = UserJson.birthdate;
        document.querySelector('.curr_data .amka').innerText = UserJson.amka;
        document.querySelector('.curr_data .gender').innerText = UserJson.gender;
        document.querySelector('.curr_data .country').innerText = UserJson.country;
        document.querySelector('.curr_data .city').innerText = UserJson.city;
        document.querySelector('.curr_data .address').innerText = UserJson.address;
        document.querySelector('.curr_data .telephone').innerText = UserJson.telephone;
        document.querySelector('.curr_data .weight').innerText = UserJson.weight;
        document.querySelector('.curr_data .height').innerText = UserJson.height;
        document.querySelector('.curr_data .blooddonor').innerText = UserJson.blooddonor;
        document.querySelector('.curr_data .bloodtype').innerText = UserJson.bloodtype;

    }, 200);

}

function changeProfileData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            UserJson = JSON.parse(xhr.responseText);
            document.querySelector('.email-already-exist').innerText = "Changed,reload page to see changes.";

        } else if (xhr.status === 403) {
            document.querySelector('.email-already-exist').innerText = xhr.responseText + " already exist.";

        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $("#changeprofile").serialize();
    xhr.open('POST', 'ChangeProfileData');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data + "&username=" + UserJson.username);
}

function show() {
    if (document.querySelector(".changeprofile").style.display === "block") {
        document.querySelector(".changeprofile").style.display = "none";
        document.querySelector(".curr_data").style.display = "block";
        document.querySelector(".Change-Cancel").innerText = "Change";
        document.querySelector(".Change-Cancel").style.background = "#39a839"
    } else {
        document.querySelector(".changeprofile").style.display = "block";
        document.querySelector(".curr_data").style.display = "none";
        document.querySelector(".Change-Cancel").innerText = "Cancel";
        document.querySelector(".Change-Cancel").style.background = "#c94a00"
        loadFrom();
    }

}
function loadFrom() {
    document.changeprofile.address.value = UserJson.address;
    document.changeprofile.birthdate.value = UserJson.birthdate;
    document.changeprofile.blooddonor.value = UserJson.blooddonor;
    document.changeprofile.bloodtype.value = UserJson.bloodtype;
    document.changeprofile.city.value = UserJson.city;
    document.changeprofile.country.value = UserJson.country;
    document.changeprofile.email.value = UserJson.email;
    document.changeprofile.firstname.value = UserJson.firstname;
    document.changeprofile.gender.value = UserJson.gender.toLowerCase();
    document.changeprofile.height.value = Number(UserJson.height);
    document.changeprofile.lastname.value = UserJson.lastname;
    document.changeprofile.password.value = UserJson.password;
    document.changeprofile.telephone.value = UserJson.telephone;
    document.changeprofile.weight.value = Number(UserJson.weight);
}


/*project-------- */

function LogIn() {
    $("#main-menu-body").load("login.html");
}
function HomePage() {
    $("#content").load("homecontent.html");
}

function DoctorAppointments() {
    $("#content").load("htmlpaths/doc/docAppointments.html");
}
function selectDoc(id) {
    console.log("einai " + id);
}
/*new*/
function goBloodTest() {
    $("#content").load("htmlpaths/user/userBloodTest.html");
    setTimeout(function () {
        document.querySelector('#InsertNewBloodTestForm .bt-username').innerText = UserJson.username;
        document.querySelector('#InsertNewBloodTestForm .bt-amka').innerText = UserJson.amka;
    }, 200);


}


function AddAppointment() {
    var today = new Date();
    var date = today.getFullYear() + "-0" + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;


    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Your schedule was successfully created.", dateTime);
        } else if (xhr.status === 403) {
            alert("An error occured while trying to create your schedule.");
        } else {

            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $('#AddAppointment-form').serialize();
    xhr.open('POST', 'AddAppointment');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data + "&status=free" + "&doctor_id=" + UserJson.doctor_id + "&CurrentTime=" + dateTime);
}

var DocPatientsJson;
function GetPatientID() {
    ViewApp();
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            DocPatientsJson = JSON.parse(xhr.responseText);/*here it gets all the doctors patients*/
            console.log(DocPatientsJson);
//            alert(DocPatientsJson.patient_id);
        } else if (xhr.status === 403) {
            alert("An error occured while trying to create your schedule.");
        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
//    var data = $('#AddAppointment-form').serialize();
    xhr.open('POST', 'GetPatientID');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send("&doctor_id=" + UserJson.doctor_id);
}


function CreateNewTreatment() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Your schedule was successfully created.");
        } else if (xhr.status === 403) {
            alert("An error occured while trying to create your schedule.");
        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $('#NewTreatment').serialize();
    xhr.open('POST', 'CreateNewTreatment');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data + "&doctor_id=" + UserJson.doctor_id + "&user_id=" + DocPatientsJson[1].user_id);
}

/*new*/
function InsertNewBloodTest() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Your schedule was successfully created.");
        } else if (xhr.status === 403) {
            alert("An error occured while trying to create your schedule.");
        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $('#InsertNewBloodTestForm').serialize();
    xhr.open('POST', 'InsertNewBloodTest');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data + "&amka=" + UserJson.amka);
}
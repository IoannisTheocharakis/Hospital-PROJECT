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
            let i = 0;
            let one_doctor;
            let x = "";

            while (doctors_toJson[i] !== undefined) {

                one_doctor = doctors_toJson[i];

                x += createTableFromJSON(one_doctor);
                i++;
            }
            API_doctors_dest();
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
    var key = "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
    xhr.setRequestHeader("x-rapidapi-key", key);

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
    var key = "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
    xhr.setRequestHeader("x-rapidapi-key", key);

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
    $("#content").load("htmlpaths/user/userAppSelect.html");
}
/*new*/
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
            let x = "";
            x += createDocViewAppointments(DocPatientsJson);
            if (document.querySelector('.days')) {
                document.querySelector('.days').innerHTML = x;
            } else {
                console.log("den brethike")
                //document.querySelector('#content').innerHTML = x;
            }
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
    console.log("&doctor_id=" + UserJson.doctor_id);
    xhr.send("&doctor_id=" + UserJson.doctor_id);
}

function createDocViewAppointments(patients) {
    let html1 = "";

    if (patients) {
        //----------
        var html = "";
        let k = 0;
        for (let i = 1; i < 2; i++) {
            html += `
            <div class="day day`+ 1 + `"> 
                <div class="day-pdf">
                    <p>
                        Day `+ 1 + `
                    </p>
                    <div class="pdf">
                        <img src="img/pdf-file.png" alt="">
                    </div>
                </div> 
                <div class="users">`
            while (DocPatientsJson[k] !== undefined) {
                one_doctor_patient = DocPatientsJson[k];
                console.log(one_doctor_patient)
                html += `
                <div class="user user`+ one_doctor_patient.user_id + `" >
                    <div class="info-choices">
                        <div class="patient-info">
                            <div class="name">`
                    + one_doctor_patient.firstname + ` ` + one_doctor_patient.lastname + `
                            </div>
                            <div class="amka">
                                `+ one_doctor_patient.amka + `
                            </div>
                        </div>
                        <div class="choices">
                            <div class="done" onclick="showmore(`+ one_doctor_patient.user_id + `)">
                                <img src="img/check.png" alt="">
                            </div>
                            <div class="cancel" onclick="showless(`+ one_doctor_patient.user_id + `)">
                                <img src="img/remove.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="user-info-`+ one_doctor_patient.user_id + `" style="display:none">
                        <div class="treatments">
                            <div class="title">
                                Treatments
                            </div>
                            <div class="treatment">
                            `
                for (let w = 0; w < 1; w++) {
                    html += `
                                <div class="start-date">
                                    `+ 20 + `
                                </div>
                                <div class="final-date">
                                    `+ w + `
                                </div>
                                <div class="info">
                                    `+ k + `
                                </div>
                                `
                }
                html += `</div>
                        </div>
                        <div class="bloodtest">
                            <div class="title">
                                See statistics
                            </div>
                            <div class="type">
                                <div class="iron bloodT" onclick="patientBTinfo(`+ one_doctor_patient.user_id + `,'iron')">
                                    iron
                                </div>
                                <div class="sugar bloodT" onclick="patientBTinfo(`+ one_doctor_patient.user_id + `,'blood_sugar')">
                                    sugar
                                </div>
                                <div class="cholesterol bloodT" onclick="patientBTinfo(`+ one_doctor_patient.user_id + `,'cholesterol')">
                                    cholesterol
                                </div>
                                <div class="vitamin-d3 bloodT" onclick="patientBTinfo(`+ one_doctor_patient.user_id + `,'vitamin_d3')">
                                    vitamin d3
                                </div>
                                <div class="vitamin-b12 bloodT" onclick="patientBTinfo(`+ one_doctor_patient.user_id + `,'vitamin_b12')">
                                    vitamin b12
                                </div>
                            </div>
                            <div class="googleCharts">

                            </div>
                        </div>
                        <div class="new-treatment">
                            <div class="title">
                                New Treatment
                            </div>
                            <form id="NewTreatment" action="" onsubmit='CreateNewTreatment(`+ one_doctor_patient.user_id + `);return false;'>
                                <div class="new-start-date">
                                    <label>Start Date</label>
                                    <input  type="date" id="startdate" name="startdate" value="2022-01-01"
                                    min="1920-01-01" max="20055-12-31" required>
                                </div>
                                <div class="new-final-date">
                                    <label>Last Date</label>
                                    <input  type="date" id="lastdate" name="lastdate" value="2022-01-01"
                                    min="1920-01-01" max="20055-12-31" required>
                                </div>
                                
                                <div class="new-info">
                                    <label>Info</label>
                                    <input type="text" name="treatmentText" id="treatmentText" placeholder="info">
                                </div>
                                <div class="sbmt">
                                    <input type="submit" name="submit" id="submit">
                                </div>
                            </form>
                                       
                        </div>
                    </div>
                </div>
                `
                k++;
            }
            html += `
                </div>
            </div>
            `
        }
        //----------
        return html;
    }
    html1 += "";
    return html1;
}

function CreateNewTreatment(patient_id) {
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


function patientBTinfo(patientID, type) {
    console.log(patientID);
    console.log(type);
}

function showmore(user_id) {
    console.log(user_id);
    document.querySelector(".user-info-" + user_id).style.display = "block";
}
function showless(user_id) {
    console.log(user_id);
    document.querySelector(".user-info-" + user_id).style.display = "none";
}







function API_doctors_dest() {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });
    console.log(UserJson.lat);
    console.log(UserJson.lon);
    console.log("https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins="+UserJson.lat+"%2C"+UserJson.lon+"&destinations=35.3357701%2C25.1189201%3B35.329600%2C25.081010");
    xhr.open("GET", "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins="+UserJson.lat+"%2C"+UserJson.lon+"&destinations=35.3357701%2C25.1189201%3B35.329600%2C25.081010");
    xhr.setRequestHeader("x-rapidapi-host", "trueway-matrix.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212");

    xhr.send(data);
}
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


var ALL_DOCTORS;
var temp_ALL_DOCTORS;
function DoctorsTable() {

    if (UserJson.hasOwnProperty('doctor_id')) {
        //$("#content").load("htmlpaths/doc/docpage.html");
    } else {
        $("#content").load("htmlpaths/user/userAppontments.html");
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // let doctors_toJson = JSON.parse(xhr.responseText);

            ALL_DOCTORS = JSON.parse(xhr.responseText);
            temp_ALL_DOCTORS = JSON.parse(xhr.responseText);


            let i = 0;
            let one_doctor;
            let x = "";

            while (temp_ALL_DOCTORS[i] !== undefined) {

                one_doctor = temp_ALL_DOCTORS[i];

                x += createTableFromJSON(one_doctor);
                i++;
            }
            x += `
            <div class="size-map">
                <div class="doc-map" id="doc-map">
                
                </div>
            </div>`;
            // API_doctors_dest();
            if (document.querySelector('#print-doc')) {
                document.querySelector('#print-doc').innerHTML = x;
            } else {
                document.querySelector('#content').innerHTML = x;
            }
            createDocMap();
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
        <div class="select-doc" onclick="AllDocRandevouz(`+ data.doctor_id + `)">
            Select
        </div>
        `;
        return html;
    }
    html += "";
    return html;
}

// var Bmi_health_idealweight = "";
// function GetBmi() {
//     const data = null;

//     const xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;

//     xhr.addEventListener("readystatechange", function () {
//         if (this.readyState === this.DONE) {

//             var bmiDATA = JSON.parse(this.responseText);

//             Bmi_health_idealweight = "<div>";
//             Bmi_health_idealweight += " <p> Your Bmi is : " + bmiDATA.data.bmi + " and your health is : " + bmiDATA.data.health + "</p>";
//             Bmi_health_idealweight += "</div>";
//             idealweight();
//         } else {
//             Bmi_health_idealweight = "Wait a second.";
//             document.querySelector('#doctors-table').innerHTML = Bmi_health_idealweight;
//         }
//     });
//     var age = Number(UserJson.birthdate.substring(0, 4));
//     age = new Date().getFullYear() - age;
//     xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age=" + age + "&weight=" + UserJson.weight + "&height=" + UserJson.height);
//     xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
//     var key = "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212";
//     xhr.setRequestHeader("x-rapidapi-key", key);

//     xhr.send(data);
// }

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
            console.log(403);
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
var DocRandevouzJson;
var DateForRandevouz = [];
function GetPatientID() {
    ViewApp();
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            DocPatientsJson = JSON.parse(xhr.responseText);/*here it gets all the doctors patients*/
            GetRandevouzID();
            setTimeout(function () {
                let DT;
                for (let j = 0; j < DocPatientsJson.length; j++) {
                    let text = DocRandevouzJson[j].date_time;
                    const myArray = text.split(" ");
                    let date = myArray[0];
                    let time = myArray[1];
                    /*ftiaxnw pinaka me oles tis diaforetikes hmerominies */
                    DT = date;
                    if (j === 0) {
                        DateForRandevouz.push(DT);
                    } else {
                        var boolDT = false;
                        for (dt = 0; dt < DateForRandevouz.length; dt++) {
                            if (DT === DateForRandevouz[dt]) {
                                var boolDT = true;
                            }
                        }
                        if (!boolDT) {
                            DT = date;
                            DateForRandevouz.push(DT);
                        }
                    }
                    //-=-=-===-==-===end
                    DocPatientsJson[j].date = date;
                    DocPatientsJson[j].time = time;
                    DocPatientsJson[j].date_time = DocRandevouzJson[j].date_time;
                    DocPatientsJson[j].doctor_id = DocRandevouzJson[j].doctor_id;
                    DocPatientsJson[j].doctor_info = DocRandevouzJson[j].doctor_info;
                    DocPatientsJson[j].price = DocRandevouzJson[j].price;
                    DocPatientsJson[j].randevouz_id = DocRandevouzJson[j].randevouz_id;
                    DocPatientsJson[j].status = DocRandevouzJson[j].status;
                    DocPatientsJson[j].user_id = DocRandevouzJson[j].user_id;
                    DocPatientsJson[j].user_info = DocRandevouzJson[j].user_info;
                }
                DateForRandevouz.sort();
                let x = "";
                x += createDocViewAppointments(DocPatientsJson);
                if (document.querySelector('.days')) {
                    document.querySelector('.days').innerHTML = x;
                } else {
                    console.log("den brethike")
                    //document.querySelector('#content').innerHTML = x;
                }
            }, 200);
        } else if (xhr.status === 403) {
            console.log(403);
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

function GetRandevouzID() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            DocRandevouzJson = JSON.parse(xhr.responseText);/*here it gets all the doctors patients*/
        } else if (xhr.status === 403) {
            console.log(403);
        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'GetRandevouzID');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send("&doctor_id=" + UserJson.doctor_id);
}
//--------------

function createDocViewAppointments(patients) {
    let html1 = "";
    if (patients) {
        //----------
        var html = "";
        let k = 0;
        for (let i = 0; i < DateForRandevouz.length; i++) {
            html += `
            <div class="day day`+ 1 + `"> 
                <div class="day-pdf">
                    <p>
                        Date : `+ DateForRandevouz[i] + `
                    </p>
                    <div class="pdf">
                        <img src="img/pdf-file.png" alt="">
                    </div>
                </div> 
                <div class="users">`
            k = 0;
            while (DocPatientsJson[k] !== undefined) {
                if (DocPatientsJson[k].status === "selected" && DateForRandevouz[i] === DocPatientsJson[k].date) {
                    one_doctor_patient = DocPatientsJson[k];
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
                                <div class="date_time">
                                    `+ one_doctor_patient.date_time + `
                                </div>
                                <div class="price">
                                    `+ one_doctor_patient.price + ` &euro;
                                </div>
                            </div>
                            <div class="choices">
                                <div class="done" onclick="getPatientTreatments(`+ one_doctor_patient.user_id + `,` + one_doctor_patient.randevouz_id + `,` + one_doctor_patient.amka + `)">
                                    <img src="img/check.png" alt="">
                                </div>
                                <div class="cancel" onclick="showless(`+ one_doctor_patient.user_id + `,` + one_doctor_patient.randevouz_id + `)">
                                    <img src="img/remove.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="user-info user-info-`+ one_doctor_patient.randevouz_id + `" style="display:none">
                            <div class="treatments">
                                <div class="title">
                                    Treatments
                                </div>
                                <div class="treatments2 treatments-`+ one_doctor_patient.randevouz_id + `">
                                `

                    html += `
                                    <div class="start-date">
                                        `+ 20 + `
                                    </div>
                                    <div class="final-date">
                                        `+ 1 + `
                                    </div>
                                    <div class="info">
                                        `+ 1 + `
                                    </div>
                                    `

                    html += `</div>
                            </div>
                            <div class="bloodtest">
                                <div class="title">
                                    See statistics
                                </div>
                                <div class="type">
                                    <div class="all bloodT" onclick="ShowPatientBT(`+ one_doctor_patient.randevouz_id + `,'all' , ` + one_doctor_patient.amka + `)">
                                        all
                                    </div>
                                    <div class="iron bloodT" onclick="ShowPatientBT(`+ one_doctor_patient.randevouz_id + `,'iron',` + one_doctor_patient.amka + `)">
                                        iron
                                    </div>
                                    <div class="sugar bloodT" onclick="ShowPatientBT(`+ one_doctor_patient.randevouz_id + `,'blood_sugar',` + one_doctor_patient.amka + `)">
                                        sugar
                                    </div>
                                    <div class="cholesterol bloodT" onclick="ShowPatientBT(`+ one_doctor_patient.randevouz_id + `,'cholesterol',` + one_doctor_patient.amka + `)">
                                        cholesterol
                                    </div>
                                    <div class="vitamin-d3 bloodT" onclick="ShowPatientBT(`+ one_doctor_patient.randevouz_id + `,'vitamin_d3',` + one_doctor_patient.amka + `)">
                                        vitamin d3
                                    </div>
                                    <div class="vitamin-b12 bloodT" onclick="ShowPatientBT(`+ one_doctor_patient.randevouz_id + `,'vitamin_b12',` + one_doctor_patient.amka + `)">
                                        vitamin b12
                                    </div>
                                </div>
                                <div class="googleCharts-`+ one_doctor_patient.randevouz_id + `">
    
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
                }

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
            alert(patient_id);
        } else if (xhr.status === 403) {

        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    // set the content type
    var data = $('#NewTreatment').serialize();
    xhr.open('POST', 'CreateNewTreatment');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data + "&doctor_id=" + UserJson.doctor_id + "&user_id=" + patient_id);
}

/*new*/
function InsertNewBloodTest() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Your schedule was successfully created.");
        } else if (xhr.status === 403) {
            console.log(403);
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

/*patient details from docs view appointments table*/
var PatientTreatments;
function getPatientTreatments(user_id, randevouz_id, user_amka) {
    document.querySelector(".user-info-" + randevouz_id).style.display = "block";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            PatientTreatments = JSON.parse(xhr.responseText);
            patientBTinfo();
            let htmlTreat = " ";

            setTimeout(function () {



                for (let w = 0; w < PatientTreatments.length; w++) {
                    let temp = PatientTreatments[w];
                    if (temp.user_id == user_id) {
                        htmlTreat += `<div class="treatment treatment-` + randevouz_id + `">`
                        htmlTreat += `
                                            <div class="start-date">
                                                start date : `+ temp.start_date + `
                                            </div>
                                            <div class="final-date">
                                                end date : `+ temp.end_date + `
                                            </div>
                                            <div class="info">
                                                Info : `+ temp.treatment_text + `
                                            </div>
                                        `
                        htmlTreat += `</div> `
                    }

                }
                document.querySelector(".treatments-" + randevouz_id).innerHTML = htmlTreat;




                /*----------CHARTS------------*/
                console.log(PatientBTResults);
                /*----------aLL------------*/
                var allHTML = "";
                allHTML += `<div class="all-BTs">`
                for (let testAll = 0; testAll < PatientBTResults.length; testAll++) {
                    let temp = PatientBTResults[testAll];

                    allHTML += `<div class="all-BT">`
                    if (temp.amka == user_amka) {
                        allHTML += `<div class="all-">`
                        allHTML += `
                                        <div class="test-date">
                                            test date : `+ temp.test_date + `
                                        </div>
                                        <div class="medical-center">
                                            medical center : `+ temp.medical_center + `
                                        </div>
                                        <div class="blood-sugar">
                                            Blood sugar : `+ temp.blood_sugar + ` Level : ` + temp.blood_sugar_level + `
                                        </div>
                                        <div class="cholesterol">
                                            Blood sugar : `+ temp.cholesterol + ` Level : ` + temp.cholesterol_level + `
                                        </div>
                                        <div class="iron">
                                            Blood sugar : `+ temp.iron + ` Level : ` + temp.iron_level + `
                                        </div>
                                        <div class="vitamin-d3">
                                            Blood sugar : `+ temp.vitamin_d3 + ` Level : ` + temp.vitamin_d3_level + `
                                        </div>
                                        <div class="vitamin-b12">
                                            Blood sugar : `+ temp.vitamin_b12 + ` Level : ` + temp.vitamin_b12_level + `
                                        </div>
                                        `
                        allHTML += `</div>`
                    }
                    allHTML += `</div>`
                }
                allHTML += `<div class="GC" id="google-Charts-BARs-` + randevouz_id + `"> </div>`
                allHTML += `</div> `
                document.querySelector(".googleCharts-" + randevouz_id).innerHTML = allHTML;
                // for (i = 0; i < tempquery.length; i++) {
                //     tempquery[i].innerHTML = allHTML;
                // }
                /*----------end------------*/
            }, 500);
            /*all-iron-sugar-chelesterol-vitamin_d3-vitamin_b12 */

        } else if (xhr.status === 403) {
            console.log(403);
        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'ActiveTreatments?&user_id=' + user_id);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}
/*show bt results based on which table was clicked*/
var PatientBTResults;
function patientBTinfo() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            PatientBTResults = JSON.parse(xhr.responseText);
            console.log(PatientBTResults)
            return PatientBTResults;
        } else if (xhr.status === 403) {
            console.log(403);
        } else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('GET', 'patientBTinfo');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}




function showless(user_id, randevouz_id) {
    document.querySelector(".user-info-" + randevouz_id).style.display = "none";
}






function API_doctors_dest() { }
// function API_doctors_dest() {
//     const data = null;

//     const xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;

//     xhr.addEventListener("readystatechange", function () {
//         if (this.readyState === this.DONE) {
//             DOC_DEST = JSON.parse(this.responseText);
//             let temp_doc = ALL_DOCTORS;

//             for (let doc = 0; doc < temp_doc.length; doc++) {
//                 if (DOC_DEST.distances[0][doc] !== null) {
//                     temp_doc[doc].distances_foruser = DOC_DEST.distances[0][doc];
//                 } else {
//                     temp_doc[doc].distances_foruser = 1000000000000;
//                 }
//                 if (DOC_DEST.durations[0][doc] !== null) {
//                     temp_doc[doc].car_duration_foruser = DOC_DEST.durations[0][doc];
//                 } else {
//                     temp_doc[doc].car_duration_foruser = 1000000000000;
//                 }
//             }

//             temp_doc.sort(rankingSorter("distances_foruser"));
//             temp_ALL_DOCTORS = temp_doc;
//         }
//     });
//     var others_doc = "";
//     for (var i = 0; i < ALL_DOCTORS.length; i++) {
//         if (i < 25) {
//             let lat = ALL_DOCTORS[i].lat;
//             let lon = ALL_DOCTORS[i].lon;
//             others_doc += lat + "%2C" + lon;
//             if ((i + 1) != ALL_DOCTORS.length && (i + 1) < 25) {
//                 others_doc += "%3B";
//             }
//         }

//     }
//     xhr.open("GET", "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=" + UserJson.lat + "%2C" + UserJson.lon + "&destinations=" + others_doc);
//     xhr.setRequestHeader("x-rapidapi-host", "trueway-matrix.p.rapidapi.com");
//     xhr.setRequestHeader("x-rapidapi-key", "2c6ac35988mshb9e10354146868fp18074ejsn4d35dfef1212");
//     xhr.send(data);
// }



function rankingSorter(key) {
    return function (a, b) {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    }
}


function sort_doc_by_val(select) {
    API_doctors_dest();
    setTimeout(function () {
        let selected_val = select.options[select.selectedIndex].getAttribute("value");
        if (selected_val === "distance-by-car") {
            temp_ALL_DOCTORS.sort(rankingSorter("distances_foruser"));
            let i = 0;
            let one_doctor;
            let x = "";
            setTimeout(function () {
                while (temp_ALL_DOCTORS[i] !== undefined) {

                    one_doctor = temp_ALL_DOCTORS[i];

                    x += createTableFromJSON(one_doctor);
                    i++;
                }

                x += `
            <div class="size-map">
                <div class="doc-map" id="doc-map">
                
                </div>
            </div>`;

                if (document.querySelector('#print-doc')) {
                    document.querySelector('#print-doc').innerHTML = x;
                } else {
                    document.querySelector('#content').innerHTML = x;
                }
                createDocMap();
            }, 350);
        } else {
            temp_ALL_DOCTORS.sort(rankingSorter("car_duration_foruser"));
            let i = 0;
            let one_doctor;
            let x = "";
            setTimeout(function () {
                while (temp_ALL_DOCTORS[i] !== undefined) {

                    one_doctor = temp_ALL_DOCTORS[i];
                    x += createTableFromJSON(one_doctor);
                    i++;
                }
                x += `
            <div class="size-map">
                <div class="doc-map" id="doc-map">
                
                </div>
            </div>`;

                if (document.querySelector('#print-doc')) {
                    document.querySelector('#print-doc').innerHTML = x;
                } else {
                    document.querySelector('#content').innerHTML = x;
                }
                createDocMap();
            }, 350);
        }
    }, 200);

}

function createDocMap() {

    //Orismos Marker
    var map = new OpenLayers.Map("doc-map"); //create the map
    var mapnik = new OpenLayers.Layer.OSM("OpenCycleMap",
        ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
            "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
            "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]);//pws moiazei to map

    map.addLayer(mapnik);
    var mar;
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var position;
    for (let w = 0; w < ALL_DOCTORS.length; w++) {
        position = setPosition(ALL_DOCTORS[w].lat, ALL_DOCTORS[w].lon);
        mar = new OpenLayers.Marker(position);
        markers.addMarker(mar);
    }
    user = setPosition(35.33106, 25.13286);
    mar = new OpenLayers.Marker(user);
    markers.addMarker(mar);
    //Orismos zoom	
    const zoom = 13;
    map.setCenter(user, zoom);
}



function User_ActiveTreatments() {
    $("#content").load("htmlpaths/user/userTreatments.html");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let treatments;
            treatments = JSON.parse(xhr.responseText);

            var x = "";
            var today = new Date();
            var date = today.getFullYear() + "-0" + (today.getMonth() + 1) + '-' + today.getDate();
            setTimeout(function () {
                let i = 0;
                while (treatments[i] !== undefined) {
                    trtmnt = treatments[i];

                    if (date < trtmnt.end_date) {
                        x += `<div class="treatment">`;

                        x += ` 
                        <div class="start-date">
                            Start - date : <br>
                            `+ trtmnt.start_date + `  
                        </div>
                        <div class="end-date">
                            End - date : <br>
                            `+ trtmnt.end_date + `  
                        </div>
                        <div class="treatment-test">
                           `+ trtmnt.treatment_text + `  
                        </div>     
                            `
                        x += `</div>`;
                    }


                    i++;
                }

                if (document.querySelector('.treatments')) {
                    document.querySelector('.treatments').innerHTML = x;
                } else {
                    alert("Doesnt exist");
                }
            }, 350);



        } else if (xhr.status === 403) {
            console.log(403)
        }else{
            alert("alert Treatments !200");
        }
    };
    xhr.open('GET', 'ActiveTreatments?&user_id=' + UserJson.user_id);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}


function AllDocRandevouz(doc_id) {
    $("#content").load("htmlpaths/user/userAppSelect.html");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // let doctors_toJson = JSON.parse(xhr.responseText);
            let AllRandevouz;

            AllRandevouz = JSON.parse(xhr.responseText);
            var x = "";
            setTimeout(function () {
                let i = 0;
                while (AllRandevouz[i] !== undefined) {

                    allR = AllRandevouz[i];
                    if (allR.status === "free") {
                        let doc_name = true;
                        let j = 0;
                        while (doc_name) {

                            if (allR.doctor_id === ALL_DOCTORS[j].doctor_id) {
                                doc_name = false;
                                allR.doc_name = ALL_DOCTORS[j].firstname + ALL_DOCTORS[j].lastname;
                            }

                            j++;
                        }
                        x += `<div class="rantevou">`
                        x += `    
                            <div class="elem">
                                <label for="">Doctor Name: </label>
                                <label class="dc-name" name="name">`+ allR.doc_name + `</label>
                            </div>
                            <div class="elem date">
                                <label for="">Date : </label>
                                <label class="dc-date" name="date">`+ allR.date_time + `</label>
                            </div>
                            <div class="elem">
                                <label for="">Appointment price :</label>
                                
                                <label class="dc-date" name="appointment_price">`+ allR.price + ` 	&euro;</label>
                            </div>
                            <div class="elem close" onclick="BookAppointment(`+ allR + `)">
                                <label data="" type=""> Book</label>
                            </div>`
                        x += `</div>`

                    }


                    i++;
                }

                if (document.querySelector('.all-R')) {
                    document.querySelector('.all-R').innerHTML = x;
                } else {
                    alert("Doesnt exist");
                }
            }, 350);



        } else if (xhr.status === 403) {
            console.log(403)
        }else{
            alert("alert Treatments !200");
        }
    };
    xhr.open('GET', 'DocRandevous?&doctor_id=' + doc_id);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}


function AllUserRandevouz(user_id) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let AllUserRandevouz;
            AllUserRandevouz = JSON.parse(xhr.responseText);
            var x = "";
            var y = "";
            let userR;
            setTimeout(function () {
                let i = 0;
                while (AllUserRandevouz[i] !== undefined) {
                    userR = AllUserRandevouz[i];
                    let doc_name = true;
                    let j = 0;
                    while (doc_name) {

                        if (userR.doctor_id === ALL_DOCTORS[j].doctor_id) {
                            doc_name = false;
                            userR.doc_name = ALL_DOCTORS[j].firstname + ALL_DOCTORS[j].lastname;
                        }

                        j++;
                    }
                    if (userR.status === "selected") {
                        x += `<div class="book">`
                        x += `
                        <div class="name-doc">
                            <p>
                                Name
                            </p>
                            <p>
                                `+ userR.doc_name + `
                            </p>
                        </div>
                        <div class="date-time">
                            <p>
                                Date-time
                            </p>
                            <p>
                               `+ userR.date_time + `
                            </p>
                        </div>
                        <div class="price">
                            <p>
                                price
                            </p>
                            <p>
                               `+ userR.price + ` &euro;
                            </p>
                        </div>
                        <div class="cancel">
                            <image class="image" src="img/remove.png"> </image>
                        </div>
                        
                        `
                        x += `</div>`
                    } else if (userR.status === "done") {
                        y += `<div class="done">`;

                        y += `
                        <div class="name-doc">
                            <p>
                                Name
                            </p>
                            <p>
                            `+ userR.doc_name + `
                            </p>
                        </div>
                        <div class="date-time">
                            <p>
                                Date-time
                            </p>
                            <p>
                            `+ userR.date_time + `
                            </p>
                        </div>
                        <div class="price">
                            <p>
                                price
                            </p>
                            <p>
                            `+ userR.price + ` &euro;
                            </p> 
                        </div>
                        <div class="done-img">
                            <image class="image" src="img/check.png"> </image>
                        </div>
                        
                        
                        `

                        y += `</div>`
                    }
                    i++;
                }
                if (document.querySelector('.booked')) {
                    document.querySelector('.booked').innerHTML = x;
                    document.querySelector('.done-s').innerHTML = y;
                } else {
                    alert("Doesnt exist");
                }
            }, 350);
        } else if (xhr.status === 403) {
            document.querySelector('.booked').innerHTML = "0 randevouz nooked";
            document.querySelector('.done-s').innerHTML = document.querySelector('.booked').innerHTML = "0 randevouz coplete";;
        } else {
            alert("alert Treatments !200");
        }
    };
    xhr.open('GET', 'UserRandevouz?&user_id=' + user_id);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}


function ViewAppoint() {
    document.querySelector(".view-rantevou").style.display = "block";
    document.querySelector(".add-rantevou").style.display = "none";
    document.querySelector(".view").style.border = "1px solid black";
    document.querySelector(".add").style.border = "0px";
    AllUserRandevouz(UserJson.user_id);
}
function AddAppoint() {
    document.querySelector(".view-rantevou").style.display = "none";
    document.querySelector(".add-rantevou").style.display = "block";
    document.querySelector(".add").style.border = "1px solid black";
    document.querySelector(".view").style.border = "0px";
}

function ShowPatientBT(randevouz, type, amka) {
    var data = [];
    document.querySelector("#google-Charts-BARs-" + randevouz).style.display = "block";
    var Header = ['Element', 'Density', { role: 'style' }];
    data.push(Header);
    for (let i = 0; i < PatientBTResults.length; i++) {
        let temp = PatientBTResults[i];

        if (temp.amka == amka) {
            var temp_arr = [];
            temp_arr.push(temp.test_date);
            if (type === "iron") {
                temp_arr.push(temp.iron);
            } else if (type === "blood_sugar") {
                temp_arr.push(temp.blood_sugar);
            }
            else if (type === "cholesterol") {
                temp_arr.push(temp.cholesterol);
            }
            else if (type === "vitamin_d3") {
                temp_arr.push(temp.vitamin_d3);
            }
            else if (type === "vitamin_b12") {
                temp_arr.push(temp.vitamin_b12);
            }
            else {
                document.querySelector("#google-Charts-BARs-" + randevouz).style.display = "none";
                return;
            }

            temp_arr.push("blue");
            data.push(temp_arr);
        }
    }
    google.charts.load("current", { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var chartdata = google.visualization.arrayToDataTable(data);
        var view = new google.visualization.DataView(chartdata);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: type,
            width: 400,
            height: 650,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.querySelector("#google-Charts-BARs-" + randevouz));
        chart.draw(view, options);
    }
}

var UserTreatments;
function User_Treatments() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let treatments;
            treatments = JSON.parse(xhr.responseText);
            UserTreatments = JSON.parse(xhr.responseText);
            return treatments;
        } else if (xhr.status === 403) {
            console.log(403)
        } else {
            alert("alert Treatments !200");
        }
    };
    xhr.open('GET', 'ActiveTreatments?&user_id=' + UserJson.user_id);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}

function ViewBT() {
    document.querySelector(".viewBT-container").style.display = "block";
    document.querySelector(".addBT-container").style.display = "none";
    document.querySelector(".view").style.border = "1px solid black";
    document.querySelector(".add").style.border = "0px";
    patientBTinfo();
    User_Treatments();
    setTimeout(function () {
        var treatments = UserTreatments;
        var BTinfo = PatientBTResults
        BTinfo.sort(rankingSorter("test_date"))
        console.log(treatments);
        console.log(BTinfo);

        if (BTinfo.length === 1) {
            var BTs = "";
            BTs += `     
                <div class="prev-bt">
                <h5> Previous BT </h5>
                <div class="date-center">
                    <div class="test_date">
                        Date : `+ BTinfo[i - 1].test_date + `
                    </div>
                    <div class="medical_center">
                        Medical_Center : `+ BTinfo[i - 1].medical_center + `
                    </div>
                </div>
                <div class="info">
                    <div class="bs">
                        <div class="type">
                            Blood Sugar :
                            <div>
                                `+ BTinfo[i - 1].blood_sugar + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].blood_sugar_level + `
                        </div>
                    </div>
                    <div class="chol">
                        <div class="type">
                            Cholesterol :
                            <div>
                                `+ BTinfo[i - 1].cholesterol + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].cholesterol_level + `
                        </div>
                    </div>
                    <div class="i">
                        <div class="type">
                            Iron :
                            <div>
                                `+ BTinfo[i - 1].iron + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].iron_level + `
                        </div>
                    </div>
                    <div class="vd">
                        <div class="type">
                            Vitamin D3 :
                            <div>
                                `+ BTinfo[i - 1].vitamin_d3 + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].vitamin_d3_level + `
                        </div>
                    </div>
                    <div class="vb12">
                        <div class="type">
                            Vitamin B12 :
                            <div>
                                `+ BTinfo[i - 1].vitamin_b12 + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].vitamin_b12_level + `
                        </div>
                    </div>
                </div>`
            for (let j = 0; j < treatments.length; j++) {
                if (treatments[j].bloodtest_id === BTinfo[i - 1].bloodtest_id) {
                    BTs += `<div class="bt-treatment">
                                    <div class="title">

                                        <h4>Treatment</h4>
                                    </div>
                                    <div class="treat-info">
                                        <div class="start-date">
                                        `+ treatments[j].start_date + `
                                        </div>
                                        <div class="end-date">
                                        `+ treatments[j].end_date + `
                                        </div>
                                        <div class="info">
                                        `+ treatments[j].treatment_text + `
                                        </div>
                                    </div>
                                </div>
                            
                                                `
                }
            }
            BTs += `</div> <!-- here end the BT -->`
        } else {
            var BTs = "";
            for (let i = 1; i < BTinfo.length; i++) {
                BTs += `
                <div class="compare2">`
                //----------------prev------------//
                BTs += `     
                <div class="prev-bt">
                <h5> Previous BT </h5>
                <div class="date-center">
                    <div class="test_date">
                        Date : `+ BTinfo[i - 1].test_date + `
                    </div>
                    <div class="medical_center">
                        Medical_Center : `+ BTinfo[i - 1].medical_center + `
                    </div>
                </div>
                <div class="info">
                    <div class="bs">
                        <div class="type">
                            Blood Sugar :
                            <div>
                                `+ BTinfo[i - 1].blood_sugar + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].blood_sugar_level + `
                        </div>
                    </div>
                    <div class="chol">
                        <div class="type">
                            Cholesterol :
                            <div>
                                `+ BTinfo[i - 1].cholesterol + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].cholesterol_level + `
                        </div>
                    </div>
                    <div class="i">
                        <div class="type">
                            Iron :
                            <div>
                                `+ BTinfo[i - 1].iron + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].iron_level + `
                        </div>
                    </div>
                    <div class="vd">
                        <div class="type">
                            Vitamin D3 :
                            <div>
                                `+ BTinfo[i - 1].vitamin_d3 + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].vitamin_d3_level + `
                        </div>
                    </div>
                    <div class="vb12">
                        <div class="type">
                            Vitamin B12 :
                            <div>
                                `+ BTinfo[i - 1].vitamin_b12 + `
                            </div>
                        </div>
                        <div class="level">
                            `+ BTinfo[i - 1].vitamin_b12_level + `
                        </div>
                    </div>
                </div>`
                for (let j = 0; j < treatments.length; j++) {
                    if (treatments[j].bloodtest_id === BTinfo[i - 1].bloodtest_id) {
                        BTs += `<div class="bt-treatment">
                                    <div class="title">

                                        <h4>Treatment</h4>
                                    </div>
                                    <div class="treat-info">
                                        <div class="start-date">
                                        `+ treatments[j].start_date + `
                                        </div>
                                        <div class="end-date">
                                        `+ treatments[j].end_date + `
                                        </div>
                                        <div class="info">
                                        `+ treatments[j].treatment_text + `
                                        </div>
                                    </div>
                                </div>
                            
                                                `
                    }
                }
                BTs += `</div> <!-- here end the BT -->`
                //-------------Endprev////


                //-------------New ////

                BTs += `     <div class="prev-bt">
                                <div class="date-center">
                                    <div class="test_date">
                                        Date : `+ BTinfo[i].test_date + `
                                    </div>
                                    <div class="medical_center">
                                        Medical_Center : `+ BTinfo[i].medical_center + `
                                    </div>
                                </div>
                                <div class="info">
                                    <div class="bs">
                                        <div class="type">
                                            Blood Sugar :
                                            <div>
                                                `+ BTinfo[i].blood_sugar + `
                                            </div>
                                        </div>
                                        <div class="level">
                                            `+ BTinfo[i].blood_sugar_level + `
                                        </div>
                                    </div>
                                    <div class="chol">
                                        <div class="type">
                                            Cholesterol :
                                            <div>
                                                `+ BTinfo[i].cholesterol + `
                                            </div>
                                        </div>
                                        <div class="level">
                                            `+ BTinfo[i].cholesterol_level + `
                                        </div>
                                    </div>
                                    <div class="i">
                                        <div class="type">
                                            Iron :
                                            <div>
                                                `+ BTinfo[i].iron + `
                                            </div>
                                        </div>
                                        <div class="level">
                                            `+ BTinfo[i].iron_level + `
                                        </div>
                                    </div>
                                    <div class="vd">
                                        <div class="type">
                                            Vitamin D3 :
                                            <div>
                                                `+ BTinfo[i].vitamin_d3 + `
                                            </div>
                                        </div>
                                        <div class="level">
                                            `+ BTinfo[i].vitamin_d3_level + `
                                        </div>
                                    </div>
                                    <div class="vb12">
                                        <div class="type">
                                            Vitamin B12 :
                                            <div>
                                                `+ BTinfo[i].vitamin_b12 + `
                                            </div>
                                        </div>
                                        <div class="level">
                                            `+ BTinfo[i].vitamin_b12_level + `
                                        </div>
                                    </div>
                                </div>`
                for (let j = 0; j < treatments.length; j++) {
                    if (treatments[j].bloodtest_id === BTinfo[i].bloodtest_id) {
                        Bts += `<div class="bt-treatment">
                                                    <div class="title">
                
                                                        <h4>Treatment</h4>
                                                    </div>
                                                    <div class="treat-info">
                                                        <div class="start-date">
                                                        `+ treatments[j].start_date + `
                                                        </div>
                                                        <div class="end-date">
                                                        `+ treatments[j].end_date + `
                                                        </div>
                                                        <div class="info">
                                                        `+ treatments[j].treatment_text + `
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                                                `
                    }
                }
                BTs += `</div> <!-- here end the BT -->`
                BTs += `</div><!-- here end the compare2 -->`;

            }
            document.querySelector('.prev-bts').innerHTML = BTs;
        }
        document.querySelector('.prev-bts').innerHTML = BTs;
    }, 300);

}


function ShowPatientBT2(type) {
    var data = [];
    document.querySelector("#BT-charts").style.display = "block";
    document.querySelector('#treatments').style.display = "block";
    var Header = ['Element', 'Density', { role: 'style' }];
    data.push(Header);
    for (let i = 0; i < PatientBTResults.length; i++) {
        let temp = PatientBTResults[i];
        var temp_arr = [];
        temp_arr.push(temp.test_date);
        if (type === "iron") {
            temp_arr.push(temp.iron);
        } else if (type === "blood_sugar") {
            temp_arr.push(temp.blood_sugar);
        }
        else if (type === "cholesterol") {
            temp_arr.push(temp.cholesterol);
        }
        else if (type === "vitamin_d3") {
            temp_arr.push(temp.vitamin_d3);
        }
        else if (type === "vitamin_b12") {
            temp_arr.push(temp.vitamin_b12);
        }
        else {
            document.querySelector("#BT-charts").style.display = "none";
            document.querySelector('#treatments').style.display = "none";
            document.querySelector(".prev-bts").style.display = "block";
            return;
        }

        temp_arr.push("blue");
        data.push(temp_arr);
    }
    google.charts.load("current", { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var chartdata = google.visualization.arrayToDataTable(data);
        var view = new google.visualization.DataView(chartdata);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: type,
            width: 400,
            height: 650,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
        };
        document.querySelector(".prev-bts").style.display = "none";
        var chart = new google.visualization.ColumnChart(document.querySelector("#BT-charts"));
        chart.draw(view, options);
        var BTs = "";
        for (let j = 0; j < UserTreatments.length; j++) {
            if (UserTreatments[j].user_id === UserJson.user_id) {
                BTs += `<div class="bt-treatment">
                                            <div class="title">
                                                <h4>Treatment</h4>
                                            </div>
                                            <div class="treat-info">
                                                <div class="start-date">
                                                `+ UserTreatments[j].start_date + `
                                                </div>
                                                <div class="end-date">
                                                `+ UserTreatments[j].end_date + `
                                                </div>
                                                <div class="info">
                                                `+ UserTreatments[j].treatment_text + `
                                                </div>
                                            </div>
                                        </div>
                                     `
            }
        }
        document.querySelector('#treatments').innerHTML=BTs;
    }
}
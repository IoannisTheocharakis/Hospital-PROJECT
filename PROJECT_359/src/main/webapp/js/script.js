var dont_submit = document.querySelector('#submit-btn');
var pass_error = document.querySelector('.pass-error-msg');

function check(){
    let password = document.querySelector('#pass').value;
    let sec_password = document.querySelector('#sec_pass').value;
    
    if(password == ""){
        document.querySelector('#pass').style.border="2px solid red";
        document.querySelector('.pass-error-msg').style.display="block";
        pass_error.innerHTML="<br>* Your password can not be empty.";
    }
    else if( password != sec_password){
        document.querySelector('.pass-error-msg').style.display="block";
        document.querySelector('#pass').style.border="2px solid red";
        document.querySelector('#sec_pass').style.border="2px solid red";
        pass_error.innerHTML="<br>* Your password and confirmation password do not match.";
        document.querySelector('#pass-strength').style.display="none";
    }else{
        document.querySelector('.pass-error-msg').style.display="none";
        document.querySelector('#pass').style.border="1px solid green";
        document.querySelector('#sec_pass').style.border="1px solid green";
    }
    if(!check_box()){
        document.querySelector('.checkbox-msg').style.display="block";
        document.querySelector('.checkbox-msg').innerHTML="<br> * You should agree with terms if you want to submit."
        document.querySelector('.checkbox-msg').style.color="red";
        document.querySelector('.checkbox-msg').style.fontSize="13px";
        
    }else{
        document.querySelector('.checkbox-msg').style.display="none";
        document.querySelector('.checkbox-msg').innerHTML=""
    }
}

function seePass(){
    let password=document.querySelector('#pass');
    let open_eye=document.querySelector('#open-eye');
    let close_eye=document.querySelector('#close-eye');
    if(password.type ==='password'){
        open_eye.style.display ="block";
        close_eye.style.display ="none";
        password.type = "text"
    }else{
        open_eye.style.display ="none";
        close_eye.style.display ="block";
        password.type = "password"
    }
}
function seeRe_Pass(){
    var password=document.querySelector('#sec_pass');
    var open_eye=document.querySelector('#open2-eye');
    var close_eye=document.querySelector('#close2-eye');
    if(password.type ==='password'){
        open_eye.style.display ="block";
        close_eye.style.display ="none";
        password.type = "text"
    }else{
        open_eye.style.display ="none";
        close_eye.style.display ="block";
        password.type = "password"
    }
}


function pass_strength(){
    let pass_strength = document.querySelector('#pass-strength');
    let pass_spans = document.querySelectorAll(".pass-strength-bar span");
    let pass = document.querySelector('#pass');
    let numbers=0;
    let max_shown_char = 0;
    let shown_char=0;
    let curret_char ;
    let regexp;
    let temp_str ="";
    let diff_letters="";
    /*posostiaia apotelesmata*/
    let perc_num=0,perc_max_let=0,perc_let=0;
    
    if(pass.value!=""){
        if(pass.value.length >= 8 && pass.value.length < 15){
            document.querySelector('.pass-error-msg').style.display="none";
            document.querySelector('#pass').style.border="1px solid green";
            document.querySelector('#sec_pass').style.border="1px solid green";
            pass_strength.style.display ="block";
            for(var i=0; i<pass.value.length;i++){
                /*---------Check if numbers exist 50%----------*/
                if(!isNaN(pass.value.charAt(i))){
                    numbers++;
                }
                /*---------Check if a letter exist 50%----------*/
                /*den antegrapsa, epsaksa*/
                curret_char=pass.value.charAt(i);/*pairnw gramma gramma gia na elegksw ta parakatw*/
                regexp = new RegExp("[^"+curret_char+"]","g");/*to kanw reg exp epeidh to bazw meta sthn class replace 
                h opoia dexete mono regexp ara to metatrepo einai san n giinetai /[^curret_char]/gi to gi an einai kefalaia 
                h mikra ta pairnei to idio enw to g ta ksexwrizei*/
                temp_str = pass.value; /*dhmiourgisa to temp_str wste na mhn xalaw to pass.value(den kserw kata poso to xalaw)*/
                shown_char=temp_str.replace(regexp,"").length;/*pairnei to length twn grammatwn kai briskei to max gramma*/
                if(shown_char>max_shown_char) {
                    max_shown_char = shown_char;
                }
                /*---------Check if different letters are >=80%----------*/
                if(!diff_letters.includes(curret_char)){/*otan kapoio gramma uparxei mia fora to bazw se ena string wste meta na parw to length tou*/
                    diff_letters+=curret_char;
                }
            }
            /*---------Ebros posostwn apo ta prohgoumena----------*/
            perc_num = (numbers/pass.value.length)*100;
            perc_max_let = (max_shown_char/pass.value.length)*100;
            perc_let = (diff_letters.length/pass.value.length)*100;
            
            /*---------elegxos----------*/
            
            if(perc_num >= 50 || perc_max_let >=50 ) {
                pass_spans[0].innerText ="Weak password"
                pass_spans[1].style.width = "20%";
                pass_spans[1].style.background ="red";
                pass_spans[0].style.color = "black";
            }else if(perc_let >= 80){
                
                pass_spans[0].innerText ="Strong password"
                pass_spans[1].style.width = "100%";
                pass_spans[1].style.background ="green";
                pass_spans[0].style.color = "white";
            }else{
                pass_spans[0].innerText ="Medium password"
                pass_spans[1].style.width = "60%";
                pass_spans[1].style.background ="yellow";
                pass_spans[0].style.color = "black";
            }
            document.querySelector('.pass-error-msg').style.display="none";
            document.querySelector('.pass-error-msg').innerHTML="";
        }else if(pass.value.length <8 ){
            pass_strength.style.display ="none";
        }else{
            pass_strength.style.display ="none";
            document.querySelector('.pass-error-msg').style.display="block";
            document.querySelector('.pass-error-msg').innerHTML="<br>* Your password should be 8-15 characters.";
            
        }
        
    }else{
        pass_strength.style.display ="none";
    }
}

function doctor_info(){
    let doctor_info=document.querySelector("#type-user");
    let doctor_spec=doctor_info.value;
    if(doctor_spec==="doctor"){
        document.querySelector(".address label").innerText="Clinic address";
        document.querySelector("#doctor-information").style.display="flex";
    }else{
        document.querySelector(".address label").innerText="Address";
        document.querySelector("#doctor-information").style.display="none";
    }
}

function date_of_birth(){
    let date=document.querySelector("#start");
    let date_val=date.value;
    return date_val;
    
    
}
function amka_check(){
    let date = date_of_birth();
    let date_separate = date.split("-");
    let year = date_separate[0],month = date_separate[1],day=date_separate[2];
    year = year.slice(2);
    let amka = document.querySelector(".amka input");
    let amka_date = day+month+year;
    let temp_amka = amka.value.substring(0,6);
    let amka_msg=document.querySelector(".amka-msg");
    if(amka_date != temp_amka && amka.value.length >=6 ){
        amka_msg.style.display="block";
        amka.style.border="2px solid red"
        amka_msg.style.color="red";
        amka_msg.innerHTML="<br>* The first 6 numbers should match with your bithday."
    }else{
        amka_msg.style.display="none";
        amka_msg.style.fontSize="13px"
        amka.style.border="1px solid green"
        amka_msg.style.color="red";
        amka_msg.innerHTML=""
    }
}
function check_box(){
    let check_box = document.querySelector("#checkbox");
    return check_box.checked;
}

<?php

require_once './config.php'; 


// print("<pre>");
// print_r($_POST);
// print("</pre>");

    $noError = true;
// Date of Birth
if(empty($_POST['dob'])){
    $errDob = "Date of Birth is required!";
    $noError = false;
} else {
    $dob = $_POST['dob'];
}
// Birth Country
if(empty($_POST['birthcountry'])){
    $errBirthcountry = "Birth Country is required!";
    $noError = false;
} else {
    $birthcountry = $_POST['birthcountry'];
}

// Address 1
if(empty($_POST['address1'])){
    $errAddress1 = "Address 1 is required!";
    $noError = false;
} else {
    $address1 = $_POST['address1'];
}

// Address 2
if(empty($_POST['address2'])){
    $errAddress2 = "Address 2 is required!";
    $noError = false;
} else {
    $address2 = $_POST['address2'];
}

// Postcode
if(empty($_POST['postcode'])){
    $errPostcode = "Postcode is required!";
    $noError = false;
} else {
    $postcode = $_POST['postcode'];
}

// Sindh (Assuming Sindh is a form field similar to State, but specific maybe to a country like Pakistan)
if(empty($_POST['sindh'])){
    $errSindh = "Sindh is required!";
    $noError = false;
} else {
    $sindh = $_POST['sindh'];
}

// // State
if(empty($_POST['state'])){
    $errState = "State is required!";
    $noError = false;
} else {
    $state = $_POST['state'];
}

// // City
if(empty($_POST['city'])){
    $errCity = "City is required!";
    $noError = false;
} else {
    $city = $_POST['city'];
}

// Passport Name
if(empty($_POST['passname'])){
    $errPassname = "Passport Name is required!";
    $noError = false;
} else {
    $passname = $_POST['passname'];
}

// Passport Number
if(empty($_POST['pass'])){
    $errPassnum = "Passport Number is required!";
    $noError = false;
} 
else {
    $passnum = $_POST['passnum'];
}

// Issue Location
if(empty($_POST['issueloc'])){
    $errIssueloc = "Issue Location is required!";
    $noError = false;
} else {
    $issueloc = $_POST['issueloc'];
}

// // Issue Date
if(empty($_POST['issuedate'])){
    $errIssuedate = "Issue Date is required!";
    $noError = false;
} else {
    $issuedate = $_POST['issuedate'];
}

// Expiry Date
if(empty($_POST['expdate'])){
    $errExpdate = "Expiry Date is required!";
    $noError = false;
} else {
    $expdate = $_POST['expdate'];
}

// Country
if(empty($_POST['country'])){
    $errCountry = "Country is required!";
    $noError = false;
} else {
    $country = $_POST['country'];
}

// Residential Address 1
if(empty($_POST['resaddress1'])){
    $errResaddress1 = "Residential Address 1 is required!";
    $noError = false;
} else {
    $resaddress1 = $_POST['resaddress1'];
}

// Residential Address 2
if(empty($_POST['resaddress2'])){
    $errResaddress2 = "Residential Address 2 is required!";
    $noError = false;
} else {
    $resaddress2 = $_POST['resaddress2'];
}

// Residential Postcode
if(empty($_POST['respostcode'])){
    $errRespostcode = "Residential Postcode is required!";
    $noError = false;
} else {
    $respostcode = $_POST['respostcode'];
}

// Residential Sindh
if(empty($_POST['ressindh'])){
    $errRessindh = "Residential Sindh is required!";
    $noError = false;
} else {
    $ressindh = $_POST['ressindh'];
    }



    //
    if(empty($_POST['reskarachi'])){
        $errReskarachi = "Residential City is required!";
        $noError = false;
    } else {
      $reskarachi = $_POST['reskarachi'];
    }
    
    
// Residential City
if(empty($_POST['rescity'])){
    $errRescity = "Residential City is required!";
    $noError = false;
} else {
    $rescity = $_POST['rescity'];
}

// Emergency Contact Name
if(empty($_POST['sosname'])){
    $errSosname = "Emergency Contact Name is required!";
    $noError = false;
} else {
    $sosname = $_POST['sosname'];
}

// Emergency Contact Number
if(empty($_POST['sosnum'])){
    $errSosnum = "Emergency Contact Number is required!";
    $noError = false;
} else {
    $sosnum = $_POST['sosnum'];
}

// Emergency Contact Email
if(empty($_POST['sosmail'])){
    $errSosmail = "Emergency Contact Email is required!";
    $noError = false;
} else if (!filter_var($_POST['sosmail'], FILTER_VALIDATE_EMAIL)) {
    $errSosmail = "Invalid email format";
    $noError = false;
} else {
    $sosmail = $_POST['sosmail'];
}

// Relationship
if(empty($_POST['relationship'])){
    $errRelationship = "Relationship with Emergency Contact is required!";
    $noError = false;
} else {
    $relationship = $_POST['relationship'];
}
        //process form here
       
            //send data to db.
            $sql = $conn->query("INSERT INTO personaldetails SET
            dob = '$dob',
            birthcountry = '$birthcountry',
            address1 = '$address1',
            address2 = '$address2',
            postcode = '$postcode',
            sindh = '$sindh',
            state = '$state',
            city = '$city',
            passname = '$passname',
            passnum = '$passnum',
            issueloc = '$issueloc',
            issuedate = '$issuedate',
            expdate = '$expdate',
            country = '$country',
            resaddress1 = '$resaddress1',
            resaddress2 = '$resaddress2',
            respostcode = '$respostcode',
            ressindh = '$ressindh',
            reskarachi = '$reskarachi',
            rescity = '$rescity',
            sosname = '$sosname',
            sosnum = '$sosnum',
            sosmail = '$sosmail',
            relationship = '$relationship' 
        ");
          if($sql){
            $res =  "Reg was successful";
            $alert = 'alert-success';
            header("Location:education.php");
        }else{
            $res =  "Fail! sorry we can't register you now.";
            $alert = 'alert-danger';
            header("Location:student.php");
        }
      
    

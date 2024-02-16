<?php

require_once './config.php';

$user = $_SESSION['userid'];
// print("<pre>");
// print_r($_POST);
// print("</pre>");

$noError = true;

//validate lastname
if (empty($_POST['firstname'])) {
    $errFname = "lastname is required!";
    $noError = false;
} else {
    $fname = $_POST['firstname'];
}

if (empty($_POST['lastname'])) {
    $errlastname = "lastname is required!";
    $noError = false;
} else {
    $lastname = $_POST['lastname'];
}

$gender = $_POST['gender'];

//validate phone
if (empty($_POST['phone'])) {
    $errPhone = "Phone number is required!";
    $noError = false;
} elseif (!is_numeric($_POST['phone'])) {
    $errPhone = "Enter valid phone number!";
    $noError = false;
} else {
    $phone = $_POST['phone'];
}

//validate email
if (empty($_POST['email'])) {
    $errEmail = "Email is required!";
    $noError = false;
} elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errEmail = "Enter valid email address!";
    $noError = false;
} else {
    $email = $_POST['email'];
    $sql = $conn->query("SELECT email FROM registerstudent WHERE email='$email'");
    if ($sql->num_rows > 0) {
        $errEmail = "Email is already taken!";
        $noError = false;
    }
}





//process form here
if ($noError) {

    function generateUniqueStudentId($length = 6)
    {
        do {
            $id = substr(md5(microtime() . rand(10000, 99999)), 0, $length);
            $exists = checkIdExistsInDatabase($id);
        } while ($exists);

        return $id;
    }
    function checkIdExistsInDatabase($id)
    {
        return false;
    }

    $studentid = generateUniqueStudentId();

    // $pass = md5($pass);
    //send data to db.
    $sql = $conn->query("INSERT INTO registerstudent SET
            userid = '$user',  
            student_id='$studentid',
            dfname='$fname',
            dlname='$lastname',
            dphone='$phone',
            gender ='$gender',
            email='$email'
                ");
    if ($sql) {
        $res =  "Reg was successful";
        $alert = 'alert-success';
        header("Location:userstudents.php");
    } else {
        $res =  "Fail! sorry we can't register you now.";
        $alert = 'alert-danger';
        header("Location:registerstudent.php");
    }
}

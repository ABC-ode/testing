<?php

require_once './config.php'; 


// print("<pre>");
// print_r($_POST);
// print("</pre>");

    $noError = true;

    //validate fullname
    if(empty($_POST['fname'])){
        $errFname = "Fullname is required!";
        $noError = false;
    }else{
        $fname = $_POST['fname'];
    }
    
  
    //validate phone
    if(empty($_POST['phone'])){
        $errPhone = "Phone number is required!";
        $noError = false;
    }elseif(!is_numeric($_POST['phone'])){
        $errPhone = "Enter valid phone number!";
        $noError = false;
    } else{
        $phone = $_POST['phone'];
    }

    //validate email
    if(empty($_POST['email'])){
        $errEmail = "Email is required!";
        $noError = false;
    }elseif(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
        $errEmail = "Enter valid email address!";
        $noError = false;
    }else{
        $email = $_POST['email'];
        $sql = $conn->query("SELECT email FROM register WHERE email='$email'");
        if($sql->num_rows>0){
            $errEmail = "Email is already taken!";
            $noError = false;
        }
    }

  

   
 
   //validate Password
   if(empty($_POST['pass'])){
        $errPass = "Password is required!";
        $noError = false;
    }elseif(strlen($_POST['pass']) < 4){
        $errPass = "Password is too short!";
        $noError = false;
    }else{
        $pass = $_POST['pass'];
    }

   //validate Password
   if(empty($_POST['cpass'])){
        $errConfirmPass = "Confirm password is required!";
        $noError = false;
    }else{
        $cpass = $_POST['cpass'];
        if(empty($errPass) && ($pass != $cpass)){
            $errConfirmPass = "Password doesn't match!";
            $noError = false;
        }
    } 

        //process form here
        if($noError){
            $userid = md5(date('dmYhis').rand(12345,7890));
            $pass = md5($pass);
            //send data to db.
            $sql = $conn->query("INSERT INTO register SET 
            userid='$userid', 
            fullname='$fname',
             dphone='$phone', 
             email='$email', 
             pass='$pass'");
            if($sql){
                $res =  "Reg was successful";
                $alert = 'alert-success';
                header("Location:signin.php");
            }else{
                $res =  "Fail! sorry we can't register you now.";
                $alert = 'alert-danger';
        header("Location:signup.php");
            }
          
        }
  
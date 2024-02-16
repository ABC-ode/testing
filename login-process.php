<?php

require_once 'config.php'; 
if($_SERVER['REQUEST_METHOD']=='POST'){
  if(isset($_POST['register'])){ 
    $user = $_POST['email'];
    $pass = md5($_POST['pass']);

    //run query
    $sql = $conn->query("SELECT userid, email, usertype FROM register WHERE  email='$user' AND pass='$pass' ");
    if($sql->num_rows>0){
      $row = $sql->fetch_assoc();

      if($row['dstatus']=='pending'){
        $_SESSION['msg'] = "Sorry, you're not allow to login until admin verified your account!";
        header("Location:dlogin.php");
      }else if($row['dstatus']=='ban'){
        $_SESSION['msg'] = "Sorry, your account has been banned, contact admin!";
        header("Location:flogin.php");
      }else{
        if ($row["usertype"] == "user") {
          $_SESSION['login'] = true;
          $_SESSION['userid'] = $row['userid'];
          $_SESSION['email'] = $row['email'];
          header("Location: dashboard.php");
          exit();
      } elseif ($row["usertype"] == "admin") {
          $_SESSION['login'] = true;
          $_SESSION['userid'] = $row['userid'];
          $_SESSION['email'] = $row['email']; // Assuming the admin email is stored in 'email' column
          header("Location: Muser.php");
          exit();
      } else {
          $_SESSION['msg'] = "Invalid user type!";
          header("Location: login-2.php");
          exit();
      }
      }
    }else{
      $_SESSION['msg'] = "Sorry, E no dey!";
      header("Location:login.php");
    }


  }
}


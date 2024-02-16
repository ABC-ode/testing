<?php
require 'config.php';

$state =  $_GET['state'];
$userid = $_GET['uid'];

if($state =='delete'){
  //run delete here...
  $sql = $conn->query("DELETE FROM register WHERE userid='$userid' ");
  if($sql){
    $_SESSION['msg'] = "Deleted successfully.";
  }
}
if($Mstate =='delete'){
  //run delete here...
  $sql = $conn->query("DELETE FROM registered WHERE userid='$userid' ");
  if($sql){
    $_SESSION['msg'] = "Deleted successfully.";
  }
}

if($state =='verify'){
  //run verify here...
  $sql = $conn->query("UPDATE register SET dstatus='active' WHERE userid='$userid' ");
  if($sql){
    $_SESSION['msg'] = "This account is now active.";
  }
}

if($state =='ban'){
  //run ban here...
  $sql = $conn->query("UPDATE register SET dstatus='ban' WHERE userid='$userid' ");
  if($sql){
    $_SESSION['msg'] = "This account has been banned.";
  }
}

if($state =='unban'){
  //run unban here...
  $sql = $conn->query("UPDATE register SET dstatus='active' WHERE userid='$userid' ");
  if($sql){
    $_SESSION['msg'] = "This account is now active.";
  }
}


header("Location:Muser.php");
<?php
require 'config.php';

$state =  $_GET['state'];

$studentid = $_GET['uid'];

if($state =='delete'){
  //run delete here...
  $sql = $conn->query("DELETE FROM registerstudent WHERE student_id='$studentid' ");
  if($sql){
    $_SESSION['msg'] = "Deleted successfully.";
  }
}


header("Location:userstudents.php");
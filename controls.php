<?php
require 'config.php';

$state =  $_GET['state'];
$Mstate =  $_GET['Mstate'];


$id = $_GET['student_id'];


if($state =='delete'){
  //run delete here...
  $sql = $conn->query("DELETE FROM cities WHERE id = '$id' ");
 
  if($sql){
    $_SESSION['message'] = '<div class="alert alert-danger"> deleted successfully</div>';
  }
  header("Location:mCity.php");
}

if($Mstate =='delete'){
  //run delete here...
  $sql = $conn->query("DELETE FROM registerstudent WHERE id = '$id' ");
  if($sql){
    $_SESSION['message'] = '<div class="alert alert-danger"> deleted successfully</div>';
  }
  header("Location:userstudents.php");
}



<?php
require 'config.php';


$id = $_POST['id'];


$countries = $_POST['country'];

$cities = $_POST['city'];

  
    $sql = $conn->query("UPDATE cities SET country_name ='$countries', city ='$cities' WHERE id = '$id' ");
    if($sql){
      $_SESSION['message'] = "<div class='alert alert-success'> successful </div>";
      
    }
    header("Location:home.php");
?>
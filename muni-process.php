

<?php
require "./config.php";

if (isset($_POST['city'])) {
    $countryInfo = explode('|', $_POST['city']);
    $cityId = $countryInfo[0];
    $cityName = $countryInfo[1];
    // Now you have both the ID and the name without needing another database query
}
   

$uni = $_POST['uni'];


$sql = $conn->query("INSERT INTO universities SET city_id='$cityId' ,cities ='$cityName', uni ='$uni' ");

if ($sql) {
    $_SESSION['message'] = '<div class="alert alert-success"> university added successfully</div>';
    header('Location: mUni.php');
} else {
    $_SESSION['message'] = '<div class="alert alert-danger"> failed </div>';
    header('Location: mUni.php');
}

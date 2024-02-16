

<?php
require "./config.php";

if (isset($_POST['country'])) {
    $countryInfo = explode('|', $_POST['country']);
    $countryId = $countryInfo[0];
    $countryName = $countryInfo[1];
    // Now you have both the ID and the name without needing another database query
}
   

$cities = $_POST['city'];


$sql = $conn->query("INSERT INTO cities SET country_id='$countryId' ,country_name ='$countryName', city ='$cities' ");

if ($sql) {
    $_SESSION['message'] = '<div class="alert alert-success"> university added successfully</div>';
    header('Location: mCity.php');
} else {
    $_SESSION['message'] = '<div class="alert alert-danger"> failed </div>';
    header('Location: mCity.php');
}

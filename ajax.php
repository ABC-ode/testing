<?php

include('config.php');

$countryId = isset($_POST['countryId']) ? $_POST['countryId'] : 0;
$stateId = isset($_POST['stateId']) ? $_POST['stateId'] : 0;
$command = isset($_POST['get']) ? $_POST['get'] : "";

switch ($command) {
    case "country":
        $statement = "SELECT id,country_name FROM countries";
        $dt = mysqli_query($conn, $statement);
        while ($result = mysqli_fetch_array($dt)) {
            echo $result1 = "<option value=" . $result['id'] . ">" . $result['country_name'] . "</option>";
        }
        break;

    case "state":
        $result1 = "<option>Select State</option>";
        $statement = "SELECT id,city FROM cities WHERE country_id=" . $countryId;
        $dt = mysqli_query($conn, $statement);

        while ($result = mysqli_fetch_array($dt)) {
            $result1 .= "<option value=" . $result['id'] . ">" . $result['city'] . "</option>";
        }
        echo $result1;
        break;

    case "city":
        $result1 = "<option>Select City</option>";
        $statement = "SELECT id, uni FROM universities WHERE city_id=" . $stateId;
        $dt = mysqli_query($conn, $statement);

        while ($result = mysqli_fetch_array($dt)) {
            $result1 .= "<option value=" . $result['id'] . ">" . $result['uni'] . "</option>";
        }
        echo $result1;
        break;
}

exit();
?>
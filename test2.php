<?php

$mysqli = new mysqli("localhost", 'root', '', 'agent');

// Check connection
if ($mysqli->connect_error) {
    error_log("Connection failed: " . $mysqli->connect_error);
    exit('An error occurred');
}

try {
    // Fetch countries
    $countriesResult = $mysqli->query('SELECT id, name FROM countries'); // Assuming 'name' is the correct column name
    if (!$countriesResult) {
        throw new Exception("Error fetching countries: " . $mysqli->error);
    }
    $countries = $countriesResult->fetch_all(); // Fetch as associative array

    // Prepare data
    $data = [];
    foreach ($countries as $country) {
        // Fetch cities for each country
        $stmt = $mysqli->prepare('SELECT city FROM cities WHERE country_id = ?');
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $mysqli->error);
        }
        $stmt->bind_param("i", $country['id']);
        $stmt->execute();
        $citiesResult = $stmt->get_result();
        $cities = $citiesResult->fetch_all(); // Fetch as associative array

        $citiesNames = array_map(function ($city) {
            return $city['city']; // Access as associative array
        }, $cities);

        $data[$country['city']] = $citiesNames; // Use 'name' or the correct column name for country
    }

   

} catch (Exception $e) {
    // Handle error
    error_log($e->getMessage());
    exit('An error occurred');
}
?>



<!DOCTYPE html>
<html>
<head>
    <title>Select Country and City</title>
</head>
<body>

<form>
    <label for="countrySelect">Country:</label>
    <select id="countrySelect" onchange="populateCities()">
        <option value="">Select Country</option>
        <!-- Countries will be populated here -->
    </select>
    
    <label for="citySelect">City:</label>
    <select id="citySelect">
        <option value="">Select City</option>
        <!-- Cities will be populated based on the selected country -->
    </select>
</form>

<script>
function fetchCountriesAndCities() {
    fetch('fetch_data.php')
        .then(response => response.json())
        .then(data => {
            const countrySelect = document.getElementById('countrySelect');
            for (const country in data) {
                const option = new Option(country, country);
                countrySelect.options.add(option);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function populateCities() {
    const countrySelect = document.getElementById('countrySelect');
    const citySelect = document.getElementById('citySelect');
    const selectedCountry = countrySelect.value;

    // Clear existing city options
    citySelect.innerHTML = '<option value="">Select City</option>';

    // Fetch again (could be optimized by storing the initially fetched data)
    fetch('fetch_data.php')
        .then(response => response.json())
        .then(data => {
            if (selectedCountry in data) {
                data[selectedCountry].forEach(city => {
                    const option = new Option(city, city);
                    citySelect.options.add(option);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

// Initial fetch
fetchCountriesAndCities();
</script>

</body>
</html>

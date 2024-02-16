<?php require_once './config.php'?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Select Country and City</title>
<script>
// Object containing countries and cities
const countriesAndCities = {
  USA: ["New York", "Los Angeles", "Chicago"],
  India: ["Mumbai", "Delhi", "Bangalore"],
  UK: ["London", "Manchester", "Birmingham"]
};

function populateCities(countrySelectId, citySelectId) {
  // Get the country and city select elements
  const countrySelect = document.getElementById(countrySelectId);
  const citySelect = document.getElementById(citySelectId);

  // Clear existing city options
  citySelect.innerHTML = '<option value="">Select City</option>';

  // Get selected country
  const selectedCountry = countrySelect.value;

  // Check if the selected country exists in the countriesAndCities object
  if (selectedCountry && countriesAndCities.hasOwnProperty(selectedCountry)) {
    // Populate the city select element with cities of the selected country
    countriesAndCities[selectedCountry].forEach((city) => {
      const option = new Option(city, city);
      citySelect.options.add(option);
    });
  }
}

// Initial population of countries
window.onload = function() {
  const countrySelect = document.getElementById('countrySelect');
  for (const country in countriesAndCities) {
    const option = new Option(country, country);
    countrySelect.options.add(option);
  }
};
</script>
</head>
<body>

<form>
  <label for="countrySelect">Country:</label>
  <select id="countrySelect" onchange="populateCities('countrySelect', 'citySelect')">
    <option value="">Select Country</option>
    <!-- Countries will be populated here by JavaScript -->
  </select>
  
  <label for="citySelect">City:</label>
  <select id="citySelect">
    <option value="">Select City</option>
    <!-- Cities will be populated based on the selected country -->
  </select>
</form>

</body>
</html>

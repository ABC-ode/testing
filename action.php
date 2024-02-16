<?php
include_once "./config.php";

foreach ($_POST['product_name'] as $key => $value) {
    // Basic sanitization (Note: This is not enough to prevent SQL injection)
    $choice = mysqli_real_escape_string($conn, $value);
    $prices = mysqli_real_escape_string($conn, $_POST['product_price'][$key]);
    $quantity = mysqli_real_escape_string($conn, $_POST['product_qty'][$key]);

    // Construct and execute the SQL query directly
    $sql = "INSERT INTO choices (choice, prices, quantity) VALUES ('$choice', '$prices', '$quantity')";
    
    if (!$conn->query($sql)) {
        echo "Error inserting items: " . $conn->error;
        exit; // Exit the script if an error occurs
    }
}

echo "Items inserted successfully";
?>

<?php
        include_once './config.php';
if (isset($_POST['submit'])) {
    $allowed_exs = array("jpg", "jpeg", "png","pdf"); // Allowed extensions

    for ($i = 1; $i <= 5; $i++) { // Loop through each file
        $fileInputName = 'my_image' . $i;
        if (isset($_FILES[$fileInputName])) {
            $img_name = $_FILES[$fileInputName]['name'];
            $img_size = $_FILES[$fileInputName]['size'];
            $tmp_name = $_FILES[$fileInputName]['tmp_name'];
            $error = $_FILES[$fileInputName]['error'];
            echo "<pre>";
            print_r(($_FILES[$fileInputName]));
            echo "</pre>";
        
            if ($error === 0) {
                if ($img_size < 0) {
                    $em = "Sorry, file's too big.";
                    header("Location: doc-upload.php?error=$em");
                    exit(); // Stop executing the script
                } else {
                    $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
                    $img_ex_lc = strtolower($img_ex);

                    if (in_array($img_ex_lc, $allowed_exs)) {
                        $new_img_name = uniqid("IMG-", true) . '.' . $img_ex_lc;
                        $img_upload_path = 'uploads/' . $new_img_name;
                        move_uploaded_file($tmp_name, $img_upload_path);

                        // INSERT INTO DATABASE
                        // Assuming $conn is your database connection and $user identifies the user
                        $sql = "UPDATE personaldetails SET image_url = CONCAT(image_url, ',', '$new_img_name')";
                        mysqli_query($conn, $sql);
                    }
                }
            }
        }
    }
}
$sql = "SELECT image_url FROM personaldetails";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $imageUrls = explode(',', $row["image_url"]); // Assuming image URLs are separated by commas
        foreach ($imageUrls as $imageUrl) {
            echo "<img src='uploads/$imageUrl' />";
            echo "<a href='uploads/$pdfName' target='_blank'>View PDF</a>";

        }
    }
} else {
    echo "No results";
}

?>

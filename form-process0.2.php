
<?php
include_once './config.php';
if (isset($_POST['submit'])) {

 
###########cv/resume
    // Assuming $_FILES['images'] is what you meant with $files2
    $num_of_imgs = count($_FILES['images']['name']);

    if ($num_of_imgs > 2) {
        $_SESSION['message'] = "you can't add more than 2 images";
        header("Location: document.php");
        exit;
    }

    $newImageNamesCV = []; // Initialize the array to store valid image names

    foreach ($_FILES['images']['name'] as $i => $name) {
        $image_name = $_FILES['images']['name'][$i];
        $tmp_name   = $_FILES['images']['tmp_name'][$i];
        $file_size = $_FILES['images']['size'][$i];
        $error      = $_FILES['images']['error'][$i];

        if ($error === 0) {
            if ($file_size > 5048576) {
                $_SESSION['message'] = "you can't upload files above 5MB";
            } else {
                $img_ex = pathinfo($image_name, PATHINFO_EXTENSION);
                $img_ex_lc = strtolower($img_ex);
                $allowed_exs = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc'];

                if (in_array($img_ex_lc, $allowed_exs)) {
                    $new_img_name = uniqid('IMG-', true) . '.' . $img_ex_lc;
                    $img_upload_path = 'uploads/' . $new_img_name;
                    move_uploaded_file($tmp_name, $img_upload_path);
                    // Assuming you want to collect the new image names if they're successfully processed
                    $newImageNamesCV[] = $new_img_name;
                } else {
                    $_SESSION['message'] = "File type not allowed";
                }
            }
        } else {
            $_SESSION['message'] = "Error uploading file";
        }
    }

    $num_of_imgs2 = count($_FILES['resume']['name']);

    if ($num_of_imgs2 > 5) {
        $_SESSION['message'] = "you can't add more than five images";
        header("Location: test4.php");
        exit;
    }

    // Then, process 'resume' similarly and add valid names to $newImageNamesEng
    $newImageNamesEng = []; // Initialize an array to store processed file names

    // No need to count files here since we're using foreach
    foreach ($_FILES['resume']['name'] as $i => $name) {
        $image_name2 = $_FILES['resume']['name'][$i];
        $tmp_name2   = $_FILES['resume']['tmp_name'][$i];
        $file_size2  = $_FILES['resume']['size'][$i];
        $error2      = $_FILES['resume']['error'][$i];

        // Correct variable usage for this specific file
        if ($error2 === 0) {
            if ($file_size2 > 5048576) { // 5MB in bytes
                $_SESSION['message'] = "you can't upload files above 5MB";
                // Consider breaking out of the loop or continuing to the next iteration
            } else {
                $img_ex2 = pathinfo($image_name2, PATHINFO_EXTENSION);
                $img_ex_lc2 = strtolower($img_ex2);
                $allowed_exs = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc'];

                if (in_array($img_ex_lc2, $allowed_exs)) {
                    $new_img_name2 = uniqid('k', true) . '.' . $img_ex_lc2;
                    $img_upload_path2 = 'uploads/' . $new_img_name2;
                    move_uploaded_file($tmp_name2, $img_upload_path2);

                    // Collect the new image name for potential batch insertion
                    $newImageNamesEng[] = $new_img_name2;
                } else {
                    $_SESSION['message'] = "File type not allowed";
                }
            }
        } else {
            $_SESSION['message'] = "Unknown Error Occurred while uploading";
            header("Location: index.php?error=$em");
            // Consider adding an exit here to stop script execution after redirection
            exit;
        }
    }
    $newImageNamesPass = []; // Initialize an array to store processed file names

    // No need to count files here since we're using foreach
    foreach ($_FILES['passport']['name'] as $i => $name) {
        $Pass_name = $_FILES['passport']['name'][$i];
        $tmp_pass   = $_FILES['passport']['tmp_name'][$i];
        $file_sizepass  = $_FILES['passport']['size'][$i];
        $errorpass      = $_FILES['passport']['error'][$i];

        // Correct variable usage for this specific file
        if ($error2 === 0) {
            if ($file_size2 > 5048576) { // 5MB in bytes
                $_SESSION['message'] = "you can't upload files above 5MB";
                // Consider breaking out of the loop or continuing to the next iteration
            } else {
                $img_ex2 = pathinfo($image_name2, PATHINFO_EXTENSION);
                $img_ex_lc2 = strtolower($img_ex2);
                $allowed_exs = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc'];

                if (in_array($img_ex_lc2, $allowed_exs)) {
                    $new_img_name2 = uniqid('k', true) . '.' . $img_ex_lc2;
                    $img_upload_path2 = 'uploads/' . $new_img_name2;
                    move_uploaded_file($tmp_name2, $img_upload_path2);

                    // Collect the new image name for potential batch insertion
                    $newImageNamesEng[] = $new_img_name2;
                } else {
                    $_SESSION['message'] = "File type not allowed";
                }
            }
        } else {
            $_SESSION['message'] = "Unknown Error Occurred while uploading";
            header("Location: index.php?error=$em");
            // Consider adding an exit here to stop script execution after redirection
            exit;
        }
    }

    $unid = md5(date('Ymdhis'));



    // Insert CV files
    foreach ($newImageNamesCV as $imgName) {
        $sanitizedImgName = mysqli_real_escape_string($conn, $imgName);
        $sql = "INSERT INTO files (uniqid, cv_res) VALUES ('$unid', '$sanitizedImgName')";
        if (!mysqli_query($conn, $sql)) {
            die("Error inserting CV file record: " . mysqli_error($conn));
        }
    }

    // Insert ENG files
    foreach ($newImageNamesEng as $imgName) {
        $sanitizedImgName = mysqli_real_escape_string($conn, $imgName);
        $sql = "INSERT INTO eng_files (uniqid, eng_res) VALUES ('$unid', '$sanitizedImgName')";
        if (!mysqli_query($conn, $sql)) {
            die("Error inserting ENG file record: " . mysqli_error($conn));
        }
    }
}

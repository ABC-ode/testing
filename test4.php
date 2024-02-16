<!-- <form action="upload_script.php" method="post" enctype="multipart/form-data">
    <input type="file" name="my_image1" />
    <input type="file" name="my_image2" />
    <input type="file" name="my_image3" />
    <input type="file" name="my_image4" />
    <input type="file" name="my_image5" />
    <button type="submit" name="submit">Upload</button>
</form> -->
<?php
// session_start();
?>
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Multiple Images</title>
</head>

<body>
    <?php
    if (isset($_SESSION['message'])) {
        echo  $_SESSION['message'];
    } ?>
    <h2>Upload Multiple Images</h2>
    <form action="form-process0.2.php" method="post" enctype="multipart/form-data">
        Select images to upload:
        <input type="file" name="images[]" id="images1" multiple>
        <br><br>
        <input type="file" name="resume[]" id="images2" multiple>
        <br><br>
        <input type="submit" value="Upload Images" name="submit">
    </form>
</body>

</html>
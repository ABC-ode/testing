<?php include_once './head.php';

// include_once './script1.php';

?>

<body class="skin-default fixed-layout">

    <div id="main-wrapper">


        <?php include_once './header.php' ?>

        <?php include_once './aside.php' ?>


        <div class="page-wrapper bg-light">

            <div class="container-fluid bg-light">
                <div class="row page-titles">
                <?php include_once './formnav.php' ?>
                </div>
                <form action="p_info-process.php" method="post" enctype="multipart/form-data">
                    <div class="row pt-3">
                        <div class="col-md-4">
                            <div class="card p-3">
                                <h3 class="card-title"> Personal details</h3>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="text" id="firstName" class="form-control" placeholder="firstname">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="text" id="firstName" class="form-control" placeholder="lastname">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input type="date" name="dob" class="form-control">
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input class="form-control" type="email" value="" placeholder="email" id="example-email-input">
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <select class="form-control custom-select">
                                            <option disabled selected>Gender</option>
                                            <option value="">Male</option>
                                            <option value="">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input class="form-control" type="tel" value="" id="example-tel-input" placeholder="phone">
                                    </div>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <select class="form-control">
                                        <option disabled selected>Country of birth </option>
                                        <?php $num = 1;
                                        $sql = $conn->query("SELECT * FROM countries");
                                        if ($sql->num_rows > 0) {
                                            while ($row = $sql->fetch_assoc()) {
                                                $id = $row['id'];
                                                $categoryName = $row['country_name'];
                                        ?>

                                                <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                        <?php }
                                        } ?>

                                    </select>
                                </div>
                                <div class="col-md-12 ">
                                    <div class="form-group">
                                        <input type="text" name="native" id="native" class="form-control" placeholder="what is your native language">
                                    </div>
                                </div>

                                <div class="col-md">
                                    <div class="form-group">
                                        <input type="text" name="passn" class="form-control" placeholder="Passport Name">
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class="form-group">
                                        <select class="form-control" name="issueloc">
                                            <option disabled selected>Issue location</option>
                                            <?php $num = 1;
                                            $sql = $conn->query("SELECT * FROM countries");
                                            if ($sql->num_rows > 0) {
                                                while ($row = $sql->fetch_assoc()) {
                                                    $id = $row['id'];
                                                    $categoryName = $row['country_name'];
                                            ?>

                                                    <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                            <?php }
                                            } ?>

                                        </select>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class="form-group">
                                        <input type="number" name="passnum" class="form-control" placeholder="Passport Number">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="date" name="issuedate" class="form-control" placeholder="issuedate">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="date" name="expdate" class="form-control" placeholder="Expiry Date">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card p-5">
                                <h3 class="card-title"> Permanent Address</h3>
                                <hr>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Country</label>
                                            <select class="form-control" name="birthcountry">
                                                <option disabled selected>Select a Category</option>
                                                <?php $num = 1;
                                                $sql = $conn->query("SELECT * FROM countries");
                                                if ($sql->num_rows > 0) {
                                                    while ($row = $sql->fetch_assoc()) {
                                                        $id = $row['id'];
                                                        $categoryName = $row['country_name'];
                                                ?>

                                                        <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                                <?php }
                                                } ?>

                                            </select>

                                        </div>
                                        <!--/span-->
                                    </div>
                                    <div class="col-md-4 ">
                                        <div class="form-group">
                                            <label>Address1</label>
                                            <input type="text" name="address1" class="form-control">
                                        </div>
                                    </div>


                                    <div class="col-md-4 ">
                                        <div class="form-group">
                                            <label>Address2</label>
                                            <input type="text" name="address2" class="form-control">
                                        </div>
                                    </div>


                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>City</label>
                                            <input type="text" name="city" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>State</label>
                                            <input type="text" name="state" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Post Code</label>
                                            <input type="text" name="postcode" class="form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card p-5">
                                <h3 class="card-title">Current Address</h3>
                                <hr>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Country</label>
                                            <select class="form-control" name="birthcountry">
                                                <option disabled selected>Select a Category</option>
                                                <?php $num = 1;
                                                $sql = $conn->query("SELECT * FROM countries");
                                                if ($sql->num_rows > 0) {
                                                    while ($row = $sql->fetch_assoc()) {
                                                        $id = $row['id'];
                                                        $categoryName = $row['country_name'];
                                                ?>

                                                        <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                                <?php }
                                                } ?>

                                            </select>

                                        </div>
                                        <!--/span-->
                                    </div>
                                    <div class="col-md-4 ">
                                        <div class="form-group">
                                            <label>Address1</label>
                                            <input type="text" name="address1" class="form-control">
                                        </div>
                                    </div>


                                    <div class="col-md-4 ">
                                        <div class="form-group">
                                            <label>Address2</label>
                                            <input type="text" name="address2" class="form-control">
                                        </div>
                                    </div>


                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>City</label>
                                            <input type="text" name="city" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>State</label>
                                            <input type="text" name="state" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Post Code</label>
                                            <input type="text" name="postcode" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-md-6"></div>
                                    <div class="col-md-6">
                                        <button type="submit" class="btn btn-success w-50" name="submit"> Save</button>
                                    </div>

                                </div>
                            </div>



                            <!-- <h3 class="card-title">Emergency contact details</h3>
                        <hr>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="control-label">FullName</label>
                                    <input type="text" name="sosname" class="form-control" placeholder="John doe">
                                    <small class="form-control-feedback"> This is inline help </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Phone</label>
                                    <input class="form-control" name="sosnum" type="tel" value="1-(555)-555-5555" id="example-tel-input">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input class="form-control" name="sosmail" type="email" value="bootstrap@example.com">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="control-label">relationship</label>
                                    <select class="form-control custom-select" name="relationship" data-placeholder="Choose a Category" tabindex="1">
                                        <option value="Category 1 disabled">-select-</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Spouse<">Spouse</option>
                                        <option value="Child">Child</option>

                                    </select>
                                </div>
                            </div> -->
                              <div class="row">
                            <div class="col-md-8"></div>
                            <div class="col-md-4">
                                <button type="submit" id="btn " class="btn w-100  btn-dark mb-2" name="submit"> continue to the next session</button>
                                <div class="col-md-6"></div>
                            </div>
                        </div>
                        </div>

                    </div>
            </div>
            </form>
        </div>
    </div>
    </div>

    </div>
  
    </div>
  
    <?php include_once './footer.php' ?>
    
                                            </div>  
    <?php include_once './script.php' ?>
</body>


</html>
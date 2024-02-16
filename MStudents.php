<?php include_once './head.php' ?>


<body class="skin-default fixed-layout">
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->

    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->
    <div id="main-wrapper">
        <!-- ============================================================== -->
        <!-- Topbar header - style you can find in pages.scss -->
        <!-- ============================================================== -->

        <?php include_once './header.php' ?>
        <!-- ============================================================== -->
        <!-- End Topbar header -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->

        <?php include_once './adaside.php' ?>

        <!-- ============================================================== -->
        <!-- End Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Page wrapper  -->
        <!-- ============================================================== -->
        <div class="page-wrapper">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <div class="container-fluid">

                <div class="row">
                    <div class="table-reponsive">
                    <h4>PERSONAL INFO</h4>
                        <table class="table">
                            <thead>
                                <tr>

                                    <th> Picture</th>
                                    <th>First Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>DOB:</th>
                                    <th>Gender</th>
                                    <th>Nationality</th>
                                    <th>Country of Birth</th>
                                    <th>native language</th>
                                    <th>Country of Birth</th>


                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $sql = $conn->query("SELECT * FROM personaldetails ");
                                if ($sql->num_rows > 0) {
                                    $row = $sql->fetch_assoc();
                                    // Assuming you might want to use $id in the future
                                    $id = $row['id'];
                                ?>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>



                                        <td>

                                        </td>
                                    </tr>
                                <?php } else { ?>
                                    <tr>
                                        <td colspan='6' class='text-danger'>No record found</td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="row">
                    <div class="table-reponsive">
                        <h4>PASSPORT INFO</h4>
                        <table class="table">
                            <thead>
                                <tr>

                                    <th>passport Name
                                    <th>
                                    <th>Passport Issue Location
                                    <th>
                                    <th>Passport Number</th>
                                    <th>Issue Date</th>
                                    <th>Expiry Date</th>



                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $sql = $conn->query("SELECT * FROM personaldetails ");
                                if ($sql->num_rows > 0) {
                                    $row = $sql->fetch_assoc();
                                    // Assuming you might want to use $id in the future
                                    $id = $row['id'];
                                ?>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td> </td>


                                        <td>

                                        </td>
                                    </tr>
                                <?php } else { ?>
                                    <tr>
                                        <td colspan='6' class='text-danger'>No record found</td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="row">
                    <div class="table-reponsive">
                        <h4>City of residence</h4>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>Post code</th>
                                    <th>Sindh</th>
                                    <th>State/ Territory of residence</th>
                                    <th>Karachi</th>

                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $sql = $conn->query("SELECT * FROM personaldetails ");
                                if ($sql->num_rows > 0) {
                                    $row = $sql->fetch_assoc();
                                    // Assuming you might want to use $id in the future
                                    $id = $row['id'];
                                ?>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td> </td>


                                        <td>

                                        </td>
                                    </tr>
                                <?php } else { ?>
                                    <tr>
                                        <td colspan='6' class='text-danger'>No record found</td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="row">
                    <div class="table-reponsive">
                    <h4>Emergency contact details</h4>
                        <table class="table">
                            <thead>
                                <tr>
                                  
                                    <th>Name</th>
                                    <th>Mobile number</th>
                                    <th>Email</th>
                                    <th>Relationship</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $sql = $conn->query("SELECT * FROM personaldetails ");
                                if ($sql->num_rows > 0) {
                                    $row = $sql->fetch_assoc();
                                    // Assuming you might want to use $id in the future
                                    $id = $row['id'];
                                ?>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td> </td>


                                        <td>

                                        </td>
                                    </tr>
                                <?php } else { ?>
                                    <tr>
                                        <td colspan='6' class='text-danger'>No record found</td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>

                </div>
                <a href="Mstudents2.php
                " class="btn btn-info btn-md px-5">view</a></td>
                       
            </div>
            <!-- ============================================================== -->
            <!-- End Container fluid  -->
            <!-- ============================================================== -->
        </div>
        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- footer -->
        <!-- ============================================================== -->
        <?php include_once './footer.php' ?>
        <!-- ============================================================== -->
        <!-- End footer -->
        <!-- ============================================================== -->
    </div>
    <!-- ============================================================== -->
    <!-- End Wrapper -->
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <?php include_once './script.php' ?>
</body>


</html>
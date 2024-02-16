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
                <div class="row page-titles">
                    <div class="col-md-5 align-self-center">
                        <h4 class="text-themecolor">Personal details</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th><h4>PERSONAL INFO</h4></th>
                                        <th>b</th>
                                        <th>b</th>
                                    </tr>
                                </thead>
                                <?php
                                $sql = $conn->query("SELECT * FROM personaldetails ");
                                if ($sql->num_rows > 0) {
                                    $row = $sql->fetch_assoc();
                                    // Assuming you might want to use $id in the future
                                    $id = $row['id'];
                                ?>

                                    <tr>
                                        <td>Picture:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>First Name:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Last Name:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Email:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Phone number:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>DOB:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Gender:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Nationality:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Country of Birth:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>What is your native language?:-</td>
                                        <td><br></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h4>PASSPORT INFO</h4>Name as it appears in passport:-
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Passport Issue Location:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Passport Number:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Issue Date:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Expiry Date:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>



                                        <td>
                                            <h4>PERMANENT ADDRESS</h4>
                                            Address 1:-
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Address 2:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Post code:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Sindh:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>State/ Territory:-</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>City:-</td>
                                        <td></td>
                                    </tr>

                                <?php
                                } else {
                                ?>
                                    <tr>
                                        <td colspan='6' class='text-danger'>No record found</td>
                                    </tr>
                                <?php
                                } // End of if-else
                                ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
<table class="table">
    <thead>
        <tr>

            <th>N/S</th>

        </tr>
    </thead>
    <tbody>
        <?php $num = 1;
        $sql = $conn->query("SELECT * FROM personaldetails ");
        if ($sql->num_rows > 0) {
            while ($row = $sql->fetch_assoc()) {
                $id = $row['id'];

        ?>

                <tr>
                    <td><?php echo $num++ ?></td>
                <?php } ?>

                </tr>

            <?php } else { ?>
                <tr>
                    <td colspan='6' class='text-danger'>No record found</td>
                </tr>
            <?php } ?>
    </tbody>

</table>

</html>
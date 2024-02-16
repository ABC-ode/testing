<?php include_once './head.php';
// include_once './script1.php';

?>


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
                        <h4 class="text-themecolor">Blank Page</h4>
                    </div>
                    
                </div>
                <!-- ============================================================== -->
                <!-- End Bread crumb and right sidebar toggle -->
                <!-- ============================================================== -->
                <!-- ============================================================== -->
                <!-- Start Page Content -->
                <!-- ============================================================== -->
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <?php echo isset($_SESSION['msg']) ? $_SESSION['msg'] : "" ?>
                                        <div class="table-reponsive">
                                            <table class="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>S/N</th>
                                                        <th>Fullname</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Registered Students</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php $num = 1;
                                                    $sql = $conn->query("SELECT * FROM register");
                                                    if ($sql->num_rows > 0) {
                                                        while ($row = $sql->fetch_assoc()) {
                                                            $uid = $row['userid'];
                                                    ?>
                                                            <tr>
                                                                <td><?php echo $num++ ?></td>
                                                                <td><?php echo $row['fullname'] ?></td>
                                                                <td><?php echo $row['email'] ?></td>
                                                                <td><?php echo $row['dphone'] ?></td>
                                                                <td>
                                                                    <a href="view.student.php?uid=<?php echo $uid ?>" class="btn btn-info btn-md px-5">view</a>
                                                                </td>



                                                                <td>
                                                                    <a href="controller.php?state=delete&uid=<?php echo $uid ?>" class="btn btn-danger btn-sm">Delete</a>

                                                                    <?php if ($row['dstatus'] == 'pending') { ?>
                                                                        <a href="controller.php?state=verify&uid=<?php echo $uid ?>" class="btn btn-success btn-sm">Verify</a>
                                                                    <?php } else { ?>
                                                                        <a href="javascript:void(0);" class="btn btn-primary btn-sm">Verified</a>
                                                                    <?php } ?>

                                                                    <?php if ($row['dstatus'] == 'active') { ?>
                                                                        <a href="controller.php?state=ban&uid=<?php echo $uid ?>" class="btn btn-warning btn-sm">Ban</a>
                                                                    <?php } else { ?>
                                                                        <a href="controller.php?state=unban&uid=<?php echo $uid ?>" class="btn btn-dark btn-sm">unBan</a>
                                                                        <?php } ?>
                                                                </td>
                                                            </tr>
                                                        <?php }
                                                    } else { ?>
                                                        <tr>
                                                            <td colspan='6' class='text-danger'>No record found</td>
                                                        </tr>
                                                    <?php } ?>
                                                </tbody>
                                            </table>
                                        </div>


                                    </div>

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
        <?php

        if (isset($_SESSION['msg'])) {
            unset($_SESSION['msg']);
        }
        ?>
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
    <script src="dist/js/sidebarmenu.js"></script>
</body>


</html>
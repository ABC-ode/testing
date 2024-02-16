<?php  include_once './head.php' ?>


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
    
    <?php  include_once './header.php' ?>
        <!-- ============================================================== -->
        <!-- End Topbar header -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
       
        <?php  include_once './aside.php' ?>

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
                <div class="col-lg-12">
    <div class="card">
        <form action="registerstudent-process.php" method="post" >
            <div class="card-body">
                <h4 class="card-title">register students</h4>
            <div class="form-body">
                <div class="card-body">
                    <div class="row pt-3">

                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">First Name</label>
                                <input type="text" id="firstName" name="firstname" class="form-control" placeholder="John doe">
                                <small class="form-control-feedback"> This is inline help </small>
                            </div>
                        </div>
                        <!--/span-->
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">LastName</label>
                                <input type="text" id="lastName" name="lastname" class="form-control" placeholder="John doe">
                                <small class="form-control-feedback"> This is inline help </small>
                            </div>
                        </div>
                        <!--/span-->
                    </div>
                    <!--/row-->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label">Gender</label>
                                <select class="form-control custom-select" name="gender" id="gender">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <small class="form-control-feedback"> Select your gender </small>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Email</label>
                                <input class="form-control" type="email" name="email" value="bootstrap@example.com" id="example-email-input">
                            </div>
                        </div>
                        <!--/span-->
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Phone</label>
                                <input class="form-control" type="tel" name="phone" value="1-(555)-555-5555" id="example-tel-input" >
                            </div>
                        </div>
                        <!--/span-->
                    </div>

                <div class="form-actions">
                    <div class="card-body">
                        <button type="submit" class="btn btn-info" > <i class="fa-check"></i>register</button>

                    </div>
                </div>
            </div>
        </form>
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


</html>


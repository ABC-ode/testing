<?php include_once './head.php' ?>


<body class="fixed-layout">
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

        <?php include_once './aside.php' ?>

        <!-- ============================================================== -->
        <!-- End Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Page wrapper  -->
        <!-- ============================================================== -->
        <div class="page-wrapper bg-light">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <div class="container-fluid bg-light">
                <div class="row page-titles">
                    <?php include_once './formnav.php' ?>
                </div>
                <div class="row ">
                    <div class="col-lg-12">
                        <div class="card">
                            <form action="r_info-process.php" method="post">
                                <div class="card-body d-flex">
                                    <h4 class="card-title">Reference Infomation</h4>
                                    <div class="col-md-8"> </div>
                                    <button type="submit" id="btn" class="btn   " name="submit">Add more</button>

                                </div>
                                <hr>
                                <div class="form-body">
                                    <div class="card-body">
                                        <div class="row pt-3">
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <input type="text" id="firstName" class="form-control" placeholder="Name">
                                                </div>
                                            </div>
                                            <!--/span-->
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <input type="text" id="firstName" class="form-control" placeholder="Postion">
                                                </div>
                                            </div>
                                            <!--/span-->
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <input type="text" id="title" class="form-control" placeholder="Title">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">

                                                    <input type="number" id="title" class="form-control" placeholder="How long has the person known you?">
                                                </div>
                                            </div>

                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <input class="form-control" type="email" id="example-email-input" placeholder="Work Email">
                                                </div>
                                            </div>
                                            <!--/span-->
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <input class="form-control" type="tel" id="example-tel-input" placeholder="Phone">
                                                </div>
                                            </div>


                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <select class="form-control custom-select" data-placeholder="Choose a Category" tabindex="1">
                                                        <option value="" disabled>relationship</option>
                                                        <option value="Category 1">Parent</option>
                                                        <option value="Category 2">Friend</option>
                                                        <option value="Category 3">Spouse</option>
                                                        <option value="Category 4">Child</option>
                                                        <option value="Category 4"></option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-4 ">
                                                <div class="form-group">
                                                    <input type="text" id="title" class="form-control" placeholder="name of Institution">
                                                </div>
                                            </div>



                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <input type="text" class="form-control" placeholder="Address of Institution">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
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

        </div>

        <?php include_once './footer.php' ?>

    </div>

    <?php include_once './script.php' ?>
</body>


</html><div class="col-md-3 mb-3 d-grid">
                        <button class="btn btn-danger remove_item_btn">remove</button>
                    </div>
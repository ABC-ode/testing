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

        <?php include_once './aside.php' ?>


        <div class="page-wrapper">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <div class="container-fluid">
                <div class="row page-titles">
                    <div class="col-md-5 align-self-center">
                        <h4 class="text-themecolor">Blank Page</h4>
                    </div>
                    <div class="col-md-7 align-self-center text-right">
                        <div class="d-flex justify-content-end align-items-center">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                                <li class="breadcrumb-item active">Blank Page</li>
                            </ol>
                            <button type="button" class="btn btn-info d-none d-lg-block m-l-15"><i class="fa fa-plus-circle"></i> Create New</button>
                        </div>
                    </div>
                </div>


                <div class="row ">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Documents</h4>
                                <h6 class="card-subtitle">
                                    Please upload a copy of the student's original documents. Accepted formats are PDF, DOC, DOCX, PNG, JPEG, and JPG. Maximum file size is 5MB.</h6>
                                <form class="m-b-30 m-t-40">
                                    <div class="row justify-content-center">
                                        <div class="col-sm-8 ">
                                            <div class="input-group">
                                                <select class="form-control js--animations">
                                                    <option value="bounce"> CV / Resume
                                                    </option>
                                                    <option value=" English test result"> English test result</option>
                                                    <option value="Passport copy">Passport copy</option>
                                                    <option value="transcript(s)">transcript(s)</option>
                                                    <option value=" Disability"> Disability</option>
                                                    <option value="EU settle / Pre Settled">EU settle / Pre Settled</option>
                                                    <option value=" Other certificates or diplomas"> Other certificates or diplomas</option>
                                                    <option value="Other documents">Other documents
                                                    </option>
                                                    <option value="Reference letter">Reference letter</option>
                                                    <option value="Statement of purpose">Statement of purpose</option>
                                                    <option value="UG Provisional / Degree">UG Provisional / Degree</option>
                                                    <option value=" PG Provisional / Degree"> PG Provisional / Degree</option>
                                                    <option value="Visa refusal">Visa refusal</option>
                                                    <option value=" Work experience certificate"> Work experience certificate</option>
                                                    <option value="Post Admission – BRP">Post Admission – BRP</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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


</html>
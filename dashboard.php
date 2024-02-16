<?php 
 basename($_SERVER['REQUEST_URI']);
include_once './head.php';

// die; 
// include_once './script1.php';

?>


<body class="">
    <div id="main-wrapper">
        <?php include_once './header.php';
        ?>
        <?php include_once './aside.php'; ?>

        <div class="page-wrapper">
            <div class="row">
                <div class="col-md-9">
                    <div class="container-fluid">
                        <div class="row  my-4  " id="lob">
                            <div class="col-md-12">
                                <h3>Welcome Back</h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia explicabo veritatis natus.</p>
                                <button id="btn" class="p-2 px-5">find expert</button>
                            </div>
                        </div>
                        <h3>Our Applicants</h3>
                        <div class="row" id="round">
                            <!-- Column -->
                            <div class="col-lg-6 col-md-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">NUMBER OF APPLICANT</h5>
                                        <div class="d-flex no-block align-items-center m-t-20 m-b-20">
                                            <div id="sparklinedash2"></div>

                                        </div>
                                    </div>
                                    <div id="sparkline8" class="sparkchart"></div>
                                </div>
                            </div>
                            <!-- Column -->
                            <div class="col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-body">

                                        <h5 class="card-title">SUCCESSFUL APPLICANT</h5>
                                        <div class="d-flex no-block align-items-center m-t-20 m-b-20">


                                        </div>
                                    </div>
                                    <div id="sparkline8" class="sparkchart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">TOTAL STUDENTS</h5>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="text-center">
                                                <input data-plugin="knob" data-width="90" data-height="90" data-angleOffset="290" data-linecap="round" data-fgColor="#4fc9bc" value="90" />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="sparkline8" class="sparkchart"></div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">YTD COMMISSIONS</h5>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="text-center">
                                                <input data-plugin="knob" data-width="90" data-height="90" data-angleOffset="290" data-linecap="round" data-fgColor="#4fc9bc" value="100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="sparkline8" class="sparkchart"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-md-3 bg-light px-3">
                    <div class="my-4 p-5 greenbar">
                    </div>
                    <a href="userstudents.php">
                        <div class="application bg-dark my-3  rounded-lg">
                            <span></span>
                            <p class="p-2 pl-5 text-light"> <i class="mdi mdi-library-plus"></i>  Create New Application</p>
                        </div>
                    </a>
                    <h4 class="my-5">Projected Commisions</h4>
                    <div class="commisions bg-light my-2 p-5">

                        <div class="row">

                            <div class="col">
                               
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php //include_once './footer.php'
        ?>

        <?php include_once './script.php' ?>
        <script src="assets/node_modules/knob/jquery.knob.js"></script>
        <script>
            $(function() {
                $('[data-plugin="knob"]').knob();
            });
        </script>
</body>


</html>
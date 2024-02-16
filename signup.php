<?php  include_once './head.php' ?>


<body class="skin-default card-no-border">

        <section id="wrapper">
        <div class="login-register" style="background-image:url(../assets/images/background/login-register.jpg);" >
            <div class="login-box card ">
                <div class="card-body">
                    <form class="form-horizontal form-material"  action="register-process.php" method="post">
                        <h3 class="text-center m-b-20">Sign Up</h3>
                        <div class="form-group">
                            <div class="col-xs-12">
                                <input class="form-control" type="text" 
                                name="fname"
                                required="" placeholder="Name">
                            </div>
                        </div>
                        <div class="form-group ">
                            <div class="col-xs-12">
                                <input class="form-control"
                                name="email" type="text" required="" placeholder="Email">
                            </div>
                        </div>
                        <div class="form-group ">
                            <div class="col-xs-12">
                                <input class="form-control"
                                name="phone" type="phone" required="" placeholder="Phone">
                            </div>
                        </div>
                        <div class="form-group ">
                            <div class="col-xs-12">
                                <input class="form-control" type="password" 
                                name="pass"
                                required="" placeholder="Password">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-12">
                                <input class="form-control" 
                                name="cpass"
                                type="password" required="" placeholder="Confirm Password">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-md-12">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                                    <label class="custom-control-label" for="customCheck1">I agree to all <a href="javascript:void(0)">Terms</a></label> 
                                </div> 
                            </div>
                        </div>
                        <div class="form-group text-center p-b-20">
                            <div class="col-xs-12">
                                <button class="btn btn-info btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light" type="submit">Sign Up</button>
                            </div>
                        </div>
                        <div class="form-group m-b-0">
                            <div class="col-sm-12 text-center">
                                Already have an account? <a href="signin.php" class="text-info m-l-5"><b>Sign In</b></a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
            <!-- ============================================================== -->
            <!-- End Container fluid  -->
            <!-- ============================================================== -->
      
        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- footer -->
    
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
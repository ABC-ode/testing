<?php include_once './head.php' ?>


<body class="skin-default fixed-layout">

    <div id="main-wrapper">

        <?php include_once './header.php' ?>


        <?php include_once './aside.php' ?>

        <?php include_once './head.php' ?>


        <body class="fixed-layout">

            <div id="main-wrapper">


                <?php include_once './header.php' ?>

                <?php include_once './aside.php' ?>
                <div class="page-wrapper bg-light">

                    <div class="container-fluid bg-light">
                        <div class="row page-titles">
                            <?php include_once './formnav.php' ?>

                        </div>
                        <div class="row ">
                            <div class="col-lg-12">
                                <div class="card">
                                    <form action="em_info-process.php" method="post">
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
                                                            <label class="control-label">Job title</label>
                                                            <input type="text" id="firstName" class="form-control" placeholder="manager">
                                                        </div>
                                                    </div>
                                                    <!--/span-->
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label class="control-label">Name of Organisation</label>
                                                            <input type="text" id="NOrg" name="NOrg" class="form-control" placeholder="">
                                                        </div>
                                                    </div>
                                                    <!--/span-->

                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label for="example-date-input" class="form-label">From date</label>
                                                            <input class="form-control" type="date" value="2011-08-19" id="example-date-input">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <label class="control-label">Organisation phone number</label>
                                                            <input class="form-control" type="tel" name="phone" id="example-tel-input" placeholder="">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-8">
                                                        <div class="form-group">
                                                            <label class="control-label">Address of Organisation</label>
                                                            <input type="text" id="Address of Organisation" name="ressorg" class="form-control" placeholder="Address of Organisation">
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

    </div>

    <?php include_once './footer.php' ?>
    </div>

    <?php include_once './script.php' ?>
</body>


</html>
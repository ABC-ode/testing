<?php include_once './head.php' ?>


<body class="skin-default fixed-layout">
    <div id="main-wrapper">


        <?php include_once './header.php' ?>


        <?php include_once './aside.php' ?>


        <div class="page-wrapper bg-light">
            <!-- Container fluid  -->
            <div class="container-fluid bg-light">
                <div class="row page-titles">
                    <div class="col-md-5 align-self-center">
                        <h4 class="text-themecolor">
                            <?php include_once './formnav.php' ?>
                        </h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <form action="e_info-process.php" method="post">
                            <div class="card-body">
                                <h4 class="card-title">Education</h4>
                            </div>
                            <div class="form-body">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <div class="card p-5 rounded">
                                                    <label>Destination Country</label>
                                                    <hr>
                                                    <select class="form-control" name="country">
                                                        <option disabled selected>Select a Category</option>
                                                        <?php $num = 1;
                                                        $sql = $conn->query("SELECT * FROM countries");
                                                        if ($sql->num_rows > 0) {
                                                            while ($row = $sql->fetch_assoc()) {
                                                                $id = $row['id'];
                                                                $categoryName = $row['country_name'];

                                                                echo "<option value='" . $id . "|" . $categoryName . "'>" . $categoryName . "</option>";
                                                        ?>
                                                        <?php }
                                                        } ?>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">Other Language and Standardised Exam Scores</h5>
                                                    <hr>
                                                    <p class="card-text">
                                                        Have you appeared for any other test (Example GRE, GMAT
                                                        and SAT)?.</p>
                                                    <button onclick="handleYes()" class="btn btn-success">Yes</button>
                                                    <button onclick="handleNo()" class="btn btn-danger">No</button>
                                                    <hr>
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group">
                                                                <label>Level of Study</label>
                                                                <input class="form-control" name="level">
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>Discipline</label>
                                                                <input type="text" class="form-control" name="discipline">
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>programme</label>
                                                                <input type="text" class="form-control" name="discipline">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card p-3">
                                                <div class="card-body">
                                                    <h5 class="card-title">English Language and Standardised Exam Scores</h5>
                                                    <p class="card-text">Have you appeared for any English language test in the last two years?</p>
                                                    <button onclick="handleYes()" class="btn btn-success">Yes</button>
                                                    <button onclick="handleNo()" class="btn btn-danger">No</button>
                                                    <hr>
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="form-group">
                                                                <label>Level of Study</label>
                                                                <input class="form-control" name="level">
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>Discipline</label>
                                                                <input type="text" class="form-control" name="discipline">
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="form-group">
                                                                <label>programme</label>
                                                                <input type="text" class="form-control" name="discipline">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card p-5 rounded">
                                                <h4>Academic Interest</h4>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>Level of Study</label>
                                                            <input class="form-control" name="level">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>Discipline</label>
                                                            <input type="text" class="form-control" name="discipline">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>programme</label>
                                                            <input type="text" class="form-control" name="discipline">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>Location</label>
                                                            <select class="form-control" name="categories">
                                                                <option disabled selected>Select a location</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <div class="form-group">
                                                            <label>Start date</label>
                                                            <div class="form-group row">

                                                                <div class="col-12">
                                                                    <input class="form-control" type="month" value="2011-08" id="example-month-input">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <div class="card p-3 rounded">
                                            <label>Destination Country</label>
                                            <hr>
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label for="country">country</label>
                                                        <select class="form-control" name="country">
                                                            <option disabled selected>Select a Category</option>
                                                            <?php $num = 1;
                                                            $sql = $conn->query("SELECT * FROM countries");
                                                            if ($sql->num_rows > 0) {
                                                                while ($row = $sql->fetch_assoc()) {
                                                                    $id = $row['id'];
                                                                    $categoryName = $row['country_name'];

                                                                    echo "<option value='" . $id . "|" . $categoryName . "'>" . $categoryName . "</option>";
                                                            ?>
                                                            <?php }
                                                            } ?>
                                                        </select>
                                                    </div>

                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label>Course</label>
                                                            <select type="text" name="course" class="form-control"></select>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label>Institution</label>
                                                            <select name="institution" id="city" class="form-control"></select>
                                                        </div>
                                                    </div>
                                                    <!-- <div class="col-md-3">
                                                    <div class="form-group">
                                                        <label>Undergraduate</label>
                                                        <select class="form-control" name="graduate">
                                                            <option disabled selected>Select a Discipline</option>
                                                        </select>
                                                    </div>
                                                </div> -->
                                                    <div class="col-md-3">
                                                        <div class="form-group">
                                                            <label>level of study</label>
                                                            <select class="form-control" name="program">
                                                                <option disabled selected>Select a level</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-12">
                                                        <div class="form-group row">
                                                            <div class="col-md-3">
                                                                <label for="example-date-input" class="form-label">State date</label>
                                                                <input class="form-control" type="date" value="2011-08-19" id="example-date-input">
                                                            </div>
                                                            <div class="col-md-3">
                                                                <label for="example-date-input" class="form-label">End Date</label>
                                                                <input class="form-control" type="date" value="2011-08-19" id="example-date-input">
                                                            </div>
                                                            <div class="col-3">
                                                                <div class="form-group">
                                                                    <label>Result info</label>
                                                                    <input type="number" class="form-control" name="rinfo" id="">
                                                                </div>
                                                            </div>
                                                            <div class="col-3">
                                                                <div class="form-group">
                                                                    <label>Result info- G</label>
                                                                    <input type="number" name="code" class="form-control" id="">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <!-- <div class="form-group row">
                                            <h6></h6>

                                            
                                            <div class="col-md-3">
                                                <div class="radio-list">
                                                    <div class="custom-control custom-radio">
                                                        <input type="radio" id="customRadio4" name="customRadio2" class="custom-control-input">
                                                        <label class="custom-control-label" for="customRadio4">Yes</label>
                                                    </div>
                                                    <div class="custom-control custom-radio">
                                                        <input type="radio" id="customRadio3" name="customRadio2" class="custom-control-input">
                                                        <label class="custom-control-label" for="customRadio3">No</label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> -->


                                            <!-- <div class="col-md-3">
                                                <div class="radio-list">
                                                    <div class="col-md-12">
                                                        <div class="custom-control custom-radio">
                                                            <input type="radio" id="customRadio6" name="customRadio7" class="custom-control-input">
                                                            <label class="custom-control-label" for="customRadio6">yes</label>
                                                        </div>
                                                        <div class="custom-control custom-radio">
                                                            <input type="radio" id="customRadio5" name="customRadio7" class="custom-control-input">
                                                            <label class="custom-control-label" for="customRadio5">None</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> -->

                                        </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                  
                        <div class="col-md-6"></div>
                        <div class="col-md-6">
                            <button type="submit" id="btn " class="btn w-100  btn-dark mb-2" name="submit"> continue to the next session</button>
                            <div class="col-md-6"></div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
     
    </div>
    
    <?php include_once './footer.php' ?>
    
    </div>
  
    <?php include_once './script.php' ?>
</body>


</html>
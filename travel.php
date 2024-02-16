<?php include_once './head.php' ?>

<body class="skin-default fixed-layout">
    <style>
        label {
            font-weight: 50px;
        }

        h4 {
            font-weight: 500;
        }

        .h4 {
            font-weight: 900;
            color: green;

        }
    </style>
    
    <div id="main-wrapper">


        <?php include_once './header.php' ?>
    
        <?php include_once './aside.php' ?>

      
        <div class="page-wrapper bg-light">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <div class="container-fluid  bg-light">
                <div class="row page-titles">

                    <?php include_once './formnav.php' ?>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <form action="t_info-process.php" method="post">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">Travel History</h5>
                                                <hr>
                                                <p class="card-text">
                                                    Has this student applied for permission to remain in any countries in the past ten years?</p>

                                                <div class="row">

                                                    <div class="col-md-4 ">
                                                        <div class="form-group">
                                                            <input type="text" name="DOA" class="form-control" placeholder="Date of arrival">
                                                        </div>
                                                    </div>


                                                    <div class="col-md-4 ">
                                                        <div class="form-group">
                                                            <input type="text" name="DOD" class="form-control" placeholder="Date of departure">
                                                        </div>
                                                    </div>


                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <input type="text" name="VSD" class="form-control" placeholder="Visa Start Date">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <input type="text" name="purpose" class="form-control" placeholder="purpose of visit">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <select class="form-control" name="birthcountry">
                                                                <option disabled selected>country</option>
                                                                <?php $num = 1;
                                                                $sql = $conn->query("SELECT * FROM countries");
                                                                if ($sql->num_rows > 0) {
                                                                    while ($row = $sql->fetch_assoc()) {
                                                                        $id = $row['id'];
                                                                        $categoryName = $row['country_name'];
                                                                ?>

                                                                        <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                                                <?php }
                                                                } ?>

                                                            </select>

                                                        </div>
                                                        <!--/span-->
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <select class="form-control" name="birthcountry">
                                                                <option disabled selected>Visa type </option>
                                                                <?php $num = 1;
                                                                $sql = $conn->query("SELECT * FROM countries");
                                                                if ($sql->num_rows > 0) {
                                                                    while ($row = $sql->fetch_assoc()) {
                                                                        $id = $row['id'];
                                                                        $categoryName = $row['country_name'];
                                                                ?>

                                                                        <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                                                <?php }
                                                                } ?>

                                                            </select>

                                                        </div>
                                                        <!--/span-->
                                                    </div>
                                                    <div class="col-md-6"></div>
                                                    <div class="col-md-6">
                                                        <button type="submit" class="btn btn-success w-50" name="submit"> Save</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">Travel History</h5>
                                                <hr>
                                                <p class="card-text">
                                                    Has this student applied for permission to remain in any countries in the past ten years?</p>

                                            </div>
                                        </div>
                                    </div>
                           
                               
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">Travel History</h5>
                                                <hr>
                                                <p class="card-text">
                                                    Has this student applied for permission to remain in any countries in the past ten years?</p>

                                                <div class="row">

                                                    <div class="col-md-4 ">
                                                        <div class="form-group">
                                                            <input type="text" name="DOA" class="form-control" placeholder="Date of arrival">
                                                        </div>
                                                    </div>


                                                    <div class="col-md-4 ">
                                                        <div class="form-group">
                                                            <input type="text" name="DOD" class="form-control" placeholder="Date of departure">
                                                        </div>
                                                    </div>


                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <input type="text" name="VSD" class="form-control" placeholder="Visa Start Date">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <input type="text" name="purpose" class="form-control" placeholder="purpose of visit">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <select class="form-control" name="birthcountry">
                                                                <option disabled selected>country</option>
                                                                <?php $num = 1;
                                                                $sql = $conn->query("SELECT * FROM countries");
                                                                if ($sql->num_rows > 0) {
                                                                    while ($row = $sql->fetch_assoc()) {
                                                                        $id = $row['id'];
                                                                        $categoryName = $row['country_name'];
                                                                ?>

                                                                        <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                                                <?php }
                                                                } ?>

                                                            </select>

                                                        </div>
                                                        <!--/span-->
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="form-group">
                                                            <select class="form-control" name="birthcountry">
                                                                <option disabled selected>Visa type </option>
                                                                <?php $num = 1;
                                                                $sql = $conn->query("SELECT * FROM countries");
                                                                if ($sql->num_rows > 0) {
                                                                    while ($row = $sql->fetch_assoc()) {
                                                                        $id = $row['id'];
                                                                        $categoryName = $row['country_name'];
                                                                ?>

                                                                        <option value="<?php echo $categoryName; ?>"><?php echo $categoryName; ?></option>
                                                                <?php }
                                                                } ?>

                                                            </select>

                                                        </div>
                                                        <!--/span-->
                                                    </div>
                                                    <div class="col-md-6"></div>
                                                    <div class="col-md-6">
                                                        <button type="submit" class="btn btn-success w-50" name="submit"> Save</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                            <div class="col-md-8"></div>
                            <div class="col-md-4">
                                <button type="submit" id="btn " class="btn w-100  btn-dark mb-2" name="submit"> continue to the next session</button>
                                <div class="col-md-6"></div>
                            </div>
                        </div>
                    </form>
            </div>
        </div>  
        <?php include_once './footer.php' ?>
                    <script>
                        $(function() {
                            // Switchery
                            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
                            $('.js-switch').each(function() {
                                new Switchery($(this)[0], $(this).data());
                            });
                            // For select 2
                            $(".select2").select2();
                            $('.selectpicker').selectpicker();
                            //Bootstrap-TouchSpin
                            $(".vertical-spin").TouchSpin({
                                verticalbuttons: true
                            });
                            var vspinTrue = $(".vertical-spin").TouchSpin({
                                verticalbuttons: true
                            });
                            if (vspinTrue) {
                                $('.vertical-spin').prev('.bootstrap-touchspin-prefix').remove();
                            }
                            $("input[name='tch1']").TouchSpin({
                                min: 0,
                                max: 100,
                                step: 0.1,
                                decimals: 2,
                                boostat: 5,
                                maxboostedstep: 10,
                                postfix: '%'
                            });
                            $("input[name='tch2']").TouchSpin({
                                min: -1000000000,
                                max: 1000000000,
                                stepinterval: 50,
                                maxboostedstep: 10000000,
                                prefix: '$'
                            });
                            $("input[name='tch3']").TouchSpin();
                            $("input[name='tch3_22']").TouchSpin({
                                initval: 40
                            });
                            $("input[name='tch5']").TouchSpin({
                                prefix: "pre",
                                postfix: "post"
                            });
                            // For multiselect
                            $('#pre-selected-options').multiSelect();
                            $('#optgroup').multiSelect({
                                selectableOptgroup: true
                            });
                            $('#public-methods').multiSelect();
                            $('#select-all').click(function() {
                                $('#public-methods').multiSelect('select_all');
                                return false;
                            });
                            $('#deselect-all').click(function() {
                                $('#public-methods').multiSelect('deselect_all');
                                return false;
                            });
                            $('#refresh').on('click', function() {
                                $('#public-methods').multiSelect('refresh');
                                return false;
                            });
                            $('#add-option').on('click', function() {
                                $('#public-methods').multiSelect('addOption', {
                                    value: 42,
                                    text: 'test 42',
                                    index: 0
                                });
                                return false;
                            });
                            $(".ajax").select2({
                                ajax: {
                                    url: "https://api.github.com/search/repositories",
                                    dataType: 'json',
                                    delay: 250,
                                    data: function(params) {
                                        return {
                                            q: params.term, // search term
                                            page: params.page
                                        };
                                    },
                                    processResults: function(data, params) {
                                        // parse the results into the format expected by Select2
                                        // since we are using custom formatting functions we do not need to
                                        // alter the remote JSON data, except to indicate that infinite
                                        // scrolling can be used
                                        params.page = params.page || 1;
                                        return {
                                            results: data.items,
                                            pagination: {
                                                more: (params.page * 30) < data.total_count
                                            }
                                        };
                                    },
                                    cache: true
                                },
                                escapeMarkup: function(markup) {
                                    return markup;
                                }, // let our custom formatter work
                                minimumInputLength: 1,
                                //templateResult: formatRepo, // omitted for brevity, see the source of this page
                                //templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
                            });
                        });
                    </script>
                                    

                    <?php include_once './script.php' ?>

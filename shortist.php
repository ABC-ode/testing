<?php include_once './head.php' ?>


<body class="skin-default fixed-layout">
    <div id="main-wrapper">
        <?php include_once './header.php' ?>
        <?php include_once './aside.php' ?>

        <div class="page-wrapper bg-light">
            <div class="container-fluid bg-light">
                <div class="row page-titles">
                    <?php include_once './formnav.php' ?>
                </div>

                <div class="row">
                    <div class="col-md-3 mb-3 d-grid">
                        <button class="btn btn-success add_item_btn">add more</button>
                    </div>
                    <div id="show_alert"></div>
                    <form action="#" method="post" id="add_form">
                    <div class="col-lg-12">
                        <div id="show_item">
                            <div class="card">
                               
                                    <div class="card-body">
                                        <h4 class="card-title">Choice 2</h4>
                                    </div>

                                    <div class="form-body">
                                        <div class="card-body">

                                            <div class="row ">
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Country</label>
                                                        <select name="product_name[]" class="form-control" placeholder="item name" required>
                                                            <option disabled selected>Select a Category</option>
                                                            <?php $num = 1;
                                                            $sql = $conn->query("SELECT * FROM country");
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
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>City</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a City</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Discipline</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a Discipline</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Program type</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a program</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Degree Awards</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a Awards</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>Universities</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a university</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>Intake</label>
                                                        <div class="form-group row">

                                                            <input class="form-control" type="month" value="2011-08" id="example-month-input">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>Course link(if avaliable)</label>
                                                        <input class="form-control" type="url" value="" id="example-url-input">
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>course code (optional)</label>
                                                        <input type="number" class="form-control" name="code" id="">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                            </div>
                        </div>
                    </div>
                    <div class="col-4 ">
                        <input type="submit" value="Add" class="btn btn-info w-100" id="add_btn">
                    </div>
                </div>
                </form>
                <!-- <div class="card-body">
                    <div id="show_alert"></div>
                    <form action="#" method="post" id="add_form">
                        <div id="show_item">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <input type="text" name="product_name[]" class="form-control" placeholder="item name" required>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <input type="number" name="product_price[]" class="form-control" placeholder="item price" required>
                                </div>
                                <div class="col-md-2 mb-3">
                                    <input type="number" name="product_qty[]" class="form-control" placeholder="item quantity" required>
                                </div>

                            </div>

                        </div>
                    </form>
                </div> -->
            </div>
        </div>
    </div>
    </div>
    </div>

    <?php include_once './footer.php' ?>
    </div>
    <script src="assets/node_modules/jquery/jquery-3.2.1.min.js"></script>
    <script>
        $(document).ready(function() {
            $(".add_item_btn").click(function(e) {
                e.preventDefault();
                $("#show_item").prepend(`
                <div class="row append_item">
                <div class="card">
                            <div id="show_alert"></div>
                            
                                <div class="card-body">
                                    <h4 class="card-title">Choice 2</h4>
                                </div>
                                
                                <div class="form-body">
                                    <div class="card-body">
                                      
                                            <div class="row pt-3">
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Country</label>
                                                        <select name="product_name[]" class="form-control" placeholder="item name" required>
                                                            <option disabled selected>Select a Category</option>
                                                            <?php $num = 1;
                                                            $sql = $conn->query("SELECT * FROM country");
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
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>City</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a City</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Discipline</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a Discipline</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Program type</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a program</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    <div class="form-group">
                                                        <label>Degree Awards</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a Awards</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>Universities</label>
                                                        <select class="form-control" name="categories">
                                                            <option disabled selected>Select a university</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>Intake</label>
                                                        <div class="form-group row">

                                                                <input class="form-control" type="month" value="2011-08" id="example-month-input">
                                                            </div>
                                                        </div>
                                                    </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>Course link(if avaliable)</label>
                                                            <input class="form-control" type="url" value="" id="example-url-input">
                                                        </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label>course code (optional)</label>
                                                        <input type="number" class="form-control" name="code" id="">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-4 ">
                                    <button class="btn btn-danger w-100 remove_item_btn">remove</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                </div>`)
            });

            $(document).on('click', '.remove_item_btn', function(e) {
                e.preventDefault();
                let row_item = $(this).parent().parent();
                $(row_item).remove();
            });

            //ajax
            $('#add_form').submit(function(e) {
                e.preventDefault();
                $("#add_btn").val('Adding..');
                $.ajax({
                    url: 'action.php',
                    method: 'post',
                    data: $(this).serialize(),
                    success: function(response) {
                        $("#add_btn").val('Add');
                        $("#add_form")[0].reset();
                        $(".append_item").remove();
                        $("#show_alert").html(`<div class="alert alert-success" role="alert">${response}</div>"`);

                    }
                });
            });
        });
    </script>
</body>

</html>
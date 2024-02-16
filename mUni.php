<!DOCTYPE html>
<html lang="en">
<?php
include_once './head.php';

?>

<body class="skin-default fixed-layout">

    <div id="main-wrapper">

        <?php
        include_once './header.php';
        include_once './adaside.php';
        ?>
        <!-- ============================================================== -->
        <!-- End Left Sidebar - style you can find in sidebar.scss  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Page wrapper  -->
        <!-- ============================================================== -->
        <div class="page-wrapper">
            <!-- ============================================================== -->
            <!-- Container fluid  -->
            <!-- ============================================================== -->
            <div class="container-fluid">
                <div class="row page-titles">
                    <div class="col-md-5 align-self-center">
                        <h4 class="text-themecolor">Manage Universities</h4>
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

                <form action="muni-process.php" method="post" class="form-horizontal form-bordered">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <br>
                                <br>

                                <?php
                                if (isset($_SESSION['message'])) {


                                    echo  $_SESSION['message'];
                                } ?>
                                <div class="card-body m-5">
                                    <div class="form-body">
                                        <div class="form-group row">
                                            <label class="control-label text-right col-md-3">
                                                manage cities
                                            </label>
                                            <div class="col-md-9">
                                                <div class="form-group">
                                                    
                                                    <select class="form-control" name="city">
                                                        <option disabled selected>Select a Cities</option>
                                                        <?php $num = 1;
                                                        $sql = $conn->query("SELECT * FROM cities");
                                                        if ($sql->num_rows > 0) {
                                                            while ($row = $sql->fetch_assoc()) {
                                                                $id = $row['id'];
                                                                $categoryName = $row['city'];
                                                                echo "<option value='" . $id . "|" . $categoryName . "'>" . $categoryName . "</option>";
                                                        ?>

                                                            
                                                        <?php }
                                                        } ?>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="control-label text-right col-md-3">
                                                manage universities
                                            </label>
                                            <div class="col-md-9">
                                                <input type="text" name="uni" placeholder="universities" class="form-control">
                                            </div>
                                        </div>

                                    </div>

                                    <div class="form-actions">
                                        <div class="row ">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="offset-sm-3 col-md-9">
                                                        <button type="submit" name="saveForm" class="btn btn-success"> <i class="fa fa-check"></i> Submit</button>
                                                        <button type="button" class="btn btn-inverse">Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>N/S</th>
                                                <th>city id</th>   
                                                <th>Cities</th>
                                                <th>universities</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                        <tbody>
                            <?php $num = 1;
                            $sql = $conn->query("SELECT * FROM universities ");
                            if ($sql->num_rows > 0) {
                                while ($row = $sql->fetch_assoc()) {
                                    $id = $row['id'];
                            ?>
                                    <tr>
                                        <td><?php echo $num++ ?></td>
                                        <td><?php echo $row['city_id'] ?></td>            <td><?php echo $row['cities'] ?></td>
                                        <td><?php echo $row['uni'] ?></td>

                                        <td>


                                            <button type="button" data-toggle="modal" data-target="#editmodal1<?php echo $id ?>" class="btn btn-danger btn-sm editbtn">delete</button>

                                            <div class="modal" id="editmodal1<?php echo $id ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-body">

                                                            <form action="controls.php?state=delete&id=<?php echo $id ?>" method="post">
                                                                <div class="mx-5 mt-5">
                                                                    <h4>Are you sure you want to delete this category?</h4>
                                                                </div>

                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">no</button>
                                                            <button type="submit" class="btn btn-danger" name="update">yes</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="button" data-toggle="modal" data-target="#editmodal<?php echo $id ?>" class="btn btn-info btn-sm editbtn">edit
                                            </button>

                                            <div class="modal" id="editmodal<?php echo $id ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="exampleModalLabel">Edit categories</h5>
                                                            <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                        </div>
                                                        <div class="modal-body">

                                                            <form action="update-process.php" method="post">

                                                                <input type="text" name="categories" value="<?php echo $row['categories']; ?>" class="form-control" placeholder="insert it here">
                                                                <input type="hidden" name="id" value="<?php echo $id ?>">

                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                            <button type="submit" class="btn btn-primary" name="update">update</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        <?php } ?>
                                        </td>


                                        <!-- <td><span class="label label-danger">admin</span> </td> -->
                                    </tr>

                                <?php } else { ?>
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

        <!-- ============================================================== -->
        <!-- End PAge Content -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- Right sidebar -->
        <!-- ============================================================== -->
        <!-- End Right sidebar -->
        <!-- ============================================================== -->

        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <!-- ============================================================== -->
        <!-- ============================================================== -->
        <!-- footer -->
        <?php

        if (isset($_SESSION['message'])) {
            unset($_SESSION['message']);
        }
        ?>
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
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="dist/js/sidebarmenu.js"></script>
</body>

<!-- Mirrored from eliteadmin.themedesigner.in/demos/bt4/inverse/form-layout.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 07 Dec 2020 09:59:00 GMT -->

</html
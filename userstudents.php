<?php include_once './head.php';
    // $user = $_SESSION['userid']; 


// die;

?>


<body class="skin-default fixed-layout">
   
    <div id="main-wrapper">
     
        <?php include_once './header.php' ?>
       

        <?php include_once './aside.php' ?>

     
        <div class="page-wrapper">
         
            <div class="container-fluid">
                <div class="row page-titles bg-transparent">
                    <div class="col-md-5 align-self-center">
                        <h2 class="text-themecolor"><b>Students List</b></h2>
                    </div>
                    <div class="col-md-7 align-self-center text-right">
                        <div class="d-flex justify-content-end align-items-center">
                           
                            <a href="registerstudent.php"> <button type="button" class="btn btn-dark d-none d-lg-block m-l-15"><i class="mdi mdi-library-plus"></i>Add student</button></a>

                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <?php echo isset($_SESSION['msg']) ? $_SESSION['msg'] : "" ?>
                                        <div class="table-reponsive">
                                            <table class="table  table-hover  ">
                                                <thead>
                                                    <tr class="tr">
                                                        <th>S/N</th>
                                                        <th>student id</th>
                                                        <th>Firstname</th>
                                                        <th>lastName</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>
                                                            <center>Action</center>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php $num = 1;
                                                    $sql = $conn->query("SELECT * FROM registerstudent WHERE userid = 
                                                    '$user' ");
                                                    if ($sql->num_rows > 0) {
                                                        while ($row = $sql->fetch_assoc()) {
                                                            $uid = $row['student_id'];
                                                    ?>
                                                            <tr>
                                                                <td><?php echo $num++ ?></td>
                                                                <td><?php echo $row['student_id'] ?></td>
                                                                <td><?php echo $row['dfname'] ?></td>
                                                                <td><?php echo $row['dlname'] ?></td>
                                                                <td><?php echo $row['email'] ?></td>
                                                                <td><?php echo $row['dphone'] ?></td>

                                                                <td>
                                                                    <center>
                                                                        <a href="create-student.php" class="btn btn-info btn-md px-5">Apply</a>

                                                                        <a href="userstudentcontroller.php?state=delete&uid=<?php echo $uid ?>" class="btn btn-danger btn-md px-5">Delete</a>
                                                                    </center>
                                                                <?php } ?>
                                                                </td>

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

            </div>
            <!-- ============================================================== -->
            <!-- End Container fluid  -->
            <!-- ============================================================== -->
        </div>
        <!-- ============================================================== -->
        <!-- End Page wrapper  -->
        <?php

        if (isset($_SESSION['msg'])) {
            unset($_SESSION['msg']);
        }
        ?>
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
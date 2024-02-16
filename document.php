<?php include_once './head.php' ?>


<body class="skin-default fixed-layout">

    <div id="main-wrapper">

        <?php include_once './header.php' ?>


        <?php include_once './aside.php' ?>

        <?php include_once './head.php' ?>


        <body class="fixed-layout">

            <div id="main-wrapper">


                <div class="page-wrapper bg-light">

                    <div class="container-fluid bg-light">
                        <div class="row page-titles">
                            <?php include_once './formnav.php' ?>

                        </div>
                        <form action="form-process0.2.php" method="post" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                    <?php
    if (isset($_SESSION['message'])) {
        echo  $_SESSION['message'];
    } ?>
                                        <div class="card-body">
                                            <h4 class="card-title"> CV / Resume</h4>
                                            <hr>
                                            <label for="input-file-now"></label>
                                            <input type="file" id="images1" name="images[]" data-height="200" class="dropify" data-default-file="assets\node_modules\dropify\src\images\images.jpg" multiple>
                                        </div>
                                    </div>
                                </div>
                               <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">English test result</h4>
                                            <hr>
                                            <label for="input-file-now-custom-1">You can add a default value</label>
                                            <input type="file" name="resume[]" id="images2" data-height="200" class="dropify" data-default-file="assets\node_modules\dropify\src\images\images.jpg" multiple>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Passport copy</h4>
                                            <hr>
                                            <label for="input-file-now-custom-2">You can set the height</label>
                                            <input type="file" name="passport[]" id="pass" class="dropify" data-height="200" data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                 <!-- <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">transcript(s)</h4>
                                            <hr>
                                            <label for="input-file-now-custom-3">You can combine options</label>
                                            <input type="file" id="input-file-now-custom-3" class="dropify" data-height="200" data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Disability</h4>
                                            <hr>
                                            <label for="input-file-max-fs">You can add a max file size</label>
                                            <input type="file" id="input-file-max-fs" class="dropify" data-max-file-size="2M" data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">EU settle / Pre Settled</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Other certificates or diplomas</h4>
                                            <hr>
                                            <label for="input-file-max-fs">You can add a max file size</label>
                                            <input type="file" id="input-file-max-fs" class="dropify" data-max-file-size="2M" data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Other documents</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Reference letter</h4>
                                            <hr>
                                            <label for="input-file-max-fs">You can add a max file size</label>
                                            <input type="file" id="input-file-max-fs" class="dropify" data-max-file-size="2M" data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Statement of purpose</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">UG Provisional / Degree</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">PG Provisional / Degree</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Visa refusal</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Post Admission – BRP</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12 col-md-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Work experience certificate</h4>
                                            <hr>
                                            <label for="input-file-disable-remove">You can disable remove button</label>
                                            <input type="file" id="input-file-disable-remove" name="images[]" data-height="200" class="dropify" multiple data-default-file="assets\node_modules\dropify\src\images\images.jpg" />
                                        </div>
                                    </div>
                                </div> -->
                                <div class="col-md-6"></div>
                                <div class="col-md-6">
                                    <button type="submit" class="btn btn-success w-50" name="submit"> Save</button>
                                </div>
                            </div>

                    </div>

                    </form>
                </div>

            </div>
    </div>

    <?php include_once './footer.php' ?>
    </div>

    <?php include_once './script.php' ?>

    <script src="assets/node_modules/dropify/dist/js/dropify.min.js"></script>
    <script>
        $(document).ready(function() {
            // Basic
            $('.dropify').dropify();

            // Translated
            $('.dropify-fr').dropify({
                messages: {
                    default: 'Glissez-déposez un fichier ici ou cliquez',
                    replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
                    remove: 'Supprimer',
                    error: 'Désolé, le fichier trop volumineux'
                }
            });

            // Used events
            var drEvent = $('#input-file-events').dropify();

            drEvent.on('dropify.beforeClear', function(event, element) {
                return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
            });

            drEvent.on('dropify.afterClear', function(event, element) {
                alert('File deleted');
            });

            drEvent.on('dropify.errors', function(event, element) {
                console.log('Has Errors');
            });

            var drDestroy = $('#input-file-to-destroy').dropify();
            drDestroy = drDestroy.data('dropify')
            $('#toggleDropify').on('click', function(e) {
                e.preventDefault();
                if (drDestroy.isDropified()) {
                    drDestroy.destroy();
                } else {
                    drDestroy.init();
                }
            })
        });
    </script>
</body>
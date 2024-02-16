
<script src="assets/node_modules/jquery/jquery-3.2.1.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function() {

            $('#country').change(function() {
                loadState($(this).find(':selected').val())
            })
            $('#state').change(function() {
                loadCity($(this).find(':selected').val())
            })


        });

        function loadCountry() {
            $.ajax({
                type: "POST",
                url: "ajax.php",
                data: {
                    get: "country"
                }, // Use an object for better handling
                success: function(result) {
                    // Directly append the result without looping
                    $("#country").append(result);
                },
                error: function(xhr, status, error) {
                    // Handle errors (e.g., log them or show a message to the user)
                    console.error("Error loading country: " + error);
                }
            });
        }

        function loadState(countryId) {
            $("#state").children().remove()
            $.ajax({
                type: "POST",
                url: "ajax.php",
                data: "get=state&countryId=" + countryId
            }).done(function(result) {

                $("#state").append($(result));

            });
        }

        function loadCity(stateId) {
            $("#city").children().remove()
            $.ajax({
                type: "POST",
                url: "ajax.php",
                data: "get=city&stateId=" + stateId
            }).done(function(result) {

                $("#city").append($(result));

            });
        }

        // init the countries
        loadCountry();
    </script>
    <!-- Bootstrap tether Core JavaScript -->
    <script src="assets/node_modules/popper/popper.min.js"></script>
    <script src="assets/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>

    <!-- slimscrollbar scrollbar JavaScript -->
    <!--Wave Effects -->
    <script src="dist/js/waves.js"></script>
    <!--Menu sidebar -->
    <!-- <script src="dist/js/sidebarmenu.js"></script> -->
    <!--stickey kit -->
    <script src="assets/node_modules/sticky-kit-master/dist/sticky-kit.min.js"></script>
    <script src="assets/node_modules/sparkline/jquery.sparkline.min.js"></script>
    <script src="assets/node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js" type="text/javascript"></script>
    <!--Custom JavaScript -->
<script src="dist/js/custom.min.js"></script>
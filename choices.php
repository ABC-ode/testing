<?php 
    include_once './head.php';
?>
<body class="bg-dark">
    <section>
        <div class="col-lg mx-auto">
            <div class="card">
                <div class="cardshadow">
                    <h4>add</h4>
                </div>
                <div class="card-body">
                    <div id="show_alert"></div>
                    <form action="#"  method="post" id="add_form">
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
                                <div class="col-md-3 mb-3 d-grid">
                                    <button class="btn btn-success add_item_btn">add more</button>
                                </div>
                            </div>
                            <div>
                                <input type="submit" value="Add" class="btn btn-info w-25" id="add_btn">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    <script src="assets/node_modules/jquery/jquery-3.2.1.min.js"></script>
    <script>
        $(document).ready(function(){
           $(".add_item_btn").click(function(e){
            e.preventDefault();
            $("#show_item").prepend(`
                <div class="row append_item">
                    <div class="col-md-4 mb-3">
                        <input type="text" name="product_name[]" class="form-control" placeholder="item name" required>
                    </div>
                    <div class="col-md-3 mb-3">
                        <input type="number" name="product_price[]" class="form-control" placeholder="item price" required>
                    </div>
                    <div class="col-md-2 mb-3">
                        <input type="number" name="product_qty[]" class="form-control" placeholder="item quantity" required>
                    </div>
                    <div class="col-md-3 mb-3 d-grid">
                        <button class="btn btn-danger remove_item_btn">remove</button>
                    </div>
                </div>`)
           });

           $(document).on('click', '.remove_item_btn', function(e){
            e.preventDefault();
            let row_item = $(this).parent().parent();
            $(row_item).remove();
           });

           //ajax
           $('#add_form').submit(function(e){
            e.preventDefault(); 
            $("#add_btn").val('Adding..');
            $.ajax({
                url:'action.php',
                method:'post',
                data:$(this).serialize(),
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
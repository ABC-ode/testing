<?php
    $user = $_SESSION['userid']; 

	
    $sql = $conn->query("SELECT * FROM register WHERE  userid = '$user' ");
    
    if($sql->num_rows>0){
        $row = $sql->fetch_assoc();//fetchin in array
    }?>


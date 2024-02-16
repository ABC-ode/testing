<?php

$num = 1;
$sql = $conn->query("SELECT * FROM registerstudent");
if ($sql->num_rows > 0) {
    while ($row = $sql->fetch_assoc()) {
        $numrow = $sql->num_rows;
    }}

    
    $num = 1;
    $sql = $conn->query("SELECT * FROM register");
    if ($sql->num_rows > 0) {
        while ($row = $sql->fetch_assoc()) {
            $numrow2 = $sql->num_rows;
        }}
    
        
?>
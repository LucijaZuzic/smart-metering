<?php
    $data = json_decode(file_get_contents("php://input"));
    $mini = $data->mini;
    $maxi = $data->maxi;
  
    $response = rand($mini * 10000, $maxi * 10000) / 10000;
    echo json_encode($response);
?>
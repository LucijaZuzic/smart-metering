<?php
    $data = json_decode(file_get_contents("php://input"));
    $mini = $data->mini;
    $maxi = $data->maxi;
    $num = $data->num;
    $response = [];
    for ($i = 0; $i < $num; $i = $i + 1) {
        $response[$i] = rand($mini * 10000, $maxi * 10000) / 10000;
    }
    echo json_encode($response);
?>
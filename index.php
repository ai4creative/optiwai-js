<?php
// SETTINGS
$api_client = 'API_CLIENT_ID';
$secret = 'API_SECRET';
$absolute_path_to_file = '/home/my_file.png'; // file path that will be processed
$settings = array(
    "filename" => "file.jpg", // <- your filename
    "processMethod" => "retouched", // "auto" | "retouched" | "lowQuality"
    "whiteBalance" => true, // White Balance will be applied to processed image if this is set to true
    "hdr" => true // HDR will be applied to processed image if this is set to true
);


// Get necessary header values
$timestamp = round(microtime(true) * 1000);
$sig = hash_hmac('sha256', $timestamp . '|' . $api_client, $secret);
$base64_settings = base64_encode(json_encode($settings));

$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_PORT => "4242",
    CURLOPT_URL => "http://localhost:4242/api/v1/upload",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => file_get_contents($absolute_path_to_file),
    CURLOPT_HTTPHEADER => array(
        "apiclient: " . $api_client,
        "apitoken: " . $sig,
        "cache-control: no-cache",
        "optiwai: " . $base64_settings,
        "timestamp: " . $timestamp
    )
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}

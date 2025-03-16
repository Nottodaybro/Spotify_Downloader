<?php
// Ensure the POST request contains the 'songUrl' parameter
if (isset($_POST['url'])) {
    $songUrl = $_POST['url'];

    // Call the function to download the song
    $fileUrl = downloadSong($songUrl);

    // Return the response as JSON
    echo json_encode(['file_url' => $fileUrl]);
} else {
    echo json_encode(['error' => 'No song URL provided']);
}

function downloadSong($songUrl)
{
    $url = 'http://spotymate.com/api/download-track';

    // Initialize cURL session
    $ch = curl_init($url);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['url' => $songUrl]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
        'Referer: https://spotymate.com/',
    ]);

    // Execute cURL request and capture response
    $response = curl_exec($ch);

    // Check for cURL errors
    if ($response === false) {
        echo 'cURL Error: ' . curl_error($ch);
        return null;
    } else {        // Decode the response as JSON
        $responseData = json_decode($response, true);
        return $responseData['file_url'] ?? null;
    }

    // Close cURL session
    curl_close($ch);
}

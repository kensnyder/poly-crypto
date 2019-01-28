<?php

require_once(__DIR__ . '/../src/PolyAES.php');

$password = 'The quick brown fox jumped over the lazy dog';
$salt = 'Four score and seven years ago';
$sheSellsDecrypted = 'She sells sea shells by the sea shore';
$sheSellsEncrypted = '';
//$plaintext = 'I ❤️ encryption';
$plaintext = 'She sells sea shells by the sea shore';
$encrypted = \PolyAES\PolyAES::withPassword($password, $salt)->encrypt($plaintext);
//$encrypted = 't2PglHKe+sNxtZcJCyIHnOPczlwBv52MEcQzkeH9SECk+aJQaXgRSsBiiiUnHG4mZs0L';
$decrypted = \PolyAES\PolyAES::withPassword($password, $salt)->decrypt($encrypted);

echo "plaintext: $plaintext\n";
echo "encrypted: $encrypted\n";
echo "decrypted: $decrypted\n";
// 4xCZ9Qf8duizf11rXpWsm09RutfEs82gn6YGjh+iZLfYS9HlJE12U0roftTkTQI=

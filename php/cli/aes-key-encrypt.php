#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyAES.php');

use PolyCrypto\PolyAES;

try {
	list (, $key, $plaintext) = $argv;
	$cipher = PolyAES::withKey($key);
	$ciphertext = $cipher->encrypt($plaintext);
	echo $ciphertext;
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

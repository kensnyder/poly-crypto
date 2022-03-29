#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyAES.php');

use PolyCrypto\PolyAES;

try {
	[, $password, $salt, $plaintext] = $argv;
	$cipher = PolyAES::withPassword($password, $salt);
	$ciphertext = $cipher->encrypt($plaintext);
	echo $ciphertext;
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

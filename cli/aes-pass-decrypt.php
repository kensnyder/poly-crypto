#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyAES.php');

use PolyCrypto\PolyAES;

try {
	list (, $password, $salt, $ciphertext) = $argv;
	$cipher = PolyAES::withPassword($password, $salt);
	$plaintext = $cipher->decrypt($ciphertext);
	echo $plaintext;
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

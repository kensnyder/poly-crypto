#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyBcrypt.php');

use PolyCrypto\PolyBcrypt;

try {
	[, $password, $hash] = $argv;
	$doesMatch = PolyBcrypt::verify($password, $hash);
	echo $doesMatch ? '1' : '0';
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

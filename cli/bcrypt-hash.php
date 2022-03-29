#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyBcrypt.php');

use PolyCrypto\PolyBcrypt;

try {
	[, $password, $cost] = $argv;
	$hash = PolyBcrypt::hash($password, $cost);
	echo $hash;
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

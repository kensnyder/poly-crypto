#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyRand.php');

use PolyCrypto\PolyRand;

try {
	list (, $length, $symbols) = $argv;
	$out = PolyRand::string((int) $length, explode('', $symbols));
	echo $digest;
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

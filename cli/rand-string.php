#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyRand.php');

use PolyCrypto\PolyRand;

try {
	[, $length, $symbols] = $argv;
	$out = PolyRand::string((int) $length, explode('', $symbols));
	echo $out;
} catch (Exception $e) {
	fwrite(STDERR, $e->getMessage());
	exit(1);
}

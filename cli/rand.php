#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyRand.php');

use PolyCrypto\PolyRand;

[, $type, $length] = $argv;
$length = (int) $length;
$out = PolyRand::$type($length);
echo $out;

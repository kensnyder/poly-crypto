#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyRand.php');

use PolyCrypto\PolyRand;

list (, $type, $length) = $argv;
$out = PolyRand::$type($length);
echo $out;

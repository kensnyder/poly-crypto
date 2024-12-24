#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyConvert.php');

use PolyCrypto\PolyConvert;

[, $input, $from, $to] = $argv;
$output = PolyConvert::base($input, $from, $to);
echo $output;

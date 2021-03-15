#!/usr/bin/env php
<?php

require_once(__DIR__ . '/../src/PolyDigest.php');

use PolyCrypto\PolyDigest;

list (, $algo, $data) = $argv;
$digest = PolyDigest::$algo($data);
echo $digest;

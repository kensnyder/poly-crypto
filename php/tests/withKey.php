<?php

require_once(__DIR__ . '/../src/PolyAES.php');

$hexKey =
	'C639A572E14D5075C526FDDD43E4ECF6B095EA17783D32EF3D2710AF9F359DD4';
$plaintext = 'I ❤️ encryption 🙌 yo';
$encrypted = \PolyAES\PolyAES::withKey($hexKey)->encrypt($plaintext);
$encrypted = 'dOdjhDQkzxa+RS5HuafKdiUC9N20Hd58w1A26RVfanhvAgI5OkHDoWihExGDI1xNZ8d4eH3a0JzQZeGh9BTfNTEatrLr';
$decrypted = \PolyAES\PolyAES::withKey($hexKey)->decrypt($encrypted);

echo "plaintext: $plaintext\n";
echo "encrypted: $encrypted\n";
echo "decrypted: $decrypted\n";
// 4xCZ9Qf8duizf11rXpWsm09RutfEs82gn6YGjh+iZLfYS9HlJE12U0roftTkTQI=

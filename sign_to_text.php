<?php
// sign_to_text.php
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>الإشارة → نص</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
	<nav class="top-nav">
<a href="text.html">الرئيسية</a>
<a href="about_sign.php">عن لغة الإشارة</a>
<a href="about_us.php">من نحن</a>
</nav>
<main class="container">
<h1>الإشارة → نص</h1>


<section>
<h2>1) التجميع اليدوي (انقر لتكوين نص)</h2>
<div id="picker" class="picker">
<!-- ستملأ هذه المنطقة بصور الحروف تلقائياً من مجلد images/letters -->
<?php
$lettersDir = __DIR__ . '/images/letters';
if (is_dir($lettersDir)) {
$files = scandir($lettersDir);
foreach ($files as $f) {
if (in_array($f, ['.','..'])) continue;
$url = 'images/letters/' . $f;
$name = pathinfo($f, PATHINFO_FILENAME);
echo "<button class='pick-btn' data-val='" . htmlspecialchars($name, ENT_QUOTES) . "'><img src='{$url}' alt='{$name}'><span>{$name}</span></button>";
}
} else {
echo '<p>لا توجد صور للحروف في مجلد images/letters</p>';
}
?>
</div>


<div class="row">
<textarea id="constructed" rows="3" placeholder="النص الناتج ..."></textarea>
</div>


<div class="row">
<button id="clear">مسح</button>
</div>
</section>


<hr>


<section>
<h2>2) التعرف التلقائي (Webcam + نموذج ML)</h2>
<p>قيد العمل</p><code></code>


<div class="recog">
<video id="webcam" autoplay playsinline width="320" height="240"></video>
<div id="recog-result">نتيجة: <strong id="recog-text">—</strong></div>
<button id="start-recog">بدء التعرف</button>
<button id="stop-recog">إيقاف</button>
</div>


</section>


</main>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js"></script>
<script src="sign_recognizer.js"></script>
</body>
</html>
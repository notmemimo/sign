<?php


include 'db.php'; 


function sanitize_text($t) {
    $t = trim($t);
    $t = mb_strtolower($t, 'UTF-8');
    return $t;
}


function split_to_tokens($text) {
    $words = preg_split('/\\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);
    $tokens = [];
    foreach ($words as $w) {
        $w = trim($w, "\\u{060C}\\u{061B}\\u{061F}\\u{060C}.!,?;:\\\"'()[]{}");
        if ($w === '') continue;
        
        $wordFile = __DIR__ . '/images/words/' . $w . '.png';
        if (file_exists($wordFile)) {
            $tokens[] = ['type'=>'word','value'=>$w];
        } else {
            
            $chars = preg_split('//u', $w, -1, PREG_SPLIT_NO_EMPTY);
            foreach ($chars as $c) {
                $tokens[] = ['type'=>'char','value'=>$c];
            }
          
            $tokens[] = ['type'=>'space','value'=>' '];
        }
    }
    return $tokens;
}


$input = isset($_POST['text']) ? trim($_POST['text']) : '';
$cleanInput = preg_replace('/\s+/u', '', $input);


$letterSign = null;
if (mb_strlen($cleanInput) === 1) {
    $letter = $cleanInput;
    $stmt = $conn->prepare("SELECT image_path FROM sign_letters WHERE letter = ? LIMIT 1");
    $stmt->bind_param("s", $letter);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $letterSign = $result->fetch_assoc();
    }
    $stmt->close();
}

$input = sanitize_text($input);
$tokens = split_to_tokens($input);


if (!empty($input)) {
    $stmt = $conn->prepare("INSERT INTO translations (input_text, translated_text) VALUES (?, ?)");
    $translated = ''; 
    $stmt->bind_param("ss", $input, $translated);
    $stmt->execute();
    $stmt->close();
}
?>

<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>النتيجة - ترجمة لغة الإشارة</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="top-nav">
    <a href="text.php">الرئيسية</a>
    <a href="about_us.php">من نحن</a>
  </nav>

  <main class="container">
    <h1>الترجمة إلى لغة الإشارة</h1>

    <?php if (empty($input)): ?>
      <p>لم يتم إرسال أي نص. <a href="text.php">ارجع للصفحة السابقة</a>.</p>
    <?php elseif ($letterSign && mb_strlen($cleanInput) === 1): ?>
      <div style="text-align: center; padding: 40px;">
        <h2 style="font-size: 48px; margin-bottom: 20px;"><?php echo htmlspecialchars($cleanInput); ?></h2>
        <div style="margin: 30px 0;">
          <img src="<?php echo htmlspecialchars($letterSign['image_path']); ?>" 
               alt="<?php echo htmlspecialchars($cleanInput); ?>" 
               style="max-width: 300px; max-height: 300px; border: 2px solid #ddd; padding: 20px; background: white; border-radius: 8px;">
        </div>
      </div>
      <p style="text-align: center; margin-top: 30px;"><a href="index.php">ترجمة حرف آخر</a></p>
    <?php else: ?>
      <section class="sign-line">
        <?php foreach ($tokens as $t):
            if ($t['type'] === 'space') {
                echo '<div class="sign-space">&nbsp;</div>';
                continue;
            }
            if ($t['type'] === 'word') {
                $imgPath = 'images/words/' . $t['value'] . '.png';
                if (!file_exists($imgPath)) $imgPath = 'images/letters/unknown.png';
                echo "<figure class='sign-item'><img src='{$imgPath}' alt='{$t['value']}'><figcaption>{$t['value']}</figcaption></figure>";
            } else {
                $char = $t['value'];
                $safeName = preg_replace('/[^\\p{L}\\p{N}_-]+/u', '', $char);
                $imgPath = 'images/letters/' . $safeName . '.png';
                if (!file_exists($imgPath)) $imgPath = 'images/letters/unknown.png';
                echo "<figure class='sign-item'><img src='{$imgPath}' alt='{$char}'><figcaption>{$char}</figcaption></figure>";
            }
        endforeach; ?>
      </section>

      <p><a href="text.php">ترجمة نص آخر</a></p>
    <?php endif; ?>
  </main>
</body>
</html>

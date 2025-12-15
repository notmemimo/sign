
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>مترجم لغة الإشارة بالكاميرا</title>
  <link rel="stylesheet" href="style-camera.css">
</head>
<body>
  <nav>
    |
    <a href="text.php">مترجم النص إلى إشارة</a>
  </nav>

  <h1>🤖 مترجم لغة الإشارة العربي بالصوت</h1>
  

  <div class="video-container">
    <video id="video" width="640" height="480" autoplay></video>
    <div id="output">✋ في انتظار الإشارة...</div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
  <script type="module" src="script-camera.js"></script>
</body>
</html>

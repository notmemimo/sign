<?php
session_start();

if(isset($_POST['submit_name'])){
    $_SESSION['username'] = htmlspecialchars($_POST['username']);
    header("Location: text.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>أيدينا تتحدث | Our Hands Speak</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<div class="welcome-container">

<!-- الشعار والعنوان -->
<div class="logo-name">
    <img src="images/logo.png" alt="لوغو الموقع">
    <h1>أيدينا تحكي | Our Hands Speak</h1>
</div>

<!-- هدفنا (فوق) -->
<div class="info-section">
    <h2>هدفنا</h2>
    <p>
    يهدف الموقع إلى تعزيز التواصل بين الأفراد الصمّ وغير الصمّ من خلال منصة إيدينا تحكي
     تقوم بترجمة النصوص إلى لغة الإشارة، وتحويل لغة الإشارة إلى نصوص مكتوبة.
    </p>
</div>

<!-- إدخال الاسم مباشرة -->
<form method="POST" style="display:flex; flex-direction:column; align-items:center;">
    <div class="welcome-name">أهلاً وسهلاً بك 👋</div>
    <input type="text" name="username" placeholder="من فضلك أدخل اسمك" required><br>
    <button type="submit" name="submit_name">ابدأ</button>
</form>



<!-- صورة أسفل الصفحة -->
<div style="text-align:center; margin-top:20px;">
    <img src="images/Jo.jpeg" alt="صورة توضيحية" style="max-width:300px;">
</div>

</div>
</body>
</html>
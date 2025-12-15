<?php
$servername = "localhost";
$username = "root"; // المستخدم الافتراضي في XAMPP
$password = ""; // بدون كلمة مرور افتراضيًا
$dbname = "sign_language_db"; // اسم القاعدة اللي أنشأتها

// إنشاء الاتصال
$conn = new mysqli($servername, $username, $password, $dbname);

// فحص الاتصال
if ($conn->connect_error) {
  die("فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
}
?>

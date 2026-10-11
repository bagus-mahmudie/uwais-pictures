<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

// honeypot anti-spam
if (!empty($_POST['company'] ?? '')) {
  echo json_encode(['ok' => true, 'message' => 'OK']);
  exit;
}

$first   = trim($_POST['first_name'] ?? '');
$last    = trim($_POST['last_name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? 'Contact from Website');
$message = trim($_POST['message'] ?? '');

$name = trim($first . ' ' . $last);

if ($first === '' || $email === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Nama depan, email, dan pesan wajib diisi.']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Email tidak valid.']);
  exit;
}

if (strlen($message) > 8000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Pesan terlalu panjang.']);
  exit;
}

// Load PHPMailer (file library)
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
  // ====== ISI DI SINI ======
  $GMAIL_USER = getenv('MAIL_USERNAME') ?: ''; 
  $GMAIL_APP = getenv('MAIL_PASSWORD') ?: ''; 
  // =========================

  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = $GMAIL_USER;
  $mail->Password   = $GMAIL_APP;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  // Header email
  $mail->setFrom($GMAIL_USER, 'Uwais Pictures Website');
  $mail->addAddress('marketing@uwaispictures.id', 'Marketing Uwais Pictures');

  $mail->addReplyTo($email, $name ?: $email);

  $mail->isHTML(true);
  $mail->Subject = '[Website Contact] ' . $subject;

  $safe = fn($v) => htmlspecialchars($v ?? '', ENT_QUOTES, 'UTF-8');

  $mail->Body = "
    <h2>Pesan dari Website Uwais Picture</h2>
    <p><strong>Nama:</strong> {$safe($name)}</p>
    <p><strong>Email:</strong> {$safe($email)}</p>
    <p><strong>Telepon:</strong> {$safe($phone)}</p>
    <p><strong>Subjek:</strong> {$safe($subject)}</p>
    <p><strong>Pesan:</strong><br>" . nl2br($safe($message)) . "</p>
  ";

  $mail->AltBody =
    "Nama: {$name}\nEmail: {$email}\nTelepon: {$phone}\nSubjek: {$subject}\n\nPesan:\n{$message}";

  $mail->send();
  echo json_encode(['ok' => true, 'message' => 'Pesan berhasil dikirim.']);

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Gagal mengirim pesan.']);
}

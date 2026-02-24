<?php
session_start();

function generateKey($length = 24) {
  $bytes = random_bytes($length);
  // URL-safe base64 (no + / =)
  return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
}

if (!isset($_SESSION['session_key'])) {
  $_SESSION['session_key'] = generateKey(18);
}

// If frontend requests JSON (session.html uses this)
if (isset($_GET['mode']) && $_GET['mode'] === 'json') {
  header('Content-Type: application/json');
  echo json_encode([
    "key" => $_SESSION['session_key'],
    "generated_at" => date("c")
  ]);
  exit;
}

// Otherwise show a simple premium page
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Divine - Premium</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div class="ambient-glow">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
  </div>

  <nav>
    <a href="index.html" class="logo">Divine</a>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="dashboard.html">Dashboard</a>
      <a href="session.html">Session Key</a>
      <a href="contact.html">Contact Us</a>
    </div>
    <a href="key.php" class="btn-premium">Premium</a>
  </nav>

  <main class="page-container">
    <section class="key-container">
      <h1>Premium Access</h1>
      <p>Your current session key:</p>
      <div class="key-display"><?php echo htmlspecialchars($_SESSION['session_key']); ?></div>
      <a class="btn-generate" href="session.html">Back to Session Page</a>
    </section>

    <footer>
      <p>Divine Premium © 2024</p>
    </footer>
  </main>
</body>
</html>
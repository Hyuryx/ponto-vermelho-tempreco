<?php
session_start();
require 'vendor/autoload.php';
require 'config_email.php';
use PHPMailer\PHPMailer\PHPMailer;

include 'auth_check.php';
include 'db/conn.php';

$usuario_id = $_SESSION["usuario_id"];
$data = date("Y-m-d");
$hora = date("H:i:s");

$mail = new PHPMailer(true); // Instancia PHPMailer uma vez

$check = $conn->prepare("SELECT * FROM pontos WHERE usuario_id = ? AND data = ?");
$check->bind_param("is", $usuario_id, $data);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    $insert = $conn->prepare("INSERT INTO pontos (usuario_id, data, hora_entrada) VALUES (?, ?, ?)");
    $insert->bind_param("iss", $usuario_id, $data, $hora);
    $insert->execute();
    
    try {
        $mail->isSMTP();
        $mail->Host = $mail_host;
        $mail->SMTPAuth = true;
        $mail->Username = $mail_user;
        $mail->Password = $mail_pass;
        $mail->SMTPSecure = 'tls';
        $mail->Port = $mail_port;
        $mail->setFrom($mail_from, $mail_from_name);
        
        // Verifica se o email está definido na sessão antes de usar
        if (isset($_SESSION['email'])) {
            $mail->addAddress($_SESSION['email']);
        } else {
            error_log("Email do usuário não encontrado na sessão para envio de e-mail.");
        }
        
        $mail->Subject = "Registro de Ponto";
        $mail->Body = "Seu ponto foi registrado com sucesso em " . date('d/m/Y H:i:s');
        $mail->send();
    } catch (Exception $e) {
        error_log("Erro ao enviar e-mail: " . $mail->ErrorInfo);
    }
    echo "Ponto de entrada registrado.";
} else {
    $ponto = $result->fetch_assoc();
    if (empty($ponto['hora_saida'])) {
        $update = $conn->prepare("UPDATE pontos SET hora_saida = ? WHERE id = ?");
        $update->bind_param("si", $hora, $ponto["id"]);
        $update->execute();
        echo "Ponto de saída registrado.";
    } else {
        echo "Ponto já registrado para hoje.";
    }
}
?>
<a href='dashboard_user.php'>Voltar</a>
</div>
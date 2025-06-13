<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$database = "ponto_vermelho";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

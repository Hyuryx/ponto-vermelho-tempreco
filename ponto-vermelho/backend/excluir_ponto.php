<?php
include 'auth_check.php';
include 'db/conn.php';
if ($_SESSION["tipo"] !== "admin") exit("Acesso negado");

$id = $_GET['id'] ?? null;
$stmt = $conn->prepare("DELETE FROM pontos WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
header("Location: listar_pontos.php");
?>

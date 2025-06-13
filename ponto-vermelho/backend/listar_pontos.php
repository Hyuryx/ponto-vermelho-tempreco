<?php

include 'auth_check.php';
include 'db/conn.php';

$usuario_id = $_SESSION["usuario_id"];
$tipo = $_SESSION["tipo"];

$sql = ($tipo === 'admin') ?
    "SELECT u.nome, p.data, p.hora_entrada, p.hora_saida FROM pontos p JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.data DESC" :
    "SELECT data, hora_entrada, hora_saida FROM pontos WHERE usuario_id = ? ORDER BY data DESC";

if ($tipo === 'admin') {
    $res = $conn->query($sql);
} else {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $res = $stmt->get_result();
}
echo "<h2>Registros de Ponto</h2><table border='1'><tr>";
if ($tipo === "admin") echo "<th>Nome</th>";
echo "<th>Data</th><th>Entrada</th><th>Saída</th></tr>";

while ($row = $res->fetch_assoc()) {
    echo "<tr>";
    if ($tipo === "admin") echo "<td>{$row['nome']}</td>";
    echo "<td>{$row['data']}</td><td>{$row['hora_entrada']}</td><td>{$row['hora_saida']}</td></tr>";
}
echo "</table><a href='" . ($tipo === "admin" ? "dashboard_admin.php" : "dashboard_user.php") . "'>Voltar</a>";
echo "</div>";
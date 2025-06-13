<?php

include 'auth_check.php';
include 'db/conn.php';
if ($_SESSION["tipo"] !== "admin") { echo "Acesso negado."; exit(); }

$res = $conn->query("SELECT id, nome, email FROM usuarios WHERE tipo = 'funcionario'");
echo "<h2>Funcionários</h2><ul>";
while ($row = $res->fetch_assoc()) {
    echo "<li>{$row['nome']} ({$row['email']})</li>";
}
echo "</ul><a href='dashboard_admin.php'>Voltar</a>";
echo "</div>";
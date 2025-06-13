<?php

include 'auth_check.php';
include 'db/conn.php';
if ($_SESSION["tipo"] !== "admin") exit("Acesso negado");

$id = $_GET['id'] ?? null;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $entrada = $_POST["entrada"];
    $saida = $_POST["saida"];
    $stmt = $conn->prepare("UPDATE pontos SET hora_entrada = ?, hora_saida = ? WHERE id = ?");
    $stmt->bind_param("ssi", $entrada, $saida, $id);
    $stmt->execute();
    echo "Registro atualizado.";
}

$stmt_select = $conn->prepare("SELECT * FROM pontos WHERE id = ?");
$stmt_select->bind_param("i", $id);
$stmt_select->execute();
$ponto = $stmt_select->get_result()->fetch_assoc();
?>
<form method="POST">
Entrada: <input type="time" name="entrada" value="<?php echo $ponto['hora_entrada']; ?>"><br>
Saída: <input type="time" name="saida" value="<?php echo $ponto['hora_saida']; ?>"><br>
<button type="submit">Salvar</button>
</form>
<a href='listar_pontos.php'>Voltar</a>
echo "</div>";
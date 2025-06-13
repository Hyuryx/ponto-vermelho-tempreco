<?php

include 'auth_check.php';
include 'db/conn.php';
if ($_SESSION["tipo"] !== "admin") { echo "Acesso negado."; exit(); }

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST["nome"];
    $email = $_POST["email"];
    $senha = password_hash($_POST["senha"], PASSWORD_DEFAULT);
    $tipo = "funcionario";

    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $email, $senha, $tipo);
    $stmt->execute();
    echo "Funcionário cadastrado.";
}
?>
<form method="POST">
  Nome: <input type="text" name="nome"><br>
  Email: <input type="email" name="email"><br>
  Senha: <input type="password" name="senha"><br>
  <button type="submit">Cadastrar Funcionário</button>
</form>
<a href='dashboard_admin.php'>Voltar</a>
</div>
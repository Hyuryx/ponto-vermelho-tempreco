<?php

include 'db/conn.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = $_POST["nome"];
    $email = $_POST["email"];
    $senha = password_hash($_POST["senha"], PASSWORD_DEFAULT);
    $tipo = "admin";

    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $email, $senha, $tipo);

    if ($stmt->execute()) {
        echo "Admin cadastrado!";
    } else {
        echo "Erro: " . $stmt->error;
    }
}
?>
<form method="POST">
  Nome: <input type="text" name="nome"><br>
  Email: <input type="email" name="email"><br>
  Senha: <input type="password" name="senha"><br>
  <button type="submit">Cadastrar Admin</button>
</form>
</div>
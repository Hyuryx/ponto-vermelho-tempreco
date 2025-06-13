<?php

include 'db/conn.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        if (password_verify($senha, $usuario["senha"])) {
            $_SESSION["usuario_id"] = $usuario["id"];
            $_SESSION["tipo"] = $usuario["tipo"];
            header("Location: " . ($usuario["tipo"] === "admin" ? "dashboard_admin.php" : "dashboard_user.php"));
            exit();
        } else {
            echo "Senha inválida.";
        }
    } else {
        echo "Usuário não encontrado.";
    }
}
?>
<form method="POST">
  Email: <input type="email" name="email"><br>
  Senha: <input type="password" name="senha"><br>
  <button type="submit">Entrar</button>
</form>
</div>
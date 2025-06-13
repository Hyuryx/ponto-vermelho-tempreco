<?php

include 'auth_check.php';
if ($_SESSION["tipo"] !== "funcionario") {
    echo "Acesso restrito.";
    exit();
}
echo "<h2>Painel do Funcionário</h2>";
echo "<ul>
<li><a href='bater_ponto.php'>Bater Ponto</a></li>
<li><a href='listar_pontos.php'>Visualizar Meus Pontos</a></li>
<li><a href='logout.php'>Sair</a></li>
</ul></div>";
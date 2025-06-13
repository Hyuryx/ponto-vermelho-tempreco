<?php

include 'auth_check.php';
if ($_SESSION["tipo"] !== "admin") {
    echo "Acesso restrito.";
    exit();
}
echo "<h2>Bem-vindo, Admin</h2>";
echo "<ul>
<li><a href='cadastro_funcionario.php'>Cadastrar Funcionário</a></li>
<li><a href='listar_funcionarios.php'>Listar Funcionários</a></li>
<li><a href='listar_pontos.php'>Visualizar Pontos</a></li>
<li><a href='logout.php'>Sair</a></li>

<li><a href='gerar_pdf.php'>Gerar Relatório PDF</a></li>
<li><a href='gerar_excel.php'>Exportar Excel</a></li>
</ul></div>";
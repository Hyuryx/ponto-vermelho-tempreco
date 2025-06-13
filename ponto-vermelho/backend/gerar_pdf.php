<?php
require 'vendor/autoload.php';
include 'auth_check.php';
include 'db/conn.php';

use Dompdf\Dompdf;

if ($_SESSION["tipo"] !== "admin") exit("Acesso negado");

$html = "<h2>Relatório de Pontos</h2><table border='1' cellpadding='4' cellspacing='0'><tr><th>Nome</th><th>Data</th><th>Entrada</th><th>Saída</th></tr>";

$res = $conn->query("SELECT u.nome, p.data, p.hora_entrada, p.hora_saida FROM pontos p JOIN usuarios u ON u.id = p.usuario_id");
while ($r = $res->fetch_assoc()) {
    $html .= "<tr><td>{$r['nome']}</td><td>{$r['data']}</td><td>{$r['hora_entrada']}</td><td>{$r['hora_saida']}</td></tr>";
}
$html .= "</table>";

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("relatorio_ponto.pdf", ["Attachment" => true]);
?>

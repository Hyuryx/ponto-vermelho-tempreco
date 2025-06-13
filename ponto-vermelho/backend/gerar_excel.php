<?php
require 'vendor/autoload.php';
include 'auth_check.php';
include 'db/conn.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

if ($_SESSION["tipo"] !== "admin") exit("Acesso negado");

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

$sheet->setCellValue('A1', 'Nome');
$sheet->setCellValue('B1', 'Data');
$sheet->setCellValue('C1', 'Entrada');
$sheet->setCellValue('D1', 'Saída');

$res = $conn->query("SELECT u.nome, p.data, p.hora_entrada, p.hora_saida FROM pontos p JOIN usuarios u ON u.id = p.usuario_id");

$row = 2;
while ($r = $res->fetch_assoc()) {
    $sheet->setCellValue("A{$row}", $r["nome"]);
    $sheet->setCellValue("B{$row}", $r["data"]);
    $sheet->setCellValue("C{$row}", $r["hora_entrada"]);
    $sheet->setCellValue("D{$row}", $r["hora_saida"]);
    $row++;
}

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="relatorio_pontos.xlsx"');
header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
?>

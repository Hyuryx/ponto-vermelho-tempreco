
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Download, Filter, FileText, BarChart3, Clock, Users, TrendingUp, AlertTriangle, CheckCircle, Calendar as CalendarIcon, FileBarChart, UserCheck, Briefcase, Activity, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTimeTracking } from "@/hooks/useTimeTracking";

const ReportsSection = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<any>(null);
  const { toast } = useToast();
  const { employees, timeEntries } = useTimeTracking({ name: 'admin', role: 'admin', company: 'TEM PREÇO' });

  const reports = [
    { id: "timesheet", name: "Espelho de Ponto", icon: Clock, description: "Registro detalhado de marcações" },
    { id: "overtime", name: "Horas Extras", icon: TrendingUp, description: "Relatório de horas excedentes" },
    { id: "absences", name: "Faltas e Atrasos", icon: AlertTriangle, description: "Controle de ausências" },
    { id: "vacations", name: "Férias", icon: Calendar, description: "Gestão de períodos de férias" },
    { id: "hour-bank", name: "Banco de Horas", icon: BarChart3, description: "Saldo de horas por funcionário" },
    { id: "monthly", name: "Mensal Consolidado", icon: FileText, description: "Resumo mensal completo" },
    { id: "daily", name: "Diário", icon: CalendarIcon, description: "Marcações do dia" },
    { id: "weekly", name: "Semanal", icon: FileBarChart, description: "Consolidado semanal" },
    { id: "employee-summary", name: "Resumo por Funcionário", icon: UserCheck, description: "Dados individuais" },
    { id: "department", name: "Por Departamento", icon: Briefcase, description: "Relatório departamental" },
    { id: "productivity", name: "Produtividade", icon: Activity, description: "Análise de produtividade" },
    { id: "compliance", name: "Conformidade Legal", icon: CheckCircle, description: "Adequação à legislação" }
  ];

  const generateMockData = (reportType: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (reportType) {
      case "timesheet":
        return {
          title: "Espelho de Ponto",
          headers: ["Funcionário", "Entrada", "Almoço Saída", "Almoço Volta", "Saída", "Total Horas"],
          data: employees.map(emp => {
            const entry = timeEntries.find(e => e.userId === emp.name && e.date === today);
            return [
              emp.name,
              entry?.clockIn || "--:--",
              entry?.lunchOut || "--:--", 
              entry?.lunchIn || "--:--",
              entry?.clockOut || "--:--",
              entry ? `${Math.floor(entry.totalHours)}h ${Math.floor((entry.totalHours % 1) * 60)}m` : "0h 0m"
            ];
          })
        };
      case "overtime":
        return {
          title: "Relatório de Horas Extras",
          headers: ["Funcionário", "Horas Extras", "Valor Estimado"],
          data: employees.map(emp => {
            const entry = timeEntries.find(e => e.userId === emp.name && e.date === today);
            const overtimeHours = entry?.overtimeHours || 0;
            return [
              emp.name,
              `${Math.floor(overtimeHours)}h ${Math.floor((overtimeHours % 1) * 60)}m`,
              `R$ ${(overtimeHours * 25).toFixed(2)}`
            ];
          })
        };
      case "daily":
        return {
          title: "Relatório Diário",
          headers: ["Funcionário", "Status", "Horas Trabalhadas", "Último Registro"],
          data: employees.map(emp => {
            const entry = timeEntries.find(e => e.userId === emp.name && e.date === today);
            let status = "Ausente";
            if (entry) {
              switch (entry.status) {
                case 'clocked-in': status = "Trabalhando"; break;
                case 'lunch-break': status = "Almoço"; break;
                case 'lunch-return': status = "Retornou"; break;
                case 'clocked-out': status = "Finalizado"; break;
              }
            }
            return [
              emp.name,
              status,
              entry ? `${Math.floor(entry.totalHours)}h ${Math.floor((entry.totalHours % 1) * 60)}m` : "0h 0m",
              entry?.clockOut || entry?.lunchIn || entry?.lunchOut || entry?.clockIn || "--:--"
            ];
          })
        };
      default:
        return {
          title: `Relatório ${reportType}`,
          headers: ["Item", "Valor"],
          data: [
            ["Dados de exemplo", "100%"],
            ["Informações demonstrativas", "95%"]
          ]
        };
    }
  };

  const generateCSV = (reportData: any) => {
    const headers = reportData.headers.join(",");
    const rows = reportData.data.map((row: any[]) => 
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");
    
    return `${headers}\n${rows}`;
  };

  const generateReport = (reportId: string) => {
    const reportData = generateMockData(reportId);
    const csvContent = generateCSV(reportData);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportData.title.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Relatório gerado",
      description: `${reportData.title} foi baixado com sucesso.`,
    });
  };

  const previewReport = (reportId: string) => {
    const reportData = generateMockData(reportId);
    setCurrentPreview(reportData);
    setPreviewDialogOpen(true);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
        <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Imprimir
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de Relatório</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um relatório" />
              </SelectTrigger>
              <SelectContent>
                {reports.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Data Inicial</label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Data Final</label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Funcionário</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os funcionários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{report.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        Disponível
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Excel/CSV
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1" onClick={() => generateReport(report.id)}>
                    <Download className="w-4 h-4 mr-1" />
                    Gerar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => previewReport(report.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Preview */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPreview?.title}</DialogTitle>
            <DialogDescription>
              Prévia do relatório antes de gerar o arquivo
            </DialogDescription>
          </DialogHeader>
          {currentPreview && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {currentPreview.headers.map((header: string, index: number) => (
                        <th key={index} className="border border-gray-300 p-2 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPreview.data.map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} className="border border-gray-300 p-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => generateReport(selectedReport)} className="bg-red-600 hover:bg-red-700">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar CSV
                </Button>
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsSection;

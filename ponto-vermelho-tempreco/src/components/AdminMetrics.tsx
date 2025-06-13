
interface EmployeeStatus {
  name: string;
  role: string;
  status: string;
  [key: string]: string | number | undefined; // Adiciona assinatura de índice
}

interface HoursWorked {
  employee: string;
  hours: string;
  status: string;
  [key: string]: string | number | undefined; // Adiciona assinatura de índice
}

interface PresentToday {
  employee: string;
  clockIn: string | undefined;
  status: string;
  [key: string]: string | number | undefined; // Adiciona assinatura de índice
}

interface OvertimeHours {
  employee: string;
  overtime: string;
  balance: string;
  [key: string]: string | number | undefined; // Adiciona assinatura de índice
}

type DialogData = EmployeeStatus[] | HoursWorked[] | PresentToday[] | OvertimeHours[];

interface DialogContentState {
  title: string;
  data: DialogData;
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Users, MapPin, Calendar } from "lucide-react";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useState } from "react";

interface AdminMetricsProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
    company: string;
  };
}

export const AdminMetrics = ({ currentUser }: AdminMetricsProps) => {
  const { employees, timeEntries } = useTimeTracking(currentUser);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContentState | null>(null);

  const getActiveEmployees = () => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.filter(entry =>
      entry.date === today &&
      (entry.status === 'clocked-in' || entry.status === 'lunch-break' || entry.status === 'lunch-return')
    ).length;
  };

  const getEmployeeNameById = (userId: string) => {
    const employee = employees.find(emp => emp.id === userId);
    return employee ? employee.name : 'Desconhecido';
  };

  const getTotalHoursWorked = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = timeEntries.filter(entry => entry.date === today);
    const totalHours = todayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    return Math.floor(totalHours);
  };

  const getPresentToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.filter(entry => 
      entry.date === today && entry.clockIn
    ).length;
  };

  const getOvertimeHours = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = timeEntries.filter(entry => entry.date === today);
    const totalOvertime = todayEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0);
    return Math.floor(totalOvertime);
  };

  const handleCardClick = (cardType: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (cardType) {
      case 'employees':
        setDialogContent({
          title: 'Funcionários Ativos',
          data: employees.filter(emp => {
            const entry = timeEntries.find(e => e.userId === emp.id && e.date === today);
            return entry && (entry.status === 'clocked-in' || entry.status === 'lunch-break' || entry.status === 'lunch-return');
          }).map(emp => ({
            name: emp.name,
            role: emp.role,
            status: timeEntries.find(e => e.userId === emp.id && e.date === today)?.status || 'Ausente'
          }))
        });
        break;
      case 'hours':
        setDialogContent({
          title: 'Horas Trabalhadas Hoje',
          data: timeEntries.filter(entry => entry.date === today && entry.totalHours > 0)
            .map(entry => ({
              employee: getEmployeeNameById(entry.userId),
              hours: `${Math.floor(entry.totalHours)}h ${Math.floor((entry.totalHours % 1) * 60)}m`,
              status: entry.status
            }))
        });
        break;
      case 'present':
        setDialogContent({
          title: 'Presentes Hoje',
          data: timeEntries.filter(entry => entry.date === today && entry.clockIn)
            .map(entry => ({
              employee: getEmployeeNameById(entry.userId),
              clockIn: entry.clockIn,
              status: entry.status
            }))
        });
        break;
      case 'overtime':
        setDialogContent({
          title: 'Horas Extras',
          data: timeEntries.filter(entry => entry.date === today && entry.overtimeHours > 0)
            .map(entry => ({
              employee: getEmployeeNameById(entry.userId),
              overtime: `${Math.floor(entry.overtimeHours)}h ${Math.floor((entry.overtimeHours % 1) * 60)}m`,
              balance: entry.accumulatedBalance >= 0 ? 'Positivo' : 'Negativo'
            }))
        });
        break;
    }
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('employees')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveEmployees()}</div>
            <p className="text-xs text-muted-foreground">Trabalhando agora</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('hours')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabalhadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalHoursWorked()}h</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('present')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentes Hoje</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPresentToday()}</div>
            <p className="text-xs text-muted-foreground">{Math.round((getPresentToday() / employees.length) * 100)}% da equipe</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('overtime')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Extras</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOvertimeHours()}h</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
          </DialogHeader>
          {dialogContent && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {dialogContent.data[0] && Object.keys(dialogContent.data[0]).map((key: string) => (
                        <th key={key} className="border border-gray-300 p-2 text-left font-semibold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dialogContent.data.map((row: Record<string, string | number | undefined>, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(row).map((value: string | number | undefined, cellIndex: number) => (
                          <td key={cellIndex} className="border border-gray-300 p-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

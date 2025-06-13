
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserPlus, Edit, Eye } from "lucide-react";
import { useTimeTracking, Employee } from "@/hooks/useTimeTracking";

interface EmployeeListProps {
  currentUser: {
    name: string;
    role: string;
    company: string;
  };
}

const pharmacyRoles = [
  'Farmacêutico',
  'Auxiliar de Farmácia',
  'Técnico em Farmácia',
  'Atendente',
  'Gerente',
  'Supervisor',
  'Caixa',
  'Estoquista'
];

export const EmployeeList = ({ currentUser }: EmployeeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Farmácia',
    age: '',
    gender: 'Masculino' as 'Masculino' | 'Feminino',
    isAdmin: false
  });

  const { employees, addEmployee, updateEmployee, timeEntries } = useTimeTracking(currentUser);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeStatus = (employee: Employee) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = timeEntries.find(entry => 
      entry.userId === employee.name && entry.date === today
    );
    
    if (!todayEntry) return 'Ausente';
    return todayEntry.status === 'clocked-out' ? 'Finalizado' : 
           todayEntry.status === 'lunch-break' ? 'Almoço' : 'Presente';
  };

  const getStatusBadge = (employee: Employee) => {
    const status = getEmployeeStatus(employee);
    
    switch (status) {
      case "Presente":
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>;
      case "Ausente":
        return <Badge className="bg-red-100 text-red-800">Ausente</Badge>;
      case "Almoço":
        return <Badge className="bg-yellow-100 text-yellow-800">Almoço</Badge>;
      case "Finalizado":
        return <Badge className="bg-blue-100 text-blue-800">Finalizado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getEmployeeHours = (employee: Employee) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = timeEntries.find(entry => 
      entry.userId === employee.name && entry.date === today
    );
    
    if (!todayEntry) return "0h 0m";
    return `${Math.floor(todayEntry.totalHours)}h ${Math.floor((todayEntry.totalHours % 1) * 60)}m`;
  };

  const getLastPointTime = (employee: Employee) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = timeEntries.find(entry => 
      entry.userId === employee.name && entry.date === today
    );
    
    if (!todayEntry) return "--:--";
    
    if (todayEntry.clockOut) return todayEntry.clockOut;
    if (todayEntry.lunchIn) return todayEntry.lunchIn;
    if (todayEntry.lunchOut) return todayEntry.lunchOut;
    if (todayEntry.clockIn) return todayEntry.clockIn;
    
    return "--:--";
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role || !newEmployee.age) {
      return;
    }

    addEmployee({
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      age: parseInt(newEmployee.age),
      gender: newEmployee.gender,
      isAdmin: newEmployee.isAdmin
    });

    setNewEmployee({
      name: '',
      email: '',
      role: '',
      department: 'Farmácia',
      age: '',
      gender: 'Masculino',
      isAdmin: false
    });
    setIsAddDialogOpen(false);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee({...employee});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingEmployee && updateEmployee) {
      updateEmployee(editingEmployee);
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Funcionários</CardTitle>
          {currentUser.role === "admin" && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      placeholder="Nome do funcionário"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Cargo</Label>
                    <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {pharmacyRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newEmployee.age}
                      onChange={(e) => setNewEmployee({...newEmployee, age: e.target.value})}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Sexo</Label>
                    <Select value={newEmployee.gender} onValueChange={(value: 'Masculino' | 'Feminino') => setNewEmployee({...newEmployee, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={newEmployee.isAdmin}
                      onChange={(e) => setNewEmployee({...newEmployee, isAdmin: e.target.checked})}
                    />
                    <Label htmlFor="isAdmin">Acesso de Administrador</Label>
                  </div>
                  <Button onClick={handleAddEmployee} className="w-full bg-red-600 hover:bg-red-700">
                    Adicionar Funcionário
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horas Hoje</TableHead>
                <TableHead>Último Ponto</TableHead>
                {currentUser.role === "admin" && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{getStatusBadge(employee)}</TableCell>
                  <TableCell>{getEmployeeHours(employee)}</TableCell>
                  <TableCell>{getLastPointTime(employee)}</TableCell>
                  {currentUser.role === "admin" && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewEmployee(employee)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog para visualizar funcionário */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Funcionário</DialogTitle>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
                </div>
                <div>
                  <Label>Cargo</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.role}</p>
                </div>
                <div>
                  <Label>Departamento</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label>Idade</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.age} anos</p>
                </div>
                <div>
                  <Label>Sexo</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.gender}</p>
                </div>
                <div>
                  <Label>Tipo de Acesso</Label>
                  <p className="text-sm text-gray-600">{selectedEmployee.isAdmin ? 'Administrador' : 'Funcionário'}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para editar funcionário */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Funcionário</DialogTitle>
            </DialogHeader>
            {editingEmployee && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome Completo</Label>
                  <Input
                    id="edit-name"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Cargo</Label>
                  <Select value={editingEmployee.role} onValueChange={(value) => setEditingEmployee({...editingEmployee, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pharmacyRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-age">Idade</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editingEmployee.age.toString()}
                    onChange={(e) => setEditingEmployee({...editingEmployee, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender">Sexo</Label>
                  <Select value={editingEmployee.gender} onValueChange={(value: 'Masculino' | 'Feminino') => setEditingEmployee({...editingEmployee, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isAdmin"
                    checked={editingEmployee.isAdmin}
                    onChange={(e) => setEditingEmployee({...editingEmployee, isAdmin: e.target.checked})}
                  />
                  <Label htmlFor="edit-isAdmin">Acesso de Administrador</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} className="flex-1 bg-red-600 hover:bg-red-700">
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

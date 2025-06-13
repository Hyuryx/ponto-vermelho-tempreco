
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { useTimeTracking } from "@/hooks/useTimeTracking";

interface UserManagementProps {
  currentUser: {
    name: string;
    role: string;
    company: string;
  };
}

export const UserManagement = ({ currentUser }: UserManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'employee' as 'admin' | 'employee',
    employeeId: ''
  });

  const { systemUsers, employees, addSystemUser, updateSystemUser, deleteSystemUser } = useTimeTracking(currentUser);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      return;
    }

    addSystemUser({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      userType: newUser.userType,
      employeeId: newUser.employeeId || undefined
    });

    setNewUser({
      name: '',
      email: '',
      password: '',
      userType: 'employee',
      employeeId: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!editingUser.name || !editingUser.email) {
      return;
    }

    updateSystemUser(editingUser);
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const openEditDialog = (user: any) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const getUserTypeBadge = (userType: 'admin' | 'employee') => {
    return userType === 'admin' ? (
      <Badge className="bg-red-100 text-red-800">Administrador</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">Funcionário</Badge>
    );
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '-';
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : '-';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestão de Usuários</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-name">Nome Completo</Label>
                  <Input
                    id="user-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nome do usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="user-password">Senha</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Digite a senha"
                  />
                </div>
                <div>
                  <Label htmlFor="user-type">Tipo de Usuário</Label>
                  <Select value={newUser.userType} onValueChange={(value: 'admin' | 'employee') => setNewUser({...newUser, userType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.userType === 'employee' && (
                  <div>
                    <Label htmlFor="employee-id">Vincular ao Funcionário</Label>
                    <Select value={newUser.employeeId} onValueChange={(value) => setNewUser({...newUser, employeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleAddUser} className="w-full bg-red-600 hover:bg-red-700">
                  Criar Usuário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo de Usuário</TableHead>
                <TableHead>Funcionário Vinculado</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getUserTypeBadge(user.userType)}</TableCell>
                  <TableCell>{getEmployeeName(user.employeeId)}</TableCell>
                  <TableCell>{user.createdBy}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteSystemUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-user-name">Nome Completo</Label>
                  <Input
                    id="edit-user-name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    placeholder="Nome do usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-user-email">Email</Label>
                  <Input
                    id="edit-user-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-user-type">Tipo de Usuário</Label>
                  <Select value={editingUser.userType} onValueChange={(value: 'admin' | 'employee') => setEditingUser({...editingUser, userType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingUser.userType === 'employee' && (
                  <div>
                    <Label htmlFor="edit-employee-id">Vincular ao Funcionário</Label>
                    <Select value={editingUser.employeeId || ''} onValueChange={(value) => setEditingUser({...editingUser, employeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleEditUser} className="w-full bg-red-600 hover:bg-red-700">
                  Salvar Alterações
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

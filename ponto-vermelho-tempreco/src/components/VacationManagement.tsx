import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, Users, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VacationRequest {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  requestType: 'vacation' | 'justification';
  startDate?: Date;
  endDate?: Date;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  createdBy: string;
}

interface VacationManagementProps {
  currentUser?: {
    name: string;
    role: string;
    company: string;
  };
}

export const VacationManagement = ({ currentUser }: VacationManagementProps) => {
    const { employees } = useTimeTracking(currentUser);
    const { toast } = useToast();
    
    const [requests, setRequests] = useState<VacationRequest[]>(() => {
      const savedRequests = localStorage.getItem('vacationRequests');
      return savedRequests ? JSON.parse(savedRequests) : [];
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<VacationRequest | null>(null);
    
    const [formData, setFormData] = useState({
        employeeName: '',
        position: '',
        department: '',
        requestType: 'vacation' as 'vacation' | 'justification',
        startDate: undefined as Date | undefined,
        endDate: undefined as Date | undefined,
        description: ''
    });
    
    const resetForm = () => {
        setFormData({
            employeeName: '',
            position: '',
            department: '',
            requestType: 'vacation',
            startDate: undefined,
            endDate: undefined,
            description: ''
        });
        setEditingRequest(null);
    };
    
    const handleEmployeeSelect = (employeeName: string) => {
        const selectedEmployee = employees.find(emp => emp.name === employeeName);
        if (selectedEmployee) {
            setFormData({
                ...formData,
                employeeName,
                position: selectedEmployee.role,
                department: selectedEmployee.department
            });
        }
    };

    const validateForm = () => {
        if (!formData.employeeName || !formData.startDate || !formData.endDate) {
            toast({ title: "Erro", description: "Por favor, preencha todos os campos obrigatórios.", variant: "destructive" });
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
      if (!formData.employeeName || !formData.description) {
        toast({
          title: "Erro",
          description: "Nome do funcionário e descrição são obrigatórios.",
          variant: "destructive"
        });
        return;
      }
  
      if (formData.requestType === 'vacation' && (!formData.startDate || !formData.endDate)) {
        toast({
          title: "Erro",
          description: "Para férias, as datas de início e fim são obrigatórias.",
          variant: "destructive"
        });
        return;
      }
  
      const newRequest: VacationRequest = {
        id: editingRequest?.id || Date.now().toString(),
        employeeName: formData.employeeName,
        position: formData.position,
        department: formData.department,
        requestType: formData.requestType,
        startDate: formData.requestType === 'vacation' ? formData.startDate : undefined,
        endDate: formData.requestType === 'vacation' ? formData.endDate : undefined,
        description: formData.description,
        status: 'pending',
        createdAt: editingRequest?.createdAt || new Date().toISOString(),
        createdBy: currentUser?.name || 'Desconhecido'
      };
  
      if (editingRequest) {
        setRequests(prev => {
          const updatedRequests = prev.map(req => req.id === editingRequest.id ? newRequest : req);
          localStorage.setItem('vacationRequests', JSON.stringify(updatedRequests));
          return updatedRequests;
        });
        toast({
          title: "Solicitação atualizada",
          description: "A solicitação foi atualizada com sucesso.",
        });
      } else {
        setRequests(prev => {
          const updatedRequests = [...prev, newRequest];
          localStorage.setItem('vacationRequests', JSON.stringify(updatedRequests));
          return updatedRequests;
        });
        toast({
          title: "Solicitação criada",
          description: "Nova solicitação foi criada com sucesso.",
        });
      }
  
      resetForm();
      setDialogOpen(false);
    };
  const handleEdit = (request: VacationRequest) => {
    setEditingRequest(request);
    setFormData({
      employeeName: request.employeeName,
      position: request.position,
      department: request.department,
      requestType: request.requestType,
      startDate: request.startDate,
      endDate: request.endDate,
      description: request.description
    });
    setDialogOpen(true);
  };

  const handleDelete = (requestId: string) => {
    setRequests(prev => {
      const updatedRequests = prev.filter(req => req.id !== requestId);
      localStorage.setItem('vacationRequests', JSON.stringify(updatedRequests));
      return updatedRequests;
    });
    toast({
      title: "Solicitação removida",
      description: "A solicitação foi removida com sucesso.",
    });
  };

  const handleStatusChange = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setRequests(prev => {
      const updatedRequests = prev.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      );
      localStorage.setItem('vacationRequests', JSON.stringify(updatedRequests));
      return updatedRequests;
    });
    toast({
      title: "Status atualizado",
      description: `Solicitação ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Gestão de Férias e Justificativas</h2>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRequest ? 'Editar Solicitação' : 'Nova Solicitação'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Funcionário</Label>
                  <Select value={formData.employeeName} onValueChange={handleEmployeeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.name}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Solicitação</Label>
                  <Select 
                    value={formData.requestType} 
                    onValueChange={(value: 'vacation' | 'justification') => 
                      setFormData({...formData, requestType: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Férias</SelectItem>
                      <SelectItem value="justification">Justificativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    readOnly={!!formData.employeeName}
                    className={formData.employeeName ? "bg-gray-100" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Input 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    readOnly={!!formData.employeeName}
                    className={formData.employeeName ? "bg-gray-100" : ""}
                  />
                </div>
              </div>
              
              {formData.requestType === 'vacation' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início</Label>
                    <DatePicker
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({...formData, startDate: date})}
                      placeholder="Data de início das férias"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data de Retorno</Label>
                    <DatePicker
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({...formData, endDate: date})}
                      placeholder="Data de retorno das férias"
                    />
                  </div>
                </div>
              )}
              
              {formData.requestType === 'justification' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início</Label>
                    <Input value="N/A" readOnly className="bg-gray-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data de Retorno</Label>
                    <Input value="N/A" readOnly className="bg-gray-100" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Descrição/Motivo</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={formData.requestType === 'vacation' ? 'Motivo das férias...' : 'Justificativa da falta/atraso...'}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
                  {editingRequest ? 'Atualizar' : 'Adicionar'} Solicitação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Solicitações Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma solicitação registrada ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600">{request.position} - {request.department}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(request)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(request.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-500">Tipo:</Label>
                      <p>{request.requestType === 'vacation' ? 'Férias' : 'Justificativa'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Data de Início:</Label>
                      <p>{request.startDate ? format(request.startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Data de Retorno:</Label>
                      <p>{request.endDate ? format(request.endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500">Descrição:</Label>
                    <p className="mt-1">{request.description}</p>
                  </div>
                  
                  {request.status === 'pending' && currentUser?.role === 'admin' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(request.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

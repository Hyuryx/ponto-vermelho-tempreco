
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Edit, Trash2, MapPin } from "lucide-react";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useGeolocation } from "@/hooks/useGeolocation";

interface CompanyManagementProps {
  currentUser: {
    name: string;
    role: string;
    company: string;
  };
}

export const CompanyManagement = ({ currentUser }: CompanyManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    cnpj: '',
    address: '',
    phone: ''
  });

  const { companies, addCompany, updateCompany, deleteCompany } = useTimeTracking(currentUser);
  const location = useGeolocation();

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.cnpj) {
      return;
    }

    addCompany(newCompany);
    setNewCompany({
      name: '',
      cnpj: '',
      address: '',
      phone: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCompany = () => {
    if (!editingCompany.name || !editingCompany.cnpj) {
      return;
    }

    updateCompany(editingCompany);
    setIsEditDialogOpen(false);
    setEditingCompany(null);
  };

  const openEditDialog = (company: any) => {
    setEditingCompany({ ...company });
    setIsEditDialogOpen(true);
  };

  const fillAddressFromLocation = () => {
    if (location.address && location.city && location.country) {
      const fullAddress = `${location.address}, ${location.city}, ${location.country}`;
      setNewCompany({...newCompany, address: fullAddress});
    }
  };

  const fillEditAddressFromLocation = () => {
    if (location.address && location.city && location.country && editingCompany) {
      const fullAddress = `${location.address}, ${location.city}, ${location.country}`;
      setEditingCompany({...editingCompany, address: fullAddress});
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Gestão Multi-empresa
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Building className="w-4 h-4 mr-2" />
                Adicionar Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="company-cnpj">CNPJ</Label>
                  <Input
                    id="company-cnpj"
                    value={newCompany.cnpj}
                    onChange={(e) => setNewCompany({...newCompany, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="company-address">Endereço</Label>
                  <div className="flex gap-2">
                    <Input
                      id="company-address"
                      value={newCompany.address}
                      onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                      placeholder="Endereço da empresa"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillAddressFromLocation}
                      disabled={location.loading || !location.address}
                      title="Preencher com localização atual"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                  {location.loading && (
                    <p className="text-xs text-gray-500 mt-1">Obtendo localização...</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input
                    id="company-phone"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <Button onClick={handleAddCompany} className="w-full bg-red-600 hover:bg-red-700">
                  Adicionar Empresa
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
                <TableHead>CNPJ</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.cnpj}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>{company.createdBy}</TableCell>
                  <TableCell>
                    {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(company)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteCompany(company.id)}
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
              <DialogTitle>Editar Empresa</DialogTitle>
            </DialogHeader>
            {editingCompany && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-company-name">Nome da Empresa</Label>
                  <Input
                    id="edit-company-name"
                    value={editingCompany.name}
                    onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company-cnpj">CNPJ</Label>
                  <Input
                    id="edit-company-cnpj"
                    value={editingCompany.cnpj}
                    onChange={(e) => setEditingCompany({...editingCompany, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company-address">Endereço</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-company-address"
                      value={editingCompany.address}
                      onChange={(e) => setEditingCompany({...editingCompany, address: e.target.value})}
                      placeholder="Endereço da empresa"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillEditAddressFromLocation}
                      disabled={location.loading || !location.address}
                      title="Preencher com localização atual"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-company-phone">Telefone</Label>
                  <Input
                    id="edit-company-phone"
                    value={editingCompany.phone}
                    onChange={(e) => setEditingCompany({...editingCompany, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <Button onClick={handleEditCompany} className="w-full bg-red-600 hover:bg-red-700">
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

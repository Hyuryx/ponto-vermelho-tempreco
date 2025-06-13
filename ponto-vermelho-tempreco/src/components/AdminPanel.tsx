
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Building, Clock, Shield, Globe, Moon, Sun, Info } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { UserManagement } from "@/components/UserManagement";
import { CompanyManagement } from "@/components/CompanyManagement";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  currentUser?: {
    name: string;
    role: string;
    company: string;
  };
}

export const AdminPanel = ({ currentUser = { name: "Admin", role: "admin", company: "TEM PREÇO" } }: AdminPanelProps) => {
  const { 
    settings,
    updateSetting,
    darkMode, 
    toggleDarkMode, 
    workHours, 
    updateWorkHours
  } = useSettings();

  const { toast } = useToast();
  const [localWorkHours, setLocalWorkHours] = useState(workHours);

  const handleSaveWorkHours = () => {
    updateWorkHours(localWorkHours);
    toast({
      title: "Configurações salvas",
      description: "As configurações de horário foram atualizadas com sucesso.",
    });
  };

  const handleLanguageChange = (language: string) => {
    updateSetting('language', language);
    toast({
      title: "Idioma alterado",
      description: `Idioma do sistema alterado para ${language === 'pt-BR' ? 'Português' : language === 'en' ? 'English' : 'Español'}.`,
    });
  };

  const handleTimezoneChange = (timezone: string) => {
    updateSetting('timezone', timezone);
    toast({
      title: "Fuso horário alterado",
      description: "Fuso horário do sistema foi atualizado.",
    });
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'pt-BR': return 'Português (Brasil)';
      case 'en': return 'English';
      case 'es': return 'Español';
      default: return lang;
    }
  };

  const getTimezoneLabel = (tz: string) => {
    switch (tz) {
      case 'America/Sao_Paulo': return 'São Paulo (GMT-3)';
      case 'America/New_York': return 'Nova York (GMT-4)';
      case 'Europe/London': return 'Londres (GMT+1)';
      default: return tz;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Painel de Administração</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de dois fatores</Label>
                    <p className="text-sm text-gray-500">Adiciona uma camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Login obrigatório</Label>
                    <p className="text-sm text-gray-500">Exige login para acessar o sistema</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sessão automática</Label>
                    <p className="text-sm text-gray-500">Logout automático após inatividade</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Preferências do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <Label>Modo escuro</Label>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
                
                <div className="space-y-2">
                  <Label>Idioma do sistema</Label>
                  <Select value={settings.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={getLanguageLabel(settings.language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Fuso horário</Label>
                  <Select value={settings.timezone} onValueChange={handleTimezoneChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={getTimezoneLabel(settings.timezone)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (GMT-4)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="company">
          <CompanyManagement currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Configurações de Horários
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm text-blue-800">Informações Importantes</span>
                </div>
                <div className="text-sm text-blue-700">
                  <p>Essas configurações afetam o cálculo de horas trabalhadas, extras e saldos de todos os funcionários.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-hours">Horas Diárias Obrigatórias</Label>
                  <Input
                    id="daily-hours"
                    type="number"
                    value={localWorkHours.dailyHours}
                    onChange={(e) => setLocalWorkHours({...localWorkHours, dailyHours: parseInt(e.target.value) || 8})}
                    min="1"
                    max="24"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lunch-duration">Duração do Almoço (minutos)</Label>
                  <Input
                    id="lunch-duration"
                    type="number"
                    value={localWorkHours.lunchDuration}
                    onChange={(e) => setLocalWorkHours({...localWorkHours, lunchDuration: parseInt(e.target.value) || 60})}
                    min="30"
                    max="120"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weekly-hours">Horas Semanais</Label>
                  <Input
                    id="weekly-hours"
                    type="number"
                    value={localWorkHours.weeklyHours}
                    onChange={(e) => setLocalWorkHours({...localWorkHours, weeklyHours: parseInt(e.target.value) || 40})}
                    min="20"
                    max="60"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Dias de Funcionamento</Label>
                <div className="flex gap-2 flex-wrap">
                  {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, index) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`day-${index}`}
                        checked={localWorkHours.workingDays.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalWorkHours({
                              ...localWorkHours,
                              workingDays: [...localWorkHours.workingDays, index]
                            });
                          } else {
                            setLocalWorkHours({
                              ...localWorkHours,
                              workingDays: localWorkHours.workingDays.filter(d => d !== index)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`day-${index}`} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSaveWorkHours} className="bg-red-600 hover:bg-red-700">
                Salvar Configurações de Horário
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

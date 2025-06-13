
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, LogOut, Printer } from "lucide-react";
import { TimeClockCard } from "@/components/TimeClockCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  company: string;
}

interface EmployeeDashboardProps {
  currentUser: User;
}

export const EmployeeDashboard = ({ currentUser }: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState("clock");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  useEffect(() => {
    const savedTab = localStorage.getItem('employeeActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('employeeActiveTab', value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = async () => {
    localStorage.removeItem('employeeActiveTab');
    
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-red-600">TEMPREÇO</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Funcionário</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
              <span className="text-xs sm:text-sm text-gray-700 hidden md:inline">{currentUser.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="clock" className="flex items-center gap-2 p-3">
              <Clock className="w-4 h-4" />
              Registro de Ponto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clock">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Registro de Ponto</h2>
              <p className="text-sm sm:text-base text-gray-600">Registre sua entrada, pausas e saída do trabalho</p>
            </div>
            <TimeClockCard currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

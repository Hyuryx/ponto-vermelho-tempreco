import { useState, useEffect } from "react";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  company: string | null;
  department: string | null;
}

const Dashboard = () => {
    console.log("Dashboard component rendered");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      console.log("No user found, redirecting to login");
      navigate("/", { replace: true });
      return;
    }

    // Mock de perfil de usuário
    const mockUserProfile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      full_name: user.displayName || user.email || '',
      role: 'admin', // Define como admin para testes
      company: 'TEMPREÇO',
      department: 'TI'
    };
    setUserProfile(mockUserProfile);
    setLoading(false);
    console.log("Mock profile loaded successfully:", mockUserProfile);
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Erro ao carregar dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Perfil não encontrado</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  // Transformar dados para o formato esperado pelos componentes
  const currentUser = {
    id: userProfile?.id || '',
    name: userProfile?.full_name || userProfile?.email || '',
    email: userProfile?.email || '',
    role: userProfile?.role as "admin" | "employee",
    company: userProfile?.company || "TEMPREÇO"
  };

  // Renderizar dashboard baseado no tipo de usuário
  if (currentUser?.role === "employee") {
    return <EmployeeDashboard currentUser={currentUser} />;
  }

  return <AdminDashboard currentUser={currentUser} />;
};

export default Dashboard;

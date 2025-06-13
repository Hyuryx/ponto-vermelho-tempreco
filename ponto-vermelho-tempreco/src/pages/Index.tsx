import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, BarChart3, MapPin, Calculator, Eye, EyeOff, UserPlus, KeyRound } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user, loading } = useAuth();

  // Carregar dados salvos ao inicializar
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const shouldRemember = localStorage.getItem('rememberLogin') === 'true';

    if (shouldRemember && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        password: savedPassword || ""
      }));
      setRememberLogin(true);
    }
  }, []);

  // Redirecionar se usuário já estiver logado
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const userCredential = await signIn(formData.email, formData.password);

    if (!userCredential) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    } else {
      // Gerenciar dados salvos baseado no checkbox "Lembrar-me"
      if (rememberLogin) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberLogin');
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao TEMPREÇO!",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      const newUser = await signUp(formData.email, formData.password, formData.fullName);

      if (newUser) {
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar a conta",
        });
        setIsSignUp(false);
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Erro ao criar conta",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro no cadastro:", error.message);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.error("Erro no cadastro:", error);
        toast({
          title: "Erro no cadastro",
          description: "Erro ao criar conta",
          variant: "destructive",
        });
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast({
        title: "Email obrigatório",
        description: "Digite seu email para recuperar a senha",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(formData.email);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir a senha",
      });
      setIsForgotPassword(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao enviar email de recuperação",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro desconhecido ao enviar email de recuperação",
          variant: "destructive",
        });
      }
    }
  };

  const handleRememberChange = (checked: CheckedState) => {
    setRememberLogin(checked === true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-2 sm:p-4">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-4 lg:gap-8 items-center">
          {/* Left side - Hero section */}
          <div className="space-y-4 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-2 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-red-600">
                TEMPREÇO
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight">
                Sistema de
                <br />
                Controle de Ponto
                <br />
                Inteligente
              </h2>
              <p className="text-base lg:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                Controle completo da jornada de trabalho com segurança e praticidade
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 mt-4 lg:mt-8">
              <div className="flex flex-col items-center p-2 lg:p-4 bg-white rounded-lg shadow-sm">
                <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 mb-1 lg:mb-2" />
                <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Ponto Automático</span>
              </div>
              <div className="flex flex-col items-center p-2 lg:p-4 bg-white rounded-lg shadow-sm">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 mb-1 lg:mb-2" />
                <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Multiusuário</span>
              </div>
              <div className="flex flex-col items-center p-2 lg:p-4 bg-white rounded-lg shadow-sm">
                <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 mb-1 lg:mb-2" />
                <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Dashboards</span>
              </div>
              <div className="flex flex-col items-center p-2 lg:p-4 bg-white rounded-lg shadow-sm">
                <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 mb-1 lg:mb-2" />
                <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Geolocalização</span>
              </div>
              <div className="flex flex-col items-center p-2 lg:p-4 bg-white rounded-lg shadow-sm">
                <Calculator className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 mb-1 lg:mb-2" />
                <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Cálculo Automático</span>
              </div>
              <div className="flex flex-col items-center p-2 lg:p-4 bg-white rounded-lg shadow-sm">
                <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 mb-1 lg:mb-2" />
                <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Relatórios</span>
              </div>
            </div>

            {/* Demo credentials */}
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Credenciais de Demonstração:</h3>
              <div className="space-y-2 text-xs lg:text-sm">
                <div>
                  <strong>Administrador:</strong><br />
                  Email: admin@tempreco.com<br />
                  Senha: admin123
                </div>
                <div>
                  <strong>Funcionário:</strong><br />
                  Email: funcionario@tempreco.com<br />
                  Senha: func123
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="w-full max-w-md mx-auto order-1 lg:order-2">
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="text-center pb-4 lg:pb-6">
                <CardTitle className="text-3xl lg:text-4xl font-bold text-gray-700 mb-4 lg:mb-6">
                  {isForgotPassword ? "RECUPERAR SENHA" : isSignUp ? "CADASTRO" : "LOGIN"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6 px-6 lg:px-8 pb-6 lg:pb-8">
                {isForgotPassword ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4 lg:space-y-6">
                    <div className="space-y-2">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Email</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10 lg:h-12 mt-4 lg:mt-6 rounded-md text-sm lg:text-lg font-medium">
                      Enviar Email de Recuperação
                    </Button>

                    <div className="text-center space-y-2">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsForgotPassword(false)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Voltar ao Login
                      </Button>
                    </div>
                  </form>
                ) : isSignUp ? (
                  <form onSubmit={handleSignUp} className="space-y-4 lg:space-y-6">
                    <div className="space-y-2">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Nome Completo</label>
                      <Input
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Email</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md"
                        required
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Senha</label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha (mín. 6 caracteres)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-7 lg:top-8 h-6 lg:h-8 w-6 lg:w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" /> : <Eye className="h-3 w-3 lg:h-4 lg:w-4" />}
                      </Button>
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Confirmar Senha</label>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-7 lg:top-8 h-6 lg:h-8 w-6 lg:w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" /> : <Eye className="h-3 w-3 lg:h-4 lg:w-4" />}
                      </Button>
                    </div>

                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10 lg:h-12 mt-4 lg:mt-6 rounded-md text-sm lg:text-lg font-medium">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar Conta
                    </Button>

                    <div className="text-center space-y-2">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsSignUp(false)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Já tem uma conta? Faça login
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
                    <div className="space-y-2">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Email</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md"
                        required
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-gray-600 font-medium text-sm lg:text-base">Senha</label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-gray-100 border-0 text-gray-600 placeholder:text-gray-400 text-sm lg:text-base h-10 lg:h-12 rounded-md pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-7 lg:top-8 h-6 lg:h-8 w-6 lg:w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" /> : <Eye className="h-3 w-3 lg:h-4 lg:w-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-3 lg:mt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberLogin}
                          onCheckedChange={handleRememberChange}
                          className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                        />
                        <label htmlFor="remember" className="text-xs lg:text-sm text-gray-600">
                          Lembrar-me
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-blue-600 hover:text-blue-700 text-xs lg:text-sm p-0"
                      >
                        <KeyRound className="w-3 h-3 mr-1" />
                        Esqueceu a senha?
                      </Button>
                    </div>

                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10 lg:h-12 mt-4 lg:mt-6 rounded-md text-sm lg:text-lg font-medium">
                      Entrar
                    </Button>

                    <div className="text-center space-y-2">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsSignUp(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Não tem uma conta? Cadastre-se
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="text-center mt-4 lg:mt-6">
              <p className="text-xs lg:text-sm text-gray-600">
                100% de acordo com a Portaria 671 do Ministério do Trabalho
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

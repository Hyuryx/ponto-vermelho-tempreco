
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => { // Hook para consumir o contexto de autenticação
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Define como false para simular usuário logado

  // Mock de funções de autenticação
  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log("Mock: Usuário registrado", { email, password, fullName });
    const newUser: User = { uid: 'mock-uid-' + Date.now(), email, displayName: fullName || email };
    setUser(newUser);
    return newUser;
  };

  const signIn = async (email: string, password: string) => {
    console.log("Mock: Usuário logado", { email, password });
    const loggedInUser: User = { uid: 'mock-uid-' + Date.now(), email, displayName: email };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signOut = async () => {
    console.log("Mock: Usuário deslogado");
    setUser(null);
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    console.log("Mock: Email de redefinição de senha enviado para", email);
    // Não faz nada real, apenas simula o envio
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

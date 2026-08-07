import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, setAuthToken, setOnUnauthorized } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const aplicarSessao = useCallback((novoToken, novoUsuario) => {
    setToken(novoToken);
    setUser(novoUsuario);
    setAuthToken(novoToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  /* Se o token expirar/for rejeitado no meio de uma navegação, derruba a sessão local */
  useMemo(() => {
    setOnUnauthorized(() => logout());
  }, [logout]);

  const login = useCallback(async (email, senha) => {
    const resultado = await api.login({ email, senha });
    aplicarSessao(resultado.token, resultado.user);
    return resultado;
  }, [aplicarSessao]);

  const signup = useCallback((email, senha, nome) => api.signup({ email, senha, nome }), []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    signup,
    logout,
  }), [user, token, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook precisa viver junto do Provider/Context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }

  return context;
}

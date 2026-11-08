import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shell, Muted } from '../styles';

export function ProtectedRoute() {
  const { user, isLoading, isError } = useAuth();
  if (isLoading) return <Shell><Muted>Carregando…</Muted></Shell>;
  if (isError) return <Shell><Muted>Não foi possível verificar sua sessão. Recarregue a página.</Muted></Shell>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

interface AdmineRouteProps {
    children: React.ReactNode;
}

export function AdminRoute({ children }: AdmineRouteProps) {
    const { isAdmin } = useAuth();

    return (
    <ProtectedRoute>
        {isAdmin() ? <>{children}</> : <Navigate to="/home" replace />}
    </ProtectedRoute>
    );
        
}
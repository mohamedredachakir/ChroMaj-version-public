import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { isReady, isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="min-h-screen bg-black px-6 py-32 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Validating session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

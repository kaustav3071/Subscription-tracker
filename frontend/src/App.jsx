import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SubscriptionCreate from './pages/SubscriptionCreate';
import SubscriptionEdit from './pages/SubscriptionEdit';
import CategoriesPage from './pages/CategoriesPage';
import CategoryCreate from './pages/CategoryCreate';
import CategoryEdit from './pages/CategoryEdit';
import AdminUserDetails from './pages/AdminUserDetails';
import AdminUserSubscriptions from './pages/AdminUserSubscriptions';
import Support from './pages/Support';
import AdminSupport from './pages/AdminSupport';
import { useAuth } from './context/AuthContext';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-20 text-center text-sm text-gray-500">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-20 text-center text-sm text-gray-500">Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Auth-specific routes */}
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminSupport />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* Protected nested routes */}
        <Route element={<ProtectedRoute />}> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="subscriptions/new" element={<SubscriptionCreate />} />
          <Route path="subscriptions/:id/edit" element={<SubscriptionEdit />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/new" element={<CategoryCreate />} />
          <Route path="categories/:id/edit" element={<CategoryEdit />} />
          <Route path="admin/users/:id" element={<AdminUserDetails />} />
          <Route path="admin/users/:id/subscriptions" element={<AdminUserSubscriptions />} />
        </Route>
      </Route>
    </Routes>
  );
}

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useStore';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check admin status from localStorage (set during login)
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const adminRole = localStorage.getItem('adminRole');
      
      if (adminAuth !== 'true' || !adminRole) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Verify admin role from database
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id);

      if (error) {
        console.error('Profile verification error:', error);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.error('User profile not found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const profile = profiles[0];

      // Check if user has admin or super_admin role
      if (profile.role === 'admin' || profile.role === 'super_admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        // Clear invalid admin session
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminRole');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to admin login page with return URL
    return <Navigate to="/admin-1253223" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;

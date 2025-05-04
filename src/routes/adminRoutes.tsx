
import React from 'react';
import { Route } from 'react-router-dom';
import AdminContainer from '@/components/admin/AdminContainer';
import UsersList from '@/components/admin/UsersList';
import ErrorTestingRoute from '@/routes/admin/ErrorTestingRoute';
import ErrorMonitoringPanel from '@/components/admin/ErrorMonitoringPanel';
import AdminUserListWrapper from '@/components/admin/AdminUserListWrapper';

/**
 * Routes for the admin section of the application
 */
export const adminRoutes = (
  <Route path="/admin" element={<AdminContainer />}>
    <Route index element={<AdminUserListWrapper />} />
    <Route path="users" element={<AdminUserListWrapper />} />
    <Route path="error-testing" element={<ErrorTestingRoute />} />
    <Route path="error-monitor" element={<ErrorMonitoringPanel />} />
  </Route>
);

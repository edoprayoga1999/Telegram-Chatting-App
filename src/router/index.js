import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Chat from '../pages/main/Chat';
import EditProfile from '../pages/main/EditProfile';
import NotFound from '../pages/NotFound';

const PrivateRoute = () => {
	const token = localStorage.getItem('token');
	if (token) {
		return <Outlet />;
	} else {
		return <Navigate to="/login" />;
	}
};

const router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<><PrivateRoute /><Chat /></>} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="edit" element={<><PrivateRoute /><EditProfile /></>} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};
export default router;

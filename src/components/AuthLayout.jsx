import React from 'react';
import Style from '../assets/styles/auth.module.css';

export default function AuthLayout({children}) {
	return (
		<div className={`container-fluid d-flex justify-content-center align-items-center w-100 ${Style.containerLogin}`}>
			<div className={`d-flex flex-column justify-content-center align-items-center ${Style.loginContent}`}>
				{children}
			</div>
		</div>
	);
}

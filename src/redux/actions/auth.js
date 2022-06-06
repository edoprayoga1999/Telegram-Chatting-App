/* eslint-disable no-undef */
import axios from 'axios';

export const login = (data) => {
	return new Promise((resolve, reject) => {
		axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, data)
			.then((result) => {
				localStorage.setItem('token', result.data.token);
				localStorage.setItem('user_id', result.data.data.id);
				resolve(result.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const register = (data) => {
	return new Promise((resolve, reject) => {
		axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, data)
			.then((result) => {
				resolve(result.data);
			})
			.catch((err) => {
				reject(err);
			});
	});

};
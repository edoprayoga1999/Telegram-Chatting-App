import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import { login } from '../../redux/actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Style from '../../assets/styles/auth.module.css';

export default function Login() {
	const navigate = useNavigate();
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		email: '',
		password: ''
	});
	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		if (!form.email || !form.password) {
			swal.fire(
				'Error!',
				'All field must be filled',
				'error'
			);
			setLoading(false);
		} else {
			login(form)
				.then((response) => {
					swal.fire(
						'Success!',
						response.message,
						'success'
					).then(() => { navigate('/'); });
				})
				.catch((err) => {
					swal.fire(
						'Failed!',
						err.response.data.message,
						'error'
					);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};
	useEffect(() => {
		document.title = 'Telegram - Login';
	}, []);
	return (
		<div className={`container-fluid d-flex justify-content-center align-items-center w-100 ${Style.containerLogin}`}>
			<div className={`d-flex flex-column justify-content-center align-items-center ${Style.loginContent}`}>
				<h3 style={{ color: '#7E98DF', marginBottom: '30px' }}>Login</h3>
				<div style={{ display: 'flex', width: '80%' }}>
					<p style={{marginBottom: '30px'}}>Hi, Welcome back!</p>
				</div>
				<form style={{ width: '80%' }} onSubmit={(e) => { onSubmit(e); }}>
					<p style={{ color: '#848484', margin: '0px' }}>Email</p>
					<input className={Style.inputForm} type='email' placeholder='Your email' style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
						onChange={(e) => { setForm({...form, email: e.target.value}); }}
					/>
					<p style={{ color: '#848484', margin: '0px' }}>Password</p>
					<div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #232323', marginBottom: '30px' }}>
						<input className={Style.inputForm} type={passwordVisibility ? 'text' : 'password'} placeholder='Your password'
							onChange={(e) => { setForm({...form, password: e.target.value}); }}
						/>
						<FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} style={{margin: 'auto 0px auto auto'}} onClick={() => { setPasswordVisibility(!passwordVisibility); }} />
					</div>
					<span style={{ display: 'flex', color: '#7E98DF', fontSize: '16px', width: '100%', justifyContent: 'flex-end', marginBottom: '30px' }}>Forgot password?</span>
					<button type='submit' style={{ width: '100%', backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '70px', padding: '20px', marginBottom: '30px' }}>
						{loading ? (<><FontAwesomeIcon icon={faSpinner} spin />&nbsp;Loading</>) : 'Login'}
					</button>
				</form>
				<div style={{ display: 'flex', width: '80%', color: '#848484', marginBottom: '30px'}}>
					<hr style={{width: '30%'}}/>
					<p style={{margin: 'auto'}}>Login With</p>
					<hr style={{width: '30%'}}/>
				</div>
				<button style={{ width: '80%', backgroundColor: '#FFF', border: '1px solid #7E98DF', borderRadius: '70px', color: '#7E98DF', padding: '20px', marginBottom: '30px' }}>
					<FontAwesomeIcon icon={faGoogle} style={{marginRight: '15px'}}/> Google
				</button>
				<div style={{ display: 'flex' }}>
					<p>Don’t have an account?&nbsp;</p>
					<Link to='/register' style={{textDecoration: 'none'}}><p style={{color: '#7E98DF'}}>Sign Up</p></Link>
				</div>
			</div>
		</div>
	);
}

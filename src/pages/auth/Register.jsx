import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../redux/actions/auth';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Style from '../../assets/styles/auth.module.css';
import AuthLayout from '../../components/AuthLayout';
import GoogleButton from '../../components/GoogleButton';

export default function Login() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		email: '',
		password: '',
		fullname: ''
	});
	const [loading, setLoading] = useState(false);
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		if (!form.email || !form.password || !form.fullname) {
			swal.fire(
				'Error!',
				'All field must be filled',
				'error'
			);
			setLoading(false);
		} else {
			register(form)
				.then((response) => {
					swal.fire(
						'Success!',
						response.message,
						'success'
					).then(() => { navigate('/login'); });
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
		document.title = 'Telegram - Register';
	}, []);
	return (
		<AuthLayout>
			<div style={{ display: 'flex', width: '80%', marginBottom: '30px', color: '#7E98DF' }}>
				<Link to='/login'><h3><FontAwesomeIcon icon={faAngleLeft} /></h3></Link>
				<h3 style={{ margin: '0px auto 0px auto' }}>Register</h3>
			</div>
			<div style={{ display: 'flex', width: '80%' }}>
				<p style={{marginBottom: '30px'}}>Let’s create your account!</p>
			</div>
			<form style={{ width: '80%' }} onSubmit={(e) => { onSubmit(e); }} >
				<p style={{ color: '#848484', margin: '0px' }}>Name</p>
				<input type='text' className={Style.inputForm} placeholder='Your name' style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
					onChange={(e) => { setForm({...form, fullname: e.target.value}); }}
				/>
				<p style={{ color: '#848484', margin: '0px' }}>Email</p>
				<input type='email' className={Style.inputForm} placeholder='Your email' style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
					onChange={(e) => { setForm({...form, email: e.target.value}); }}
				/>
				<p style={{ color: '#848484', margin: '0px' }}>Password</p>
				<div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #232323', marginBottom: '30px' }}>
					<input type={passwordVisibility ? 'text' : 'password'} className={Style.inputForm} placeholder='Your password'
						onChange={(e) => { setForm({...form, password: e.target.value}); }}
					/>
					<FontAwesomeIcon icon={passwordVisibility ? faEyeSlash : faEye} style={{margin: 'auto 0px auto auto'}} onClick={() => { setPasswordVisibility(!passwordVisibility); }} />
				</div>
				<button type='submit' style={{ width: '100%', backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '70px', padding: '20px', marginBottom: '30px' }}>
					{loading ? (<><FontAwesomeIcon icon={faSpinner} spin />&nbsp;Loading</>) : 'Register'}
				</button>
			</form>
			<div style={{ display: 'flex', width: '80%', color: '#848484', marginBottom: '30px'}}>
				<hr style={{width: '30%'}}/>
				<p style={{margin: 'auto'}}>Register With</p>
				<hr style={{width: '30%'}}/>
			</div>
			<GoogleButton />
		</AuthLayout>
	);
}

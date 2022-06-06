import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, updatePhoto } from '../../redux/actions/updateUser';
import { getMyProfile } from '../../redux/actions/myProfile';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Style from '../../assets/styles/auth.module.css';
import AuthLayout from '../../components/AuthLayout';

export default function EditProfile() {
	const token = localStorage.getItem('token');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const myProfileData = useSelector((state) => state.myProfile);
	const [form, setForm] = useState({
		fullname: '',
		username: '',
		phone: '',
		bio: ''
	});
	const [profilePhoto, setProfilePhoto] = useState('profile-default.png');
	const [photo, setPhoto] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingPhoto, setLoadingPhoto] = useState(false);
	const [buttonVisibility, setButtonVisibility] = useState(false);
	const photoSubmit = (e) => {
		e.preventDefault();
		setLoadingPhoto(true);
		const formData = new FormData();
		formData.append('photo', photo);
		updatePhoto(formData, token)
			.then((response) => {
				swal.fire(
					'Success!',
					response.message,
					'success'
				).then(() => {
					dispatch(getMyProfile(token));
				});
				setButtonVisibility(!buttonVisibility);
			})
			.catch((err) => {
				swal.fire(
					'Failed!',
					err.response.data.message,
					'error'
				);
				setButtonVisibility(!buttonVisibility);
			})
			.finally(() => {
				setLoadingPhoto(false);
			});
	};
	const onSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		if (!form.fullname) {
			swal.fire(
				'Error!',
				'Fullname cannot be blank',
				'error'
			);
			setLoading(false);
		} else {
			updateProfile(form, token)
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
		dispatch(getMyProfile(token));
		document.title = 'Telegram - Edit Profile';
	}, []);
	useEffect(() => {
		if (myProfileData.data.length !== 0) {
			setForm({
				fullname: myProfileData.data[0]?.fullname,
				username: myProfileData.data[0]?.username,
				phone: myProfileData.data[0]?.phone,
				bio: myProfileData.data[0]?.bio
			});
			setProfilePhoto(myProfileData.data[0]?.photo);
		}
	}, [myProfileData]);
	return (
		<AuthLayout>
			<div style={{ display: 'flex', width: '80%', marginBottom: '30px', color: '#7E98DF' }}>
				<Link to='/'><h3><FontAwesomeIcon icon={faAngleLeft} /></h3></Link>
				<h3 style={{ margin: '0px auto 0px auto' }}>Edit Profile</h3>
			</div>
			<div
				// eslint-disable-next-line no-undef
				style={{ width: '100px', height: '100px', marginBottom: '30px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${profilePhoto}')`, borderRadius: '30px' }}>	
			</div>
			{buttonVisibility ? (<button
				style={{ backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '70px', padding: '15px', marginBottom: '30px' }}
				onClick={() => {document.getElementById('submit').click();}}
			>
				{loadingPhoto ? (<><FontAwesomeIcon icon={faSpinner} spin />&nbsp;Loading</>) : 'Confirm Upload'}
			</button>) : (<button
				style={{ backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '70px', padding: '15px', marginBottom: '30px' }}
				onClick={() => {document.getElementById('photo').click();}}
			>
					Change Photo
			</button>)}
			<form id="form" onSubmit={(e) => photoSubmit(e)}>
				<input
					type="file"
					id="photo"
					onChange={(e) => {
						setPhoto(e.target.files[0]);
						setButtonVisibility(!buttonVisibility);
					}}
					style={{ display: 'none' }}
				/>
				<input type="submit" id="submit" style={{ display: 'none' }} />
			</form>
			<form style={{ width: '80%' }} onSubmit={(e) => { onSubmit(e); }} >
				<p style={{ color: '#848484', margin: '0px' }}>Name</p>
				<input type='text' className={Style.inputForm} placeholder='Your fullname' style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
					onChange={(e) => { setForm({ ...form, fullname: e.target.value }); }}
					value={form.fullname}
				/>
				<p style={{ color: '#848484', margin: '0px' }}>Username</p>
				<input type='text' className={Style.inputForm} placeholder='Your username' style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
					onChange={(e) => { setForm({ ...form, username: e.target.value }); }}
					value={form.username}
				/>
				<p style={{ color: '#848484', margin: '0px' }}>Phone</p>
				<input type='number' className={Style.inputForm} placeholder='Your phone' style={{ borderBottom: '1px solid #232323', marginBottom: '30px' }}
					onChange={(e) => { setForm({ ...form, phone: e.target.value }); }}
					value={form.phone}
				/>
				<p style={{ color: '#848484', margin: '0px' }}>Bio</p>
				<textarea className={Style.inputForm} placeholder='Your bio' style={{ marginBottom: '30px', border: '1px solid #232323' }}
					onChange={(e) => { setForm({ ...form, bio: e.target.value }); }}
					value={form.bio}
				/>
				<button type='submit' style={{ width: '100%', backgroundColor: '#7E98DF', color: '#FFF', border: 'none', borderRadius: '70px', padding: '20px', marginBottom: '30px' }}>
					{loading ? (<><FontAwesomeIcon icon={faSpinner} spin />&nbsp;Loading</>) : 'Edit'}
				</button>
			</form>
		</AuthLayout>
				
	);
}

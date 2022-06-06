/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { BulletList } from 'react-content-loader';
import io from 'socket.io-client';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { getListUser } from '../../redux/actions/listUser';
import { getMyProfile } from '../../redux/actions/myProfile';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAlignJustify,
	faTrash,
	faPlus,
	faMagnifyingGlass,
	faFaceLaugh,
	faCamera,
	faUser,
	faRightFromBracket,
	faGear,
	faAngleLeft,
	faBell,
	faLock,
	faChartLine,
	faCommentDots,
	faLaptop
} from '@fortawesome/free-solid-svg-icons';
import Style from '../../assets/styles/Chat.module.css';
import { 
	Dropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu
} from 'reactstrap';
import Swal from 'sweetalert2';

export default function Chat() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('user_id');
	const [isOpen1, setIsOpen1] = useState(false);
	const [isOpen2, setIsOpen2] = useState(false);
	const listUser = useSelector((state) => state.listUser);
	const myProfile = useSelector((state) => state.myProfile);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [socketIo, setSocketIo] = useState(null);
	const [chat, setChat] = useState([]);
	const [profileData, setProfileData] = useState({
		fullname: '',
		username: '',
		phone: '',
		bio: '',
		photo: 'profile-default.png'
	});
	const [chatWindow, setChatWindow] = useState(false);
	const [receiver, setReceiver] = useState({});
	const [message, setMessage] = useState({
		type: '',
		value: ''
	});
	const [name, setName] = useState('');
	const createNotification = (sender, message) => {
		return NotificationManager.info(message, `New chat from: ${sender}`, 5000);
	};
	const searchUser = (e) => {
		e.preventDefault();
		dispatch(getListUser(token, name));
	};
	const toggle = () => setDropdownOpen(!dropdownOpen);
	const toggleDrawer1 = () => { setIsOpen1(!isOpen1); };
	const toggleDrawer2 = () => { setIsOpen2(!isOpen2); };
	const selectReceiver = (dataReceiver) => {
		setReceiver(dataReceiver);
		localStorage.setItem('receiver', JSON.stringify(dataReceiver));
		socketIo.emit('join-room', parseInt(userId));
		const data = {
			sender: parseInt(userId),
			receiver: parseInt(dataReceiver.id)
		};
		socketIo.emit('chat-history', data);
		setChat([]);
		setChatWindow(true);
	};
	const logout = () => {
		localStorage.clear();
		navigate('/login');
	};
	const onSendMessage = (e) => {
		e.preventDefault();
		const payload = {
			sender_id: parseInt(userId),
			receiver_id: parseInt(receiver.id),
			type: message.type,
			message: message.value
		};
		setChat([...chat, payload]);
		socketIo.emit('send-message', payload);
		setMessage({
			type: '',
			value: ''
		});
	};
	const deleteMessage = (messageId) => {
		const payload = {
			sender: parseInt(userId),
			receiver: parseInt(receiver.id),
			idmessage: messageId
		};
		Swal.fire({
			title: 'Are you sure delete this chat?',
			text: 'This action cant be undone',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#6c757d',
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'Cancel'
		}).then((result) => {
			if (result.isConfirmed) {
				socketIo.emit('delete-message', payload);
			}
		});
	};
	useEffect(() => {
		if (myProfile.data.length !== 0) {
			setProfileData({
				fullname: myProfile.data[0].fullname,
				username: myProfile.data[0].username,
				phone: myProfile.data[0].phone,
				bio: myProfile.data[0].bio,
				photo: myProfile.data[0].photo,
			});
		}
	}, [myProfile]);
	useEffect(() => {
		const socket = io(process.env.REACT_APP_BACKEND_URL);
		socket.on('send-message-response', (response) => {
			const receiver = JSON.parse(localStorage.getItem('receiver'));
			if (response.length > 0) {
				if ((parseInt(receiver.id) === response[0].sender_id) || (parseInt(receiver.id) === response[0].receiver_id)) {
					setChat(response);
				} else {
					createNotification(response[response.length - 1].sender_name, response[response.length - 1].message);
				}
			}
		});
		setSocketIo(socket);
	}, []);
	useEffect(() => {
		document.title = 'Telegram - Chat';
		dispatch(getListUser(token, name));
		dispatch(getMyProfile(token));
	}, []);
	useEffect(() => {
		if (chatWindow) {
			document.getElementById('chatWindow').scrollTo(0, document.getElementById('chatWindow').scrollHeight);
		}
	}, [chat]);
	return (
		<div className='container-fluid d-flex w-100' style={{ padding: '0px', height: '100vh' }}>
			<div className='d-flex flex-column' style={{ width: '25%', padding: '30px', borderRight: '1px solid #E8E8E8' }}>
				<div className='d-flex align-items-center w-100' style={{color: '#7E98DF', marginBottom: '30px'}}>
					<h3>Telegram</h3>
					<Drawer
						open={isOpen1}
						onClose={toggleDrawer1}
						direction='left'
						className='bla bla bla'
						style={{width: '25%'}}
					>
						<div className='d-flex flex-column align-items-center' style={{ width: '100%', padding: '30px', overflowY: 'auto', overflowX: 'hidden' }}>
							<div className='d-flex align-items-center w-100' style={{ marginBottom: '40px' }}>
								<h4 className={Style.backButton} onClick={() => { toggleDrawer1(); }}><FontAwesomeIcon icon={faAngleLeft} /></h4>
								<h4 style={{marginLeft: 'auto', marginRight: 'auto'}}>{ profileData.fullname }</h4>
							</div>
							<div
								style={{ marginBottom: '30px', width: '80px', height: '80px', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${profileData.photo}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '30px' }}
							/>
							<h5 style={{ color: '#000' }}>{profileData.fullname}</h5>
							<p style={{ color: '#848484' }}>{profileData.username || ''}</p>
							<div className='d-flex flex-column w-100'>
								<h6 style={{ color: '#000' }}>Account</h6>
								<p style={{ color: '#000', marginBottom: '0px' }}>{profileData.phone || 'You haven\'t created your phone number yet'}</p>
								<Link to='/edit' style={{ textDecoration: 'none' }}>
									<p style={{ color: '#7E98DF', marginBottom: '0px' }}>Tap to change phone number</p>
								</Link>
								<hr style={{ width: '100%', border: '2px solid #E5E5E5' }} />
								<p style={{ fontWeight: '500', color: '#000', marginBottom: '0px' }}>{profileData.username || 'You haven\'t created your username yet'}</p>
								<p style={{ color: '#848484' }}>Username</p>
								<hr style={{ width: '100%', border: '2px solid #E5E5E5' }} />
								<p style={{ fontWeight: '500', color: '#000', marginBottom: '0px' }}>{profileData.bio || 'You haven\'t created your bio yet'}</p>
								<p style={{ color: '#848484' }}>Bio</p>
								<h6 style={{ color: '#000', marginBottom: '30px' }}>Settings</h6>
							</div>
							<div className='d-flex w-100 align-items-center' style={{color: '#000', marginBottom: '40px'}}>
								<FontAwesomeIcon icon={faBell} style={{ marginRight: '30px'}} size='xl' />
								<p style={{ marginTop: 'auto', marginBottom: 'auto' }}>Notification and Sounds</p>
							</div>
							<div className='d-flex w-100 align-items-center' style={{color: '#000', marginBottom: '40px'}}>
								<FontAwesomeIcon icon={faLock} style={{ marginRight: '30px'}} size='xl' />
								<p style={{ marginTop: 'auto', marginBottom: 'auto' }}>Privaty and Security</p>
							</div>
							<div className='d-flex w-100 align-items-center' style={{color: '#000', marginBottom: '40px'}}>
								<FontAwesomeIcon icon={faChartLine} style={{ marginRight: '30px'}} size='xl' />
								<p style={{ marginTop: 'auto', marginBottom: 'auto' }}>Data and Stronge</p>
							</div>
							<div className='d-flex w-100 align-items-center' style={{color: '#000', marginBottom: '40px'}}>
								<FontAwesomeIcon icon={faCommentDots} style={{ marginRight: '30px'}} size='xl' />
								<p style={{ marginTop: 'auto', marginBottom: 'auto' }}>Chat settings</p>
							</div>
							<div className='d-flex w-100 align-items-center' style={{color: '#000', marginBottom: '40px'}}>
								<FontAwesomeIcon icon={faLaptop} style={{ marginRight: '30px'}} size='xl' />
								<p style={{ marginTop: 'auto', marginBottom: 'auto' }}>Devices</p>
							</div>
						</div>
					</Drawer>
					<Dropdown isOpen={dropdownOpen} toggle={toggle} style={{marginLeft: 'auto', marginRight: '0px'}}>
						<DropdownToggle style={{backgroundColor: '#fff', color: '#7E98DF', border: 'none'}}>
							<h3><FontAwesomeIcon icon={faAlignJustify} /></h3>
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem onClick={() => { toggleDrawer1(); }}>
								<FontAwesomeIcon icon={faUser} /> : {profileData.fullname}
							</DropdownItem>
							<DropdownItem divider />
							<Link to='/edit' style={{textDecoration: 'none'}}>
								<DropdownItem>
									<FontAwesomeIcon icon={faGear}/> Settings
								</DropdownItem>
							</Link>
							<DropdownItem onClick={() => { logout(); }} style={{ color: 'red' }}>
								<FontAwesomeIcon icon={faRightFromBracket}/> Logout
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div className='d-flex align-items-center w-100' style={{ marginBottom: '30px' }}>
					<div className='d-flex align-items-center'
						style={{ width: '90%', paddingLeft: '20px', backgroundColor: '#FAFAFA', color: '#848484', borderRadius: '15px' }}
					>
						<FontAwesomeIcon icon={faMagnifyingGlass} />
						<form style={{ width: '100%' }} onSubmit={(e) => { searchUser(e); }}>
							<input className={Style.searchClass} type='text' placeholder='Type your message...' style={{ width: '100%', border: 'none', padding: '20px', backgroundColor: '#FAFAFA', borderRadius: '15px' }}
								onChange={(e) => { setName(e.target.value); }}
							/>
							<input type='submit' style={{ display: 'none' }} />
						</form>
					</div>
					<FontAwesomeIcon icon={faPlus} size='2xl' style={{ color: '#7E98DF', marginLeft: 'auto', marginRight: '0px' }} />
				</div>
				<div className={`d-flex flex-column ${Style.style2}`} style={{width: '100%', overflowY: 'auto', overflowX: 'hidden', textOverflow: 'ellipsis'}}>
					{/* Start list user */}
					{
						listUser.isLoading ?
							(<BulletList />)
							: listUser.isError ?
								(<div>{listUser.errorMessage}</div>)
								: listUser.data.length > 0 ?
									(listUser.data.map((item, index) => (
										item.user.id !== parseInt(userId) ?
											(<div key={index} className={`d-flex align-items-center w-100 ${Style.userTab}`}
												onClick={() => { selectReceiver(item.user); }}
												style={{ marginBottom: '30px', borderRadius: '10px' }}>
												<div
													style={{ width: '65px', marginRight: '15px', height: '65px', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${item.user.photo}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '20px' }}
												/>
												<div className='d-flex flex-column' style={{ width: '80%', marginLeft: 'auto', marginRight: '0px' }}>
													<div className='d-flex align-items-center' style={{ width: '100%' }}>
														<h6>{item.user.fullname}</h6>
														<p style={{ margin: 'auto 25px auto auto', color: '#848484' }}>
															{item.lastChat === 'No Chat' ? '' : moment(item.lastChat.date).format('HH:mm')}
														</p>
													</div>
													<div className='d-flex align-items-center' style={{ width: '100%'}}>
														<p style={{ marginBottom: 'auto', marginTop: 'auto', color: '#7E98DF' }}>
															{item.lastChat === 'No Chat' ? 'No Chat' : item.lastChat.message}
														</p>
														{item.unreadChat > 0 ? (<p style={{ margin: 'auto 25px auto auto', backgroundColor: '#7E98DF', color: '#FFFFFF', borderRadius: '30px', padding: '0px 10px 0px 10px '}}>
															{item.unreadChat}
														</p>) : null}
													</div>
												</div>
											</div>)
											: null
									))) : (<div>No user available</div>)
					}
				</div>
			</div>
			<Drawer
				open={isOpen2}
				onClose={toggleDrawer2}
				direction='right'
				className='bla bla bla'
				style={{width: '25%'}}
			>
				<div className='d-flex flex-column align-items-center' style={{ width: '100%', padding: '30px', overflowY: 'auto', overflowX: 'hidden' }}>
					<div className='d-flex align-items-center w-100' style={{ marginBottom: '40px', color: '#7E98DF' }}>
						<h4 className={Style.backButton} onClick={() => { toggleDrawer2(); }}><FontAwesomeIcon icon={faAngleLeft} /></h4>
						<h4 style={{marginLeft: 'auto', marginRight: 'auto'}}>{ receiver.username }</h4>
					</div>
					<div
						style={{ marginBottom: '30px', width: '80px', height: '80px', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${receiver.photo}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '30px' }}
					/>
					<div className='d-flex align-items-center w-100' style={{marginBottom: '30px'}}>
						<div className='d-flex flex-column'>
							<h5 style={{ color: '#000' }}>{receiver.fullname}</h5>
							<p>Online</p>
						</div>
						<FontAwesomeIcon icon={faCommentDots} style={{marginLeft: 'auto', marginRight: '0px', color: '#7E98DF'}} size='xl' />
					</div>
					<div className='d-flex flex-column w-100'>
						<h6 style={{ color: '#000' }}>Phone number</h6>
						<p style={{ color: '#000' }}>{receiver.phone || 'No phone number'}</p>
						<h6 style={{ color: '#000' }}>Bio</h6>
						<p style={{ color: '#000', marginBottom: '0px' }}>{receiver.bio || 'No bio'}</p>
						<hr style={{ width: '100%', border: '2px solid #E5E5E5' }} />
					</div>
				</div>
			</Drawer>
			{chatWindow ?
				(
					<div className='d-flex flex-column' style={{ width: '75%' }}>
						{/* Start header */}
						<div className={`d-flex align-items-center w-100 ${Style.backButton}`} style={{ padding: '30px 50px 30px 50px' }} onClick={() => { toggleDrawer2(); }}>
							<div
								style={{ width: '65px', marginRight: '20px', height: '65px', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${receiver.photo}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '20px' }}
							/>
							<div className='d-flex flex-column'>
								<h6>{receiver.fullname}</h6>
								<p style={{color: '#7E98DF'}}>Online</p>
							</div>
						</div>
						<div className={`d-flex flex-column w-100 ${Style.style2}`} id='chatWindow' style={{ height: '100%', backgroundColor: '#FAFAFA', padding: '10px 50px 10px 50px', overflowY: 'auto', overflowX: 'hidden' }}>
							{/* history chat goes here */}
							{chat.length === 0 ? (<p>No messages</p>) : chat.map((item, index) => (
								item.sender_id === parseInt(userId) ? (<div key={index} className='d-flex justify-content-end' style={{ width: '100%', marginBottom: '10px', position: 'relative' }}>
									<div className={`d-flex justify-content-end align-items-center ${Style.divChat}`}>
										<p className={Style.chatDate}>{moment(item.date).calendar()}</p>
										<FontAwesomeIcon icon={faTrash} className={`${Style.delete} text-danger`}
											onClick={() => { deleteMessage(item.id); }}
										/>
										<p style={{ padding: '15px 30px', backgroundColor: '#FFF', color: '#000', borderRadius: '35px 10px 35px 35px', maxWidth: '89%', margin: 'auto 20px 0px 0px' }}>
											{item.message}
										</p>
										<div className='d-flex justify-content-end' style={{ width: '11%' }}>
											<div
												style={{ width: '55px', height: '55px', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${profileData.photo}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '20px' }}
											/>
										</div>
									</div>
								</div>) : (<div key={index} className='d-flex justify-content-start' style={{ width: '100%', marginBottom: '10px', position: 'relative' }}>
									<div className='d-flex justify-content-start' style={{ width: '50%' }}>
										<div className='d-flex justify-content-end' style={{ width: '11%' }}>
											<div
												style={{ width: '55px', margin: 'auto 20px 0px 0px', height: '55px', backgroundImage: `url('${process.env.REACT_APP_BACKEND_URL}/${receiver.photo}')`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '20px' }}
											/>
										</div>
										<p className={Style.receiverChat}>
											{item.message}
										</p>
										<p className={Style.receiverChatDate}>{moment(item.date).calendar()}</p>
									</div>
								</div>)
							))}
						</div>
						{/* Start chat input field */}
						<div className='d-flex align-items-center w-100' style={{ padding: '30px 50px 30px 50px' }}>
							<div className='d-flex align-items-center'
								style={{ width: '100%', paddingRight: '20px', backgroundColor: '#FAFAFA', borderRadius: '15px' }}
							>
								<form style={{ width: '100%' }} onSubmit={(e) => { onSendMessage(e); }}>
									<input className={Style.chatInput} type='text' placeholder='Type your message...' value={message.value}
										onChange={(e) => { setMessage({ type: 'text', value: e.target.value }); }}
									/>
									<input type='submit' style={{display: 'none'}} disabled={!message.value ? true : false } />
								</form>
								<FontAwesomeIcon icon={faPlus} style={{ marginLeft: 'auto', marginRight: '20px', color: '#7E98DF' }} size='2xl' />
								<FontAwesomeIcon icon={faFaceLaugh} style={{ marginRight: '20px', color: '#7E98DF' }} size='2xl' />
								<FontAwesomeIcon icon={faCamera} style={{color: '#7E98DF'}} size='2xl' />
							</div>
						</div>
					</div>
				)
				:
				(
					<div className='d-flex flex-column justify-content-center align-items-center' style={{ width: '75%', backgroundColor: '#FAFAFA', color: '#848484'}}>
						<h3>Please select a chat to start messaging</h3>
					</div>
				)}
			<NotificationContainer/>
		</div>
	);
}

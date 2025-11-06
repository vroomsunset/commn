import { useState, useContext } from 'react';
import api from '../api/axios.js';
// import authcontext from '../context/authcontext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
	const [ username, setUsername ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	// const { setUser } = useContext(authcontext);
	const navigate = useNavigate();

	async function handleSubmit(e){
		e.preventDefault();

		const res = await api.post('/auth/register', { username, email, password });
		console.log(res);

		if( res.data.msg === 'registered' ){
			// setUser(res.data.user);
			//home feed
			navigate('/explore');
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='username'
				placeholder='username'
				value= {username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				type='email'
				placeholder='email'
				value= {email}
				onChange={e => setEmail(e.target.value)}
			/><input
				type='password'
				placeholder='password'
				value= {password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button type='submit'>signup</button>
		</form>
	)
}
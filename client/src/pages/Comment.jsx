import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Comment({Post}){
	const [ content, setContent ] = useState('');
	const navigate = useNavigate();

	function handleSubmit(){
		e.preventDefault;
		try{
			await api.post(`/comment/create`, { postId, content });
			navigate('/explore');
		}catch(e){
			console.error(e);
		}
	}

	return(
		<div
		)
}
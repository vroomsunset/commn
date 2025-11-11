
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import Post from './Post.jsx';
import Postcard from '../components/Postcard.jsx';

export default function Feed(){
	const [ post, setPost ] = useState([]);

	useEffect(()=> {
		async function loadpost(){
			const res = await api.get('/post/explore');
			console.log(res);
			setPost(res.data);
			if(res.data.msg === "sign in first"){
				navigate('/login');
			}
		}
		loadpost();
	}, []); 

	const navigate = useNavigate();

	async function handleLogout(){
		const res = await api.post('/auth/logout');
		if(res.data.msg === 'logged out'){
			navigate('/login');
		}

	}

	function handlenewpost(newpost){
		setPost(prev => [ newpost, ...prev ]);
	}
	console.log(post);

	return (
			<div style={{display : "flex", justifyContent: 'center', alignItems : 'center'}}>
				<div>
					profile
					<button onClick={handleLogout}>
						logout
					</button>
				</div>
				<div style={{backgroundColor : 'black'}}>
					<Post onCreate={handlenewpost}></Post>
					{post.map(p => (
							<Postcard style={{padding: "12px",
						      marginBottom: "12px",
						      borderRadius: "8px"
						  }}key={p.id} post={p}/>
					))}
					</div>
				<div>
					suggestions
				</div>
			</div>
		);
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Post from './Post.jsx';
import Postcard from '../components/Postcard.jsx';

export default function Feed(){
	const [ post, setPost ] = useState([]);
	const navigate = useNavigate();

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
			<div style={{display : "flex", justifyContent: 'center', alignItems : 'center', height : '100vh'}}>
				<div style={{oveflow : 'hidden', marginRight : '0.1rem', backgroundColor : 'inherit', height : "100vh", padding : '0.1rem'}}>
					<div style={{margin : '2rem 0'}}>
						<h2 style={{display: 'flex', justifyContent : 'center', alignItems : 'center'}}>commn.com</h2>
					</div>
					<div style={{flexDirection : 'column', display : 'flex', justifyContent : 'center', alignItems: 'center'}}>
						<button className="nav">
							<h3>Home</h3>
						</button>
						<button className="nav">
							<h3>Explore</h3>
						</button>
						<button className="nav">
							<h3>Notifications</h3>
						</button>
						<button className="nav">
							<h3>Messages</h3>
						</button>
						<button className="nav">
							<h3>Profile</h3>
						</button>
						<button className="nav">
							<h3>Post</h3>
						</button>
						<button className="nav" onClick={handleLogout}>
							<h3>Logout</h3>
						</button>
					</div>
				</div>
				<div className="posts"style={{backgroundColor : 'black', width : "33%", cursor : 'pointer', overflowY : 'auto', height : '100vh', overflowX : 'auto'}}>
					<Post onCreate={handlenewpost}></Post>
					{post.map(p => (
						<Link to={`/comment/${p.id}`} key={p.id}>
							<Postcard style={{padding: "12px",
						      marginBottom: "12px",
						      borderRadius: "8px"
						  }} post={p}/>
						</Link>
					))}
					</div>
				<div style={{overflow : 'hidden', marginLeft : '0.5rem', backgroundColor : 'inherit', height : '100vh', padding : '2rem'}}>
					<div className="trending">
						Trending
					</div>
					<div className="suggestion">
						Suggestions
					</div>
				</div>
			</div>
		);
}
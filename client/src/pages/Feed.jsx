import { useState, useEffect } from 'react';
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
		}
		loadpost();
	}, []); 

	function handlenewpost(newpost){
		setPost(prev => [newpost, ...prev]);
	}
	console.log(post);

	return (
			<div>
				<Post onCreate={handlenewpost}></Post>
				{post.map(p => (
					// key so that react dont confuse and track each list item during re-render
					<Postcard key={p.id} post={p}/>
				))}
			</div>
		);
}
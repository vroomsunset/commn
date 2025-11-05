import { useState } from 'react';
import api from '../api/axios.js';

export default function Post(){
	const [ content, setContent ] = useState('');
	async function handleSubmit(e){
		e.preventDefault();
		if(!content.trim()) return;

		const res = await api.post('/post/create', {content});
		setContent('');
	}

	return(
		<form onSubmit={handleSubmit}>
			<textarea
				placeholder='whats happening'
				value={content}
				onChange={e => setContent(e.target.value)}
			/>
			<button type='submit'>post</button>
		</form>
	)
}
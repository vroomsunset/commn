import { createContext, useState, useEffect } from 'react';

export const authcontext = new createContext();

//to store which user is logged in, this data is not server side
export default function authprovider({ children }){
	const [ user, setUser ] = useState(null);

	useEffect(() => {
		async function loaduser(){
			try{
				const res = await api.get('/auth/me');
				setUser(res.data.user);
			}catch(e){
				console.error(e);
			}
		}
		loaduser();
	}, []);

	return (
		<authcontext.Provider value={{ user, setUser }}>
			{children}
		</authcontext.Provider>
	);
}
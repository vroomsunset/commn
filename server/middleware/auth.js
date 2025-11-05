import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
	const token = req.cookies.token;

	if(!token) return res.status(201).json({msg : "sign in first"});

	// for headers.authorization
	// const parts = authheader.split(" ");
	// if(parts.length !== 2) return res.json({msg : "invalid token format"});

	// const [scheme, token ] = parts;
	// if(scheme !== "Bearer") return res.json({msg : "token must start with bearer"});

	try{
		const decoded = jwt.verify(token, "maxverstappenisthegoat");
		req.user = decoded;
		console.log(req.user);
		//contains the tokens claims
		next();
	}catch(e){
		console.error(e);
		return res.json({msg : "invalid or expired token"});
	}
};

export default auth;

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../db/prisma.js';
import cookie from 'cookie';
import auth from '../middleware/auth.js'

const router = express.Router();
router.use(express.json());

router.post('/register', async(req, res) => {
	console.log(req);
	const { username, email, password } = req.body;
	console.log('register');
	if(!username || !email || !password){
		console.log('invalid format');
	}
	try{
		const exists = await prisma.user.findUnique({ where : { username } });
		if(exists) return res.json({msg : "username already exists"});

		const hash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({ data : {
			username : username,
			email : email,
			password : hash
		}});
		const token = jwt.sign({id : user.id}, "maxverstappenisthegoat", {expiresIn: "7d"});
		return res.cookie('token', token, {
			httpOnly : true,
			secure : false,
			sameSite : "strict"
		}).json({msg : "registered",
				user: {
					id : user.id,
					username : user.username
				}
			});
		
	}catch(e){
		console.error(e);
		return res.json({msg : 'some error occured'});
	}

});


router.post('/login', async(req, res) => {
	console.log(req);
	const { username, password } = req.body;

	try{
		const user = await prisma.user.findUnique({where : { username }});
		if(!user) return res.json({msg : "user does not exist"});

		const match = await bcrypt.compare(password, user.password);
		if(!match) return res.json({ msg : "incorrect password" });

		const token = jwt.sign({id : user.id}, "maxverstappenisthegoat", { expiresIn : "7d"});

		return res.cookie('token', token, {
			httpOnly : true,
			secure : false, 
			sameSite : "strict"
		}).json({msg : 'logged in',
				user: {
					id : user.id,
					username : user.username
				}
			})
		// return res.json({ msg : "login successfull", token });
	}catch(e){
		console.error(e);
		return res.json({msg : "server error"});
	}
})

//when pages reload, state reset, so an endpoint

router.get('/me', auth, async(req, res) => {
	console.log(req);
	const user = await prisma.user.findUnique({
		where : { id : req.user.id },
		select: {
			id : true,
			likeposts : {
				select : { id : true },
			}
		}});
	res.json({user});
})

export default router;
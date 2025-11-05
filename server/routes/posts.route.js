
import express from 'express';
import prisma from '../db/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, async(req, res) => {
	const { content } = req.body;
	try{
		const post = await prisma.post.create({
			data: {
				content,
				authorId : req.user.id
			}
		});
		return res.json({msg : "post created"});
	}catch(e){
		console.error(e);
		return res.json({msg : "something went wrong"});
	}
});


router.get('/explore', auth, async(req, res) => {
	const post = await prisma.post.findMany({ take : 20, 
		include : {
			user : {
				select : { username : true }
			},
			likedBy : { select : { id : true }}
		}
	});
	return res.json(post);

})

export default router;
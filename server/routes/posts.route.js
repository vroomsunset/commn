
import express from 'express';
import prisma from '../db/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, async(req, res) => {
	console.log(req);
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
	console.log(req);
	const post = await prisma.post.findMany({ take : 20, 
		include : {
			user : true,
			_count : { select : { comments : true}},
			likedBy : { select : { id : true }}
		}
	});
	return res.json(post);

})

router.get('/:id', auth, async(req, res) => {
	console.log(req);
	const id = Number(req.params.id);
	try{
		const post = await prisma.post.findUnique({
			where : { id : Number(req.params.id) },
			include : {
				user : { select : { id : true, username : true}},
				comments : {
					include : { author : true },
					orderBy : { createdAt : "desc"}
				}
			}
		});
		res.json({post});
		if(!post) return res.json({msg : 'invalid post id'})
	}catch(e){
		console.error(e)
	}
})


export default router;
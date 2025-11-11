
import express from 'express';
import prisma from '../db/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/add', auth, async(req, res) => {
	console.log(req);
	const { postId, content } = req.body;
	if(typeof postId === 'string') postId = Number(postId);

	try{
		const post = await prisma.post.findUnique({
			where : {
				id : postId
			},
			select : {
				id : true
			}
		});
		if(!post) return res.json({msg : "post does not exist"})
		const comment = await prisma.comment.create({
			data: {
				content,
				postId,
				authorId : req.user.id
			}
		});
		return res.json({ msg: "comment added"});
	}catch(e){
		console.error(e);
		return res.json({ msg : 'something went wrong'});
	}
});

router.get('/:postId', auth, async(req, res) => {
	console.log(req);
	// const { postId } = req.params;
	const postId = Number(req.params.postId);

	const comments = await prisma.comment.findMany({
		where : { postId },
		include : { author : true }
	});

	return res.json(comments);
});

export default router;
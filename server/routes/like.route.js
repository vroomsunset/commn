
import express from 'express';
import prisma from '../db/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/:postid', auth, async(req, res) => {
	const userid = req.user.id;
	const postid = Number(req.params.postid);

	try{
		await prisma.post.update({
			where: { id : postid },
			data : {
				likedBy : { connect : { id : userid }}
			}
		})
		return res.json({ msg : "post liked"});
	}catch(e){
		console.error(e);
		return res.json({ msg : "something went wrong"});
	}

})

router.delete('/:postid', auth, async(req, res) => {
	const userid = req.user.id;
	const postid = Number(req.params.postid);

	try{
		await prisma.post.update({
			where : {id : postid },
			data : {
				likedBy : { disconnect : { id : userid }}
			}
		})

		return res.json({ msg : "unliked"});
	}catch(e){
		console.error(e);
		return res.json({ msg : "something went wrong"});
	}
})

router.get('/:postid/likes', auth, async(req, res) => {
	const postid = Number(req.params.id);

	const post = await prisma.post.findUnique({
		where : { id : postid },
		include : { likedBy : true }
	})

	return res.json({ count : post.likedBy.length });
})


export default router;
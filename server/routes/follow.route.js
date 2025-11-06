
import express from 'express';
import prisma from '../db/prisma.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/:id', auth, async(req, res) => {
	console.log(req);
	const followerid = req.user.id;
	const targetuserid = Number(req.params.id);

	if(followerid === targetuserid) return res.json({ msg : "cannot follow yourself"});

	try{
		await prisma.user.update({
			where : { id : followerid },
			data : {
				following : { connect : { id : targetuserid }}
			}
		})
		return res.json({ msg : "followed" });
	}catch(e){
		console.error(e);
		return res.json({ msg : "something went wrong"});
	}
})

router.delete('/:id', auth, async(req, res) => {
	console.log(req);
	const followerid = req.user.id;
	const targetuserid = Number(req.params.id);

	try{
		await prisma.user.update({
			where : { id : followerid },
			data : {
				following : { disconnect : { id : targetuserid }}
			}
		})
		return res.json({ msg : "unfollowed"})
	}catch(e){
		console.error(e);
		return res.json({ msg : "something went wrong"});
	}
})

router.get('/:id/followers', auth, async(req, res) => {
	console.log(req);
	const userid = Number(req.params.id);

	const user = await prisma.user.findUnique({
		where : { id : userid },
		include : { followers : true }
	})
	return res.json(user.followers);
})

export default router;
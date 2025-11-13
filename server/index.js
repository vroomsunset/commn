
import express from 'express';
import dotenv from 'dotenv';
import cookie from 'cookie';
import cookieparser from 'cookie-parser';
import auth from './routes/users.route.js';
import posts from './routes/posts.route.js';
import comment from './routes/comments.route.js';
import follow from './routes/follow.route.js';
import like from './routes/like.route.js';
import bcrypt from 'bcrypt';
import cors from 'cors';

dotenv.config();
const port = 8080;
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(cors({
	origin : 'http://localhost:5173',
	credentials : true
}));

app.use('/api/v1/auth', auth);
app.use('/api/v1/post', posts);
app.use('/api/v1/comment', comment);
app.use('/api/v1/follow', follow);
app.use('/api/v1/like', like);

app.get('/', (req, res) => {
	console.log('test');
	res.send({msg : 'test'});
})

app.listen(port, () => {
	console.log('listening');
})
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/auth/auth.js';
import poemRouter from './routes/poem/poems.js';
import favRouter from './routes/favourites/fav.js';
import commentRouter from './routes/comment/comments.js';



const app = express();
const port = 3000;
app.use(cors());
app.use(router);
app.use(poemRouter);
app.use(favRouter)
app.use(commentRouter)
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/poem_management_system'
).then(() => { 
    console.log('Connection to MongoDB SUCCESSFUL');
}).catch(err => {
    console.log('Connection to MongoDB FAILED');
    console.log(err);
})



app.listen(port,"0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
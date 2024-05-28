import mongoose from "mongoose";

const poemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true,
    }
});

const Poem = mongoose.model("Poem", poemSchema);

export default Poem;
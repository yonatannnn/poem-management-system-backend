import mongoose from "mongoose";

const favSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    PoemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    poems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poem'
    }]
});

const Favorites = mongoose.model("Favorites", favSchema);

export default Favorites;
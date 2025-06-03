import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference User model
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        enum: ['regular', 'petition'],  // Ensures only 'regular' or 'petition' is allowed
        default: 'regular',
    },
    petition: {
        title: { type: String },
        signatures: { type: [String], default: [] } // Array of userIds who signed
    },
    comments: {
        supporter: { type: [commentSchema], default: [] },
        opposer: { type: [commentSchema], default: [] },
        alternative: { type: [commentSchema], default: [] }
    }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);

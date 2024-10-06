import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  text: String,
  created: {
    type: Date,
    default: Date.now
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  replies: [{
    text: String,
    created: {
      type: Date,
      default: Date.now
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
  }],
});

const postSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
});

const Post = mongoose.model('Post', postSchema);

export default Post;

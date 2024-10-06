import crypto from 'crypto';
import sharp from 'sharp';
import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/post.model.js";


import { deleteFile, getObjectSignedUrl, uploadFile } from '../helpers/s3.js';

export const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');


const listNewsFeed = asyncHandler(async (req, res) => {

  let following = req.user.following;
  try {
    let posts = await Post.find({
      $or: [
        { postedBy: req.user._id },
        { postedBy: { $in: following } }
      ]
    })
      .populate('comments.postedBy', '_id name image')
      .populate('postedBy', '_id name image')
      .sort('-created')
      .lean();

    for (let post of posts) {
      if (post.image) {
        post.imageUrl = await getObjectSignedUrl(post.image)
      }

      if (post.postedBy.image) {
        post.postedBy.imageUrl = await getObjectSignedUrl(post.postedBy.image)
      }

      for (let comment of post.comments) {
        if (comment.postedBy.image) {
          comment.postedBy.imageUrl = await getObjectSignedUrl(comment.postedBy.image)
        }
      }
    }

    res.json(posts);
  } catch (error) {
    res.status(400);
    throw new Error("Error finding post: " + error.message);
  }
})

const listByUser = asyncHandler(async (req, res) => {

  try {
    // Fetch posts from the database as plain JavaScript objects
    let posts = await Post.find({ postedBy: req.params.id })
      .populate('comments.postedBy', '_id name image')
      .populate('postedBy', '_id name image')
      .sort('-created')
      .lean();

    for (let post of posts) {
      if (post.image) {
        post.imageUrl = await getObjectSignedUrl(post.image)
      }

      if (post.postedBy.image) {
        post.postedBy.imageUrl = await getObjectSignedUrl(post.postedBy.image)
      }

      for (let comment of post.comments) {
        if (comment.postedBy.image) {
          comment.postedBy.imageUrl = await getObjectSignedUrl(comment.postedBy.image)
        }
      }
    }

    res.json(posts);
  } catch (err) {
    // Handle errors appropriately
    console.error('Error finding posts', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})



const createPost = asyncHandler(async (req, res) => {
  let imageName = null; // Initialize imageName to null

  // Resize and upload image if available
  if (req.file) {
    const fileBuffer = await sharp(req.file.buffer).resize({ height: 240, width: 320, fit: 'contain' }).toBuffer();

    imageName = generateFileName();

    await uploadFile(fileBuffer, imageName, req.file.mimetype);
  }

  const post = new Post({
    text: req.body.text,
    image: imageName, // Use the imageName variable here
    postedBy: req.body.postedBy,
  });

  const createdPost = await post.save();
  res.status(200).json(createdPost);
});


const deletePost = asyncHandler(async (req, res) => {


  const post = await Post.findById(req.params.id);

  if (post) {

    if (post.image) {
      await deleteFile(post.image)
    }

    await Post.deleteOne({ _id: post._id });
    res.status(200).json({ message: 'Post deleted successfully' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
})

const likePost = asyncHandler(async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(req.body._id,
      {
        $push: { likes: req.body.userId }
      },
      { new: true },
    )
    res.json(result);
  } catch (err) {
    res.status(400);
    throw new Error("Couldn't like the post", err.message);
  }
})



const unlikePost = asyncHandler(async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(req.body._id,
      {
        $pull: { likes: req.body.userId }
      },
      { new: true },
    )
    res.json(result);
  } catch (err) {
    res.status(400);
    throw new Error("Couldn't unlike the post", err.message);
  }
})



const commentPost = asyncHandler(async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  try {
    const result = await Post.findByIdAndUpdate(req.body._id,
      { $push: { comments: comment } },
      { new: true })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')

    res.json(result);
  } catch (err) {
    res.status(400);
    throw new Error('Could not comment on post', err.message);
  }
})

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(req.body._id,
      { $pull: { comments: { _id: req.body.commentId } } },
      { new: true })
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')

    res.json(result);
  } catch (err) {
    res.status(400);
    throw new Error('Could not delete comment', err.message);
  }
})


export {
  commentPost, createPost, deleteComment, deletePost,
  likePost, listByUser, listNewsFeed, unlikePost
};


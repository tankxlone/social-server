import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import {
  createPost,
  listByUser,
  listNewsFeed,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
} from '../controllers/post.controller.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.route('/feed/:id').get(protect, listNewsFeed);
router.route('/by/:id').get(protect, listByUser);
router.route('/new/:id').post(protect, upload.single('image'), createPost);
router.route('/:id').delete(protect, deletePost);
router.route('/like').put(protect, likePost);
router.route('/unlike').put(protect, unlikePost);
router.route('/comment').put(protect, commentPost);
router.route('/uncomment').put(protect, deleteComment);

export default router;

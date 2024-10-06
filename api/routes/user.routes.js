import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.route('/')
  .get(getUsers)
  .post(registerUser)
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('image'), updateUserProfile)

router
  .route('/:id')
  .get(protect, getUserById)
  .delete(protect, deleteUser)

router
  .route('/follow')
  .put(protect, addFollowing, addFollower)

router
  .route('/unfollow')
  .put(protect, removeFollowing, removeFollower)

router
  .route('/findpeople/:id')
  .get(protect, findPeople)

export default router;

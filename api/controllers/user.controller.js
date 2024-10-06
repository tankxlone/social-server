import sharp from 'sharp';
import generateToken from '../helpers/generateToken.js';
import { deleteFile, getObjectSignedUrl, uploadFile } from '../helpers/s3.js';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/user.model.js';
import { generateFileName } from './post.controller.js';

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      image: user.image,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      image: user.image,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {

    let imageName = null;
    let imageUrl = null;


    if (req.file) {

      const fileBuffer = await sharp(req.file.buffer).resize({ height: 100, width: 100, fit: 'contain' }).toBuffer();
      imageName = generateFileName();
      await uploadFile(fileBuffer, imageName, req.file.mimetype)
    }

    const user = await User.findById(req.user._id);



    if (user) {
      user.name = req.body.name ?? user.name;
      user.email = req.body.email ?? user.email;
      user.about = req.body.about ?? user.about;
      user.image = imageName ?? user.image;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();



      if (updatedUser.image) {
        imageUrl = await getObjectSignedUrl(updatedUser.image);
      }

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        about: updatedUser.about,
        image: updatedUser.image,
        imageUrl,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error updating user profile', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);



  if (user) {

    if (user.image) {
      await deleteFile(user.image)
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id)
    .populate({
      path: 'following followers',
      select: '_id name image'
    })
    .select('-password')
    .lean();


  if (user) {
    if (user.image) {
      user.imageUrl = await getObjectSignedUrl(user?.image)
    }

    for (let follow of user.following) {
      if (follow.image) {
        follow.imageUrl = await getObjectSignedUrl(follow.image)
      }
    }

    for (let followd of user.followers) {
      if (followd.image) {
        followd.imageUrl = await getObjectSignedUrl(followd.image)
      }
    }


    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})

const addFollowing = asyncHandler(async (req, res, next) => {

  const { followId } = req.body;

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          following: followId
        }
      },
      { new: true }
    );

    next();
  } catch (err) {
    res.status(400);
    throw new Error('Couldn\'t update user', err);
  }
})

const addFollower = asyncHandler(async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: {
          followers: req.user._id,
        }
      },
      { new: true },
    )
      .populate({
        path: 'following followers',
        select: '_id name'
      })
      .select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(400);
    throw new Error("Couldn't update user: " + error);
  }
});

const removeFollowing = asyncHandler(async (req, res, next) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.unfollowId } },
      { new: true }
    );

    next();
  } catch (err) {
    res.status(400);
    throw new Error("Failed to remove following" + err.message);
  }
})

const removeFollower = asyncHandler(async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.user._id } },
      { new: true }
    )
      .populate({
        path: 'following followers',
        select: '_id name'
      })
      .select('-password');

    res.json(updatedUser);
  } catch (e) {
    res.status(400);
    throw new Error("Failed to remove follower" + e.message);
  }
})

const findPeople = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      || await User.findById(req.params.id);

    const users = await User.find({
      _id: { $nin: [...currentUser.following, currentUser._id] }
    }).select('name image').lean();


    for (let user of users) {
      if (user.image) {

        user.imageUrl = await getObjectSignedUrl(user.image)
      }

    }

    res.json(users);
  } catch (error) {
    res.status(400);
    throw new Error('Error finding users not followed by the current user');
  }
});

export {
  addFollower, addFollowing, authUser, deleteUser, findPeople, getUserById, getUserProfile, getUsers, logoutUser, registerUser, removeFollower, removeFollowing, updateUserProfile
};


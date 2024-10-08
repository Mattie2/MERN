//handle registering/adding post etc

const express = require('express');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   POST api/posts
// @desc    Create a post
// @access  Private (token required)
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private (token required)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(400).json({ msg: "There's no posts yet" });
    } else {
      return res.json(posts);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private (token required)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    } else {
      return res.json(post);
    }
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete specific post
// @access  Private (token required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check the user deleting the post is the owner of the post
    if (req.user.id !== post.user.toString()) {
      res.status(401).json({ msg: 'User not authorized' });
    }

    await post.deleteOne();
    return res.json({ msg: 'Post removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private (token required)
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    } else {
      // check if the post has already been liked by the user
      if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).json({ msg: 'Post already liked' });
      } else {
        // append to like to the start of the array
        post.likes.unshift({ user: req.user.id });
        await post.save();
        return res.json(post.likes);
      }
    }
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a previously liked post
// @access  Private (token required)
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    } else {
      // check if the post has already been liked by the user
      if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length === 0
      ) {
        return res.status(400).json({ msg: "Post isn't liked" });
      }

      const index = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);

      // if the user has liked the post
      post.likes.splice(index, 1);
      await post.save();
      return res.json(post.likes);
    }
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});

// @route   PUT api/posts/comment/:id
// @desc    Comment on a post
// @access  Private (token required)
router.put(
  '/comment/:id',
  auth,
  [check('text', 'Text field is required').not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      } else {
        // append to like to the start of the array
        post.comments.unshift({
          user: req.user.id,
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
        });
        await post.save();
        return res.json(post.comments);
      }
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route   PUT api/posts/uncomment/:post_id/:comment_id
// @desc    Remove comment
// @access  Private (token required)
router.put('/uncomment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    } else {
      // check if the post contains a comment with matching id

      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );

      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      // if the comment was written by the user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).send('Not authorised to remove comment');
      }

      const index = post.comments
        .map((comment) => comment.id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(index, 1);
      await post.save();
      return res.json(post.comments);
    }
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

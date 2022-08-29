//handle registering/adding profile etc

const express = require('express');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get info on current user's profile
// @access  Private (token required)
router.get('/me', auth, async (req, res) => {
  try {
    // TODO: get working without token
    if (req.user.id) {
      console.log(req.user.id);
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name', 'avatar']
      );
      if (!profile) {
        return res
          .status(400)
          .json({ msg: "There's no profile for this user" });
      } else {
        return res.json(profile);
      }
    } else {
      return res.status(400).json({ msg: 'Must provide a valid token' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   POST api/profile
// @desc    Create/Update a user's profile
// @access  Private (token required)
router.post(
  '/',
  auth,
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      // trim removes whitespace
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      } else {
        //create profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route   GET api/profile/
// @desc    Get info about a specified profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.body.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'No profile with this user id' });
    } else {
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   GET api/profile/all
// @desc    Get info on all profiles
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: "There's no profiles yet" });
    } else {
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   GET api/profile/github/:username
// @desc    Get repo's from the user's account
// @access  Public - anyone can view a user's profile
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos
        ?per_page=5
        &sort=created:asc
        &client_id=${config.get('githubClientId')}
        &client_secret={config.get('githubSecret)}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res
          .status(response.statusCode)
          .json({ msg: 'Error finding Github profile' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      // using mongoose method to find user by their id
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // pushes onto beginning, so the experience goes from newest to oldest
        profile.experience.unshift(newExperience);
        await profile.save();
        res.json(profile);
      } else {
        res
          .status(404)
          .json({ msg: "This user doesn't have an assocatied profile" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      // using mongoose method to find user by their id
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // pushes onto beginning, so the education goes from newest to oldest
        profile.education.unshift(newEducation);
        await profile.save();
        res.json(profile);
      } else {
        res
          .status(404)
          .json({ msg: "This user doesn't have an assocatied profile" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// @route   DELETE api/profile/
// @desc    Delete the user, profile and posts
// @access  Private (token required)
router.delete('/', auth, async (req, res) => {
  try {
    // TODO: get working without token

    // TODO remove user's posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ user: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   DELETE api/profile/experience
// @desc    Delete specific experience from user
// @access  Private (token required)
router.delete('/experience/:exp_id', [auth], async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   DELETE api/profile/experience
// @desc    Delete specific experience from user
// @access  Private (token required)
router.delete('/education/:edu_id', [auth], async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    // remove from profile object
    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

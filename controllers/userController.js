const { User } = require('../models');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config.json');
const { Op } = require('sequelize');


// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/users'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, keyword = '' } = req.query;

  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`
            }
          },
          {
            email: {
              [Op.like]: `%${keyword}%`
            }
          }
        ]
      },
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    const usersWithoutPassword = rows.map((user) => {
      return { ...user.toJSON(), password: undefined };
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: usersWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({message: 'User not found'});
    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// Register new user with image upload
const registerUser = upload.single('image_profile'); // 'image_profile' is the field name in your form
const registerUserHandler = async (req, res) => {
  const { name, email, password, role } = req.body;
  const image_profile = req?.file ? req?.file?.filename : undefined; 

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds = 10

    // Create new user with hashed password
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Save hashed password to database
      image_profile,
      role,
    });


    const userWithoutPassword = { ...newUser.toJSON(), password: undefined };

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update user by ID with image upload
const updateUser = upload.single('image_profile');
const updateUserHandler = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const image_profile = req?.file ? req?.file?.filename : undefined; // Check if new image uploaded

  console.log("IMAGE PROFILE : ", image_profile)
  try {
    const user = await User.findByPk(id);
    if (!user) throw Error('User not found');

    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }
    
    user.name = name;
    user.email = email;
    user.role = role;
    if (image_profile) {
      user.image_profile = image_profile;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10); 
    }
    
    await user.save();
    
    const userWithoutPassword = { ...user.toJSON(), password: undefined };

    res.json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// User login
const loginUserHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email not found');
    }

    // Bandingkan password yang dimasukkan dengan password di database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Email or password is incorrect');
    }

    // Generate token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    // Kirim token sebagai respons
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) throw Error('User not found');
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getAllUsers,
  registerUser,
  registerUserHandler,
  updateUser,
  updateUserHandler,
  loginUserHandler,
  deleteUser,
  getUserById
};

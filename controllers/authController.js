const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register user (only Admin can register Trainers and Trainees)
exports.register = async (req, res, next) => {
  const { role, name, email, password, expertise } = req.body;

  // Only Admin can create users
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access.",
      errorDetails: "Only Admin can register users.",
    });
  }

  try {
    const user = await User.create({
      role,
      name,
      email,
      password,
    });

    if (role === "Trainer") {
      // Create Trainer profile
      await Trainer.create({
        user: user._id,
        expertise,
      });
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: `${role} registered successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Validation error occurred.",
      errorDetails: {
        field: "email/password",
        message: "Email and password are required.",
      },
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
        errorDetails: "No user found with this email.",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
        errorDetails: "Incorrect password.",
      });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    statusCode,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

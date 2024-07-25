const UserLG = require('../models/userLGModel')
const Status = require('../models/statusModel');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { updateInventoryCounts } = require('./inventoryController')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '10d' })
}

// login user
const loginUserLG = async (req, res) => {
  const { email, password } = req.body

  try {
    const userLG = await UserLG.login(email, password)
    userLG.isActive = true // Mark user as active
    await userLG.save() // Save the updated user status

    // create a token
    const token = createToken(userLG._id)

    res.status(200).json({ _id: userLG._id, name: userLG.name, email, token, role: userLG.role })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup user
const signupUserLG = async (req, res) => {
  const { name, email, password, role, birthday, number, homeaddress, gender, status, team } = req.body

  try {
    const userLG = await UserLG.signup(name, email, password, role, birthday, number, homeaddress, gender, status, team)

    // Update inventory
    await updateInventoryCounts()

    // create a token
    const token = createToken(userLG._id)

    res.status(200).json({ userLG })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// logout user
const logoutUserLG = async (req, res) => {
  try {
    // Update active status to false
    req.userLG.isActive = false;
    await req.userLG.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/** --- GET ALL USERS --- */
const getUserLG = async (req, res) => {

  const userlgs = await UserLG.find({}).sort({ createdAt: -1 })

  res.status(200).json(userlgs)
}

/** --- GET A SINGLE USER --- */
const getSingleUserLG = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No user found' })
  }

  const userlg = await UserLG.findById(id)

  if (!userlg) {
    return res.status(404).json({ error: "No user found" })
  }

  res.status(200).json(userlg)
}

/** --- UPDATE USER --- */
const updateUserLG = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No user found' })
  }

  try {
    const userlg = await UserLG.findOneAndUpdate({ _id: id }, {
      ...req.body
    }, { new: true })

    if (!userlg) {
      return res.status(400).json({ error: 'No user found' })
    }

    // Parallelize non-dependent operations
    const tasks = [updateInventoryCounts()]

    const statusLog = new Status({
      employeeName: userlg.name,
      role: userlg.role,
      status: userlg.status,
    });
    tasks.push(statusLog.save());

    // Wait for all tasks to complete
    await Promise.all(tasks);

    res.status(200).json(userlg)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/** --- DELETE USER --- */
const deleteUserLG = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No user found' })
  }

  const userlg = await UserLG.findOneAndDelete({ _id: id })

  if (!userlg) {
    return res.status(400).json({ error: 'No user found' })
  }

  // Update inventory
  await updateInventoryCounts()

  res.status(200).json(userlg)

}

module.exports = {
  signupUserLG,
  loginUserLG,
  logoutUserLG,
  updateUserLG,
  getUserLG,
  getSingleUserLG,
  deleteUserLG
}

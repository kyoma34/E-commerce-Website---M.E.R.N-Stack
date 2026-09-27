import UserModel from '../models/User.js';

// ── GET /api/users  (admin only) ─────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// ── DELETE /api/users/:id  (admin only) ──────────────────
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.isAdmin)
      return res.status(400).json({ message: 'Cannot delete an admin account' });

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
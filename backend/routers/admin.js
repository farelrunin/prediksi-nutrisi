const express = require("express");
const router = express.Router();
const { User, FoodEntry, AiFalsePrediction } = require("../models-express");
const { sequelize } = require("../database-express");
const authenticateToken = require("../middleware/auth");

// Security Check Middleware: Only 'admin' or 'owner' (based on email check) are allowed
const verifyAdminOrOwner = (req, res, next) => {
  const allowedEmails = [
    'farelrunin@gmail.com',
    process.env.ADMIN_EMAIL
  ].filter(Boolean);

  if (!req.user || !allowedEmails.includes(req.user.email)) {
    return res.status(403).json({ detail: "Akses ditolak. Hanya akun dengan role 'admin' atau 'owner' yang diizinkan." });
  }
  next();
};

// DELETE /api/admin/users/:userId
router.delete("/users/:userId", authenticateToken, verifyAdminOrOwner, async (req, res) => {
  const { userId } = req.params;

  // Prevent self-deletion
  if (req.user.sub === parseInt(userId) || req.user.email === (await User.findByPk(userId))?.email) {
    return res.status(400).json({ detail: "Anda tidak dapat menghapus akun admin/owner Anda sendiri." });
  }

  const transaction = await sequelize.transaction();
  try {
    // 1. Verify user exists
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ detail: "Pengguna tidak ditemukan." });
    }

    // 2. Cascade delete dependent data to be extremely clean and secure
    await FoodEntry.destroy({ where: { user_id: userId }, transaction });
    try {
      await AiFalsePrediction.destroy({ where: { user_id: userId }, transaction });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError' && err.message.includes("doesn't exist")) {
        console.warn("⚠️ Tabel 'ai_false_predictions' tidak terdeteksi di database. Melompati langkah ini.");
      } else {
        throw err;
      }
    }

    // 3. Delete the user
    await User.destroy({ where: { id: userId }, transaction });

    // Commit transaction
    await transaction.commit();
    
    res.json({ detail: `Pengguna ${user.name} berhasil dihapus beserta seluruh riwayat gizi.` });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Gagal menghapus pengguna:", error);
    res.status(500).json({ detail: "Terjadi kesalahan server saat mencoba menghapus pengguna." });
  }
});

module.exports = router;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// Gửi email đặt lại mật khẩu
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Tạo token JWT có thời hạn 15 phút
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Cập nhật user với token và thời gian hết hạn
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("RESET LINK:", resetLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset mật khẩu Smart Home",
      html: `
        <p>Bạn đã gửi yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào <a href="${resetLink}">đây</a> để cập nhật mật khẩu mới. Link có hiệu lực 15 phút.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xử lý đặt lại mật khẩu mới
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Xác thực và giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Băm mật khẩu mới và lưu
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { forgotPassword, resetPassword };

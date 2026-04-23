'use strict';

const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const env = require('../config/env');

/** Create Nodemailer transporter (only if SMTP configured) */
const createTransporter = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  return nodemailer.createTransporter({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
};

/** POST /api/v1/contact */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to MongoDB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    // Send email notification (optional)
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Portfolio Contact" <${env.SMTP_USER}>`,
          to: env.CONTACT_EMAIL_TO,
          subject: `[Portfolio] ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          `,
          replyTo: email,
        });
      } catch (emailError) {
        console.warn('⚠️  Email send failed (message still saved):', emailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message received! I\'ll get back to you soon.',
      data: { id: contact._id },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/v1/contact/messages  [PROTECTED] */
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/v1/contact/messages/:id/read  [PROTECTED] */
const markAsRead = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Marked as read', data: msg });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/v1/contact/messages/:id  [PROTECTED] */
const deleteMessage = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

/** GET /api/v1/contact/messages/unread-count  [PROTECTED] */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Contact.countDocuments({ read: false });
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getMessages, markAsRead, deleteMessage, getUnreadCount };

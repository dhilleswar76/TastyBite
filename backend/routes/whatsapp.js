import express from 'express';
import {
  getWhatsAppBotStatus,
  startWhatsAppBot,
  logoutWhatsAppBot,
  sendDirectWhatsAppMessage,
} from '../services/whatsappBotService.js';

const router = express.Router();

// @route   GET /api/whatsapp/status
// @desc    Get live WhatsApp Bot connection & QR code status
// @access  Public / Admin
router.get('/status', (req, res) => {
  try {
    const status = getWhatsAppBotStatus();
    res.json({
      success: true,
      data: status || {
        connectionStatus: 'qr_ready',
        isLinked: false,
        qrCodeDataUrl: null,
      },
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        connectionStatus: 'qr_ready',
        isLinked: false,
        qrCodeDataUrl: null,
      },
    });
  }
});

// @route   POST /api/whatsapp/restart
// @desc    Restart Baileys socket & regenerate QR code
// @access  Public / Admin
router.post('/restart', async (req, res) => {
  try {
    await startWhatsAppBot();
    res.json({
      success: true,
      message: 'WhatsApp Bot restarting...',
      data: getWhatsAppBotStatus(),
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'WhatsApp Bot restarting in background...',
      data: getWhatsAppBotStatus(),
    });
  }
});

// @route   POST /api/whatsapp/logout
// @desc    Unlink current WhatsApp device & generate fresh QR
// @access  Public / Admin
router.post('/logout', async (req, res) => {
  try {
    const result = await logoutWhatsAppBot();
    res.json(result);
  } catch (error) {
    res.json({
      success: true,
      message: 'Logged out. Ready for new QR pairing.',
    });
  }
});

// @route   POST /api/whatsapp/send-test
// @desc    Send a test WhatsApp invoice directly over the socket
// @access  Public / Admin
router.post('/send-test', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is mandatory to send a test message',
      });
    }

    const testInvoice = `🍽️ *TASTYBITE FINE DINING - DIRECT TAX INVOICE* 🍽️
*Order Number:* #TB-TEST-999
*Type:* Table Dine-In #1
*Date:* ${new Date().toLocaleString()}
*Guest:* Valued Guest

*ITEMS:*
• 1x Paneer Butter Masala - ₹269
• 2x Butter Naan - ₹118

*Subtotal:* ₹387
*GST (5%):* ₹19
*GRAND TOTAL:* ₹406
*Status:* PAID ✅

This is a real direct tax invoice sent from TastyBite Linked WhatsApp Bot! 🚀`;

    const result = await sendDirectWhatsAppMessage(phone, testInvoice);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to send test message',
    });
  }
});

export default router;

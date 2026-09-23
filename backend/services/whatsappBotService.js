import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_FOLDER = path.join(__dirname, '..', 'whatsapp_session');

// Ensure session directory exists
if (!fs.existsSync(AUTH_FOLDER)) {
  fs.mkdirSync(AUTH_FOLDER, { recursive: true });
}

let sock = null;
let qrCodeDataUrl = null;
let rawQrCode = null;
let connectionStatus = 'initializing'; // 'initializing' | 'qr_ready' | 'connecting' | 'connected' | 'disconnected'
let connectedUser = null;
let isStarting = false;

export const getWhatsAppBotStatus = () => {
  return {
    connectionStatus,
    qrCodeDataUrl,
    rawQrCode,
    connectedUser,
    isLinked: connectionStatus === 'connected',
    sessionPath: AUTH_FOLDER,
  };
};

export const startWhatsAppBot = async () => {
  if (isStarting) return;
  isStarting = true;

  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(`[WhatsApp Baileys Bot] Starting WhatsApp Web Socket v${version.join('.')} (isLatest: ${isLatest})...`);

    sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      auth: state,
      browser: ['TastyBite Fine Dining', 'Chrome', '1.0.0'],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 10000,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        rawQrCode = qr;
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qr, {
            margin: 2,
            width: 320,
            color: {
              dark: '#111827',
              light: '#ffffff',
            },
          });
          connectionStatus = 'qr_ready';
          console.log('[WhatsApp Baileys Bot] 📱 New Pairing QR Code generated! Ready to scan.');
        } catch (qrErr) {
          console.error('[WhatsApp Baileys Bot] QR Generation error:', qrErr.message);
        }
      }

      if (connection === 'connecting') {
        connectionStatus = 'connecting';
        console.log('[WhatsApp Baileys Bot] 🔄 Connecting to WhatsApp Web servers...');
      } else if (connection === 'open') {
        connectionStatus = 'connected';
        qrCodeDataUrl = null;
        rawQrCode = null;
        connectedUser = sock.user;
        console.log(`[WhatsApp Baileys Bot] ✅ WhatsApp Linked Successfully! User: ${sock.user?.id || 'Connected'}`);
      } else if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(`[WhatsApp Baileys Bot] ⚠️ Connection closed due to: ${lastDisconnect?.error?.message || statusCode}. Reconnecting: ${shouldReconnect}`);
        connectionStatus = 'disconnected';
        connectedUser = null;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log('[WhatsApp Baileys Bot] 🚪 Session Logged Out. Clearing auth folder...');
          try {
            fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
            fs.mkdirSync(AUTH_FOLDER, { recursive: true });
          } catch (e) {
            console.warn('Failed to clear session folder:', e.message);
          }
        }

        if (shouldReconnect) {
          setTimeout(() => {
            isStarting = false;
            startWhatsAppBot();
          }, 3000);
        }
      }
    });
  } catch (err) {
    console.error('[WhatsApp Baileys Bot] ❌ Initialization Error:', err.message);
    connectionStatus = 'disconnected';
  } finally {
    isStarting = false;
  }
};

export const logoutWhatsAppBot = async () => {
  try {
    if (sock) {
      await sock.logout();
    }
    fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
    fs.mkdirSync(AUTH_FOLDER, { recursive: true });
    connectionStatus = 'disconnected';
    connectedUser = null;
    qrCodeDataUrl = null;
    isStarting = false;
    setTimeout(() => startWhatsAppBot(), 1500);
    return { success: true, message: 'Logged out successfully. Please re-scan QR code.' };
  } catch (err) {
    console.error('Logout error:', err);
    throw err;
  }
};

/**
 * Sends a message directly over the live WhatsApp Web socket
 * @param {string} phone - Target phone number
 * @param {string} messageText - Formatted invoice message
 */
export const sendDirectWhatsAppMessage = async (phone, messageText) => {
  if (!phone) {
    throw new Error('Customer mobile phone number is required.');
  }

  if (connectionStatus !== 'connected' || !sock) {
    throw new Error('WhatsApp device is not linked yet. Please scan the QR Code in Admin Dashboard (Linked Devices) first.');
  }

  const cleanDigits = String(phone).replace(/[^0-9]/g, '');
  const recipientDigits = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
  const jid = `${recipientDigits}@s.whatsapp.net`;

  console.log(`[WhatsApp Baileys Bot] 📤 Sending direct message to ${jid}...`);

  const sentResult = await sock.sendMessage(jid, { text: messageText });
  console.log(`[WhatsApp Baileys Bot] ✅ Message delivered to ${jid}! Message ID:`, sentResult?.key?.id);

  return {
    success: true,
    message: `Tax Invoice delivered directly to customer WhatsApp (+${recipientDigits})!`,
    recipient: recipientDigits,
    messageId: sentResult?.key?.id,
    timestamp: new Date().toISOString(),
  };
};

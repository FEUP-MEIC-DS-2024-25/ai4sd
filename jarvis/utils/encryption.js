
import crypto from "crypto";

/**
 * Derives a cryptographic key from a passphrase using PBKDF2 and a salt.
 * 
 * This function applies the PBKDF2 key derivation function with 100,000 iterations
 * to securely derive a key of fixed length (32 bytes) based on the provided passphrase and salt.
 * 
 * @param {string} passphrase - The passphrase used to derive the key.
 * @param {Buffer} salt - The salt used in the key derivation process.
 * @returns {Buffer} The derived cryptographic key (32 bytes).
 */
function deriveKey(passphrase, salt) {
    return crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts data using AES-256-CBC with a derived key from a passphrase.
 * 
 * This function generates a random Initialization Vector (IV) and salt, derives
 * a cryptographic key from the passphrase using the salt, and encrypts the data.
 * 
 * @param {Object} data - The data to be encrypted (will be serialized into a string).
 * @param {string} passphrase - The passphrase used to derive the key for encryption.
 * @returns {Object} The encrypted data, including the IV, salt, and the encrypted message.
 */
function encryptData(data, passphrase) {
    const iv = crypto.randomBytes(16); // Generate a random Initialization Vector
    const salt = crypto.randomBytes(16); // Generate a random salt for the KDF
    const key = deriveKey(passphrase, salt); // Derive key from passphrase and salt

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        encryptedData: encrypted,
    };
}

/**
 * Decrypts encrypted data using AES-256-CBC with a derived key from a passphrase and salt.
 * @param {string} encryptedData - The encrypted data in hexadecimal format.
 * @param {string} iv - The Initialization Vector used during encryption, in hexadecimal format.
 * @param {string} salt - The salt used during encryption, in hexadecimal format.
 * @param {string} passphrase - The passphrase used to derive the key for decryption.
 * @returns {Object} The decrypted data, parsed as a JSON object.
 */
function decryptData(encryptedData, iv, salt, passphrase) {
    const key = deriveKey(passphrase, Buffer.from(salt, 'hex')); // Derive the same key using the salt and passphrase
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

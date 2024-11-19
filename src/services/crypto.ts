// import * as crypto from "crypto";

// crypto.getr

async function encryptString(plaintext: string) {
  const ptUtf8 = new TextEncoder().encode(plaintext);
  const pwUtf8 = new TextEncoder().encode(process.env.SECRET_ENCRYPTION_KEY);
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = { name: "AES-GCM", iv: iv };
  const encrpytKey = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "encrypt",
  ]);
  const encrypted = await crypto.subtle.encrypt(alg, encrpytKey, ptUtf8);
  const decoder = new TextDecoder("utf-8");
  const encryptedString = decoder.decode(encrypted);

  return encryptedString;
  // const iv = crypto.randomBytes(16);
  // const cipher = crypto.createCipheriv(
  //   "aes-256-cbc",
  //   process.env.SECRET_ENCRYPTION_KEY.substring(0, 32),
  //   iv
  // );
  // let encrypted = cipher.update(plaintext, "utf8", "hex");
  // encrypted += cipher.final("hex");
  // return `${iv.toString("hex")}:${encrypted}`;
}

async function decryptString(ciphertext: string) {
  // const ptUtf8 = new TextEncoder().encode(plaintext);
  const encryptedArrayB = new TextEncoder().encode(ciphertext);
  const pwUtf8 = new TextEncoder().encode(process.env.SECRET_ENCRYPTION_KEY);
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = { name: "AES-GCM", iv: iv };
  const decryptKey = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "decrypt",
  ]);
  const ptBuffer = await crypto.subtle.decrypt(
    alg,
    decryptKey,
    encryptedArrayB
  );
  const decryptedText = new TextDecoder().decode(ptBuffer);

  return decryptedText;
  // const [ivHex, encrypted] = ciphertext.split(":");
  // const iv = Buffer.from(ivHex, "hex");
  // const decipher = crypto.createDecipheriv(
  //   "aes-256-cbc",
  //   process.env.SECRET_ENCRYPTION_KEY.substring(0, 32),
  //   iv
  // );
  // let decrypted = decipher.update(encrypted, "hex", "utf8");
  // decrypted += decipher.final("utf8");
  // return decrypted;
}

export { encryptString, decryptString };

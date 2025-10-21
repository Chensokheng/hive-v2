import CryptoJS from "crypto-js";

export async function generatePayload(
  amount: string,
  currency: "USD" | "KHR",
  merchantRef: string,
  secret: string
) {
  const iv = "1111111111111111";
  const concateStr = `${amount}/${currency}/${merchantRef}`;

  const cipher = CryptoJS.AES.encrypt(
    concateStr,
    CryptoJS.enc.Utf8.parse(secret),
    {
      iv: CryptoJS.enc.Utf8.parse(iv), // parse the IV
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );

  return cipher.toString();
}

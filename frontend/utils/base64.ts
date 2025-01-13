export function base64Encode(str: string): string {
  // Convert string to array buffer
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buffer[i] = str.charCodeAt(i);
  }
  return wx.arrayBufferToBase64(buffer.buffer);
}

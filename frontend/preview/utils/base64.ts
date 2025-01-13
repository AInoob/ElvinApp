export function base64Encode(str: string): string {
  const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  
  while (i < str.length) {
    const char1 = str.charCodeAt(i++);
    const char2 = i < str.length ? str.charCodeAt(i++) : 0;
    const char3 = i < str.length ? str.charCodeAt(i++) : 0;

    const triplet = (char1 << 16) | (char2 << 8) | char3;
    
    result +=
      base64chars[(triplet >> 18) & 63] +
      base64chars[(triplet >> 12) & 63] +
      (char2 ? base64chars[(triplet >> 6) & 63] : '=') +
      (char3 ? base64chars[triplet & 63] : '=');
  }
  
  return result;
}

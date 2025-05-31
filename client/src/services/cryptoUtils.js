export const isBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

// Ước lượng entropy dựa trên tần suất ký tự
export const estimateEntropy = (text) => {
  const freq = {};
  for (let i = 0; i < text.length; i++) {
    const c = text.charAt(i);
    freq[c] = (freq[c] || 0) + 1;
  }

  let entropy = 0;
  for (let char in freq) {
    const p = freq[char] / text.length;
    entropy -= p * Math.log2(p);
  }

  return entropy;
};

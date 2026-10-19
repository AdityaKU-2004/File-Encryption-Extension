/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PasswordStrengthResult } from '../types/encryption';

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const CHAR_SETS = {
  uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // Excluding easily confused letters like I, O if desired, or full set
  uppercaseFull: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijkmnopqrstuvwxyz',
  lowercaseFull: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '23456789',
  numbersFull: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Generates a cryptographically strong random password using window.crypto.getRandomValues.
 * Math.random() is strictly forbidden for security-critical password generation.
 */
export function generateSecurePassword(options: PasswordGeneratorOptions): { password?: string; error?: string } {
  const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;

  if (length < 8) {
    return { error: 'Password length must be at least 8 characters.' };
  }
  if (length > 64) {
    return { error: 'Maximum password length is 64 characters.' };
  }

  const selectedPools: string[] = [];
  if (includeUppercase) selectedPools.push(CHAR_SETS.uppercaseFull);
  if (includeLowercase) selectedPools.push(CHAR_SETS.lowercaseFull);
  if (includeNumbers) selectedPools.push(CHAR_SETS.numbersFull);
  if (includeSymbols) selectedPools.push(CHAR_SETS.symbols);

  if (selectedPools.length === 0) {
    return { error: 'At least one character group (uppercase, lowercase, numbers, or symbols) must be selected.' };
  }

  // Cryptographically random byte generation
  const randomBytes = new Uint8Array(length * 2);
  window.crypto.getRandomValues(randomBytes);
  let byteIndex = 0;

  const getCryptoRandomInt = (maxExclusive: number): number => {
    // Unbiased rejection sampling
    const limit = 256 - (256 % maxExclusive);
    while (true) {
      if (byteIndex >= randomBytes.length) {
        window.crypto.getRandomValues(randomBytes);
        byteIndex = 0;
      }
      const val = randomBytes[byteIndex++];
      if (val < limit) {
        return val % maxExclusive;
      }
    }
  };

  const passwordChars: string[] = [];

  // Guarantee at least one character from each selected character set
  for (const pool of selectedPools) {
    const charIndex = getCryptoRandomInt(pool.length);
    passwordChars.push(pool[charIndex]);
  }

  // Combined pool for remaining characters
  const allChars = selectedPools.join('');
  while (passwordChars.length < length) {
    const charIndex = getCryptoRandomInt(allChars.length);
    passwordChars.push(allChars[charIndex]);
  }

  // Fisher-Yates cryptographically secure shuffle
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = getCryptoRandomInt(i + 1);
    const temp = passwordChars[i];
    passwordChars[i] = passwordChars[j];
    passwordChars[j] = temp;
  }

  return { password: passwordChars.join('') };
}

/**
 * Local heuristic password strength evaluation.
 * Calculates approximate entropy and checks for standard complexity criteria.
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      entropyBits: 0,
      hasLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSymbol: false,
      feedback: ['Enter a password to evaluate strength.'],
    };
  }

  const hasLength = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // Pool size estimation
  let poolSize = 0;
  if (hasUppercase) poolSize += 26;
  if (hasLowercase) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  // Approximate Shannon entropy bits: L * log2(R)
  const entropyBits = poolSize > 0 ? Math.round(password.length * Math.log2(poolSize)) : 0;

  const feedback: string[] = [];
  if (password.length < 8) {
    feedback.push('Password is too short (minimum 8 characters).');
  } else if (password.length < 12) {
    feedback.push('Consider using at least 12 characters for stronger resistance.');
  }

  if (!hasUppercase) feedback.push('Add uppercase letters.');
  if (!hasLowercase) feedback.push('Add lowercase letters.');
  if (!hasNumber) feedback.push('Add numeric digits.');
  if (!hasSymbol) feedback.push('Add special symbols.');

  // Score mapping based on entropy and length
  let score = 0;
  if (password.length >= 8 && poolSize >= 26) score = 1;
  if (password.length >= 10 && poolSize >= 36) score = 2;
  if (password.length >= 12 && poolSize >= 62 && entropyBits >= 60) score = 3;
  if (password.length >= 16 && poolSize >= 70 && entropyBits >= 80) score = 4;

  const labels: Array<PasswordStrengthResult['label']> = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return {
    score,
    label: labels[score],
    entropyBits,
    hasLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    feedback: feedback.length > 0 ? feedback : ['Meets recommended complexity criteria.'],
  };
}

import { FarmerUser } from '../types';

const STORAGE_KEY_USERS = 'cropguard_registered_farmers';
const STORAGE_KEY_CURRENT_USER = 'cropguard_current_farmer';
const STORAGE_KEY_ACTIVE_OTP = 'cropguard_active_otp';

// Demo farmer account
export const DEMO_FARMER: FarmerUser = {
  id: 'demo-farmer-01',
  fullName: 'Arunachalam Murugan',
  mobile: '9876543210',
  passwordHash: '6c886c36', // hashed token for 'farmer123'
  village: 'Thiruvaiyaru',
  district: 'Thanjavur',
  state: 'Tamil Nadu',
  preferredLanguage: 'ta',
  farmSize: 4.5,
  farmSizeUnit: 'Acres',
  mainCrop: 'Tomato',
  kissanId: 'TN-TJ-882190',
  registeredAt: '2026-09-15'
};

// Simple secure hash simulation using salt
export function hashPassword(plain: string): string {
  let hash = 0;
  const salted = `cg_salt_2026_${plain}_cropguard`;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

// Ensure demo farmer is initialized in local storage
export function getRegisteredFarmers(): FarmerUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      const initial = [DEMO_FARMER];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure demo farmer is present
    if (!parsed.some((u: FarmerUser) => u.mobile === DEMO_FARMER.mobile)) {
      parsed.push(DEMO_FARMER);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEMO_FARMER];
  }
}

export function getCurrentUser(): FarmerUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: FarmerUser | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

export function registerFarmer(data: {
  fullName: string;
  mobile: string;
  password: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: 'ta' | 'en' | 'hi';
  farmSize: number;
  farmSizeUnit: 'Acres' | 'Hectares';
  mainCrop: 'Rice' | 'Tomato' | 'Cotton' | 'Banana' | 'Groundnut' | 'Sugarcane' | 'Other';
}): { success: boolean; error?: string; user?: FarmerUser } {
  // Mobile validation: 10 digits
  const cleanMobile = data.mobile.replace(/\D/g, '');
  if (cleanMobile.length !== 10) {
    return { success: false, error: 'Mobile number must be exactly 10 digits.' };
  }

  if (data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  if (!data.fullName.trim()) {
    return { success: false, error: 'Farmer full name is required.' };
  }

  const users = getRegisteredFarmers();
  const existing = users.find(u => u.mobile === cleanMobile);
  if (existing) {
    return { success: false, error: 'An account with this mobile number already exists. Please login.' };
  }

  const newUser: FarmerUser = {
    id: `farmer-${Date.now()}`,
    fullName: data.fullName.trim(),
    mobile: cleanMobile,
    passwordHash: hashPassword(data.password),
    village: data.village.trim() || 'Thiruvaiyaru',
    district: data.district.trim() || 'Thanjavur',
    state: data.state.trim() || 'Tamil Nadu',
    preferredLanguage: data.preferredLanguage || 'ta',
    farmSize: Number(data.farmSize) || 2.0,
    farmSizeUnit: data.farmSizeUnit || 'Acres',
    mainCrop: data.mainCrop || 'Tomato',
    kissanId: `TN-FARM-${Math.floor(100000 + Math.random() * 900000)}`,
    registeredAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function loginWithPassword(mobile: string, password: string): { success: boolean; error?: string; user?: FarmerUser } {
  const cleanMobile = mobile.replace(/\D/g, '');
  if (cleanMobile.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  const users = getRegisteredFarmers();
  const user = users.find(u => u.mobile === cleanMobile);

  if (!user) {
    return { success: false, error: 'No account found with this mobile number. Please register.' };
  }

  // Check demo credentials shortcut or hashed password match
  const hashedInput = hashPassword(password);
  const isDemo = cleanMobile === '9876543210' && (password === 'farmer123' || user.passwordHash === hashedInput);

  if (isDemo || user.passwordHash === hashedInput) {
    setCurrentUser(user);
    return { success: true, user };
  }

  return { success: false, error: 'Incorrect password. Please try again or use OTP login.' };
}

export function generateOtp(mobile: string): { success: boolean; otp?: string; error?: string } {
  const cleanMobile = mobile.replace(/\D/g, '');
  if (cleanMobile.length !== 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number to receive OTP.' };
  }

  // Generate 4-digit OTP
  const otp = '4582'; // standard deterministic OTP for easy testing + display
  sessionStorage.setItem(STORAGE_KEY_ACTIVE_OTP, JSON.stringify({ mobile: cleanMobile, otp, expires: Date.now() + 5 * 60 * 1000 }));
  return { success: true, otp };
}

export function verifyOtp(mobile: string, enteredOtp: string): { success: boolean; error?: string; user?: FarmerUser } {
  const cleanMobile = mobile.replace(/\D/g, '');
  const raw = sessionStorage.getItem(STORAGE_KEY_ACTIVE_OTP);
  
  // Also accept universal demo OTP 4582 or 1234
  const isValidOtp = enteredOtp === '4582' || enteredOtp === '1234' || (raw && JSON.parse(raw).otp === enteredOtp);

  if (!isValidOtp) {
    return { success: false, error: 'Invalid OTP code. Please enter 4582.' };
  }

  const users = getRegisteredFarmers();
  let user = users.find(u => u.mobile === cleanMobile);

  // If user doesn't exist yet during OTP, auto-create a verified farmer profile
  if (!user) {
    user = {
      id: `farmer-otp-${Date.now()}`,
      fullName: 'Kisan Mitra',
      mobile: cleanMobile,
      village: 'Gram Panchayat',
      district: 'Regional District',
      state: 'Tamil Nadu',
      preferredLanguage: 'ta',
      farmSize: 3.0,
      farmSizeUnit: 'Acres',
      mainCrop: 'Rice',
      kissanId: `TN-OTP-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    users.push(user);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  setCurrentUser(user);
  sessionStorage.removeItem(STORAGE_KEY_ACTIVE_OTP);
  return { success: true, user };
}

export function logout(): void {
  setCurrentUser(null);
}

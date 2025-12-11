import { registerPetOwner, loginPetOwner } from './api';

export async function register({ firstName, lastName, email, password }) {
  try {
    const user = await registerPetOwner({
      firstName,
      lastName,
      email,
      password,
    });
    
    // Store user info (without password) in localStorage
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    localStorage.setItem('furluv_current_user', JSON.stringify(userData));
    
    return { success: true, user: userData };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Registration failed. Email may already be in use.' 
    };
  }
}

export async function login({ email, password }) {
  try {
    const user = await loginPetOwner({ email, password });
    
    // Store user info in localStorage
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    localStorage.setItem('furluv_current_user', JSON.stringify(userData));
    
    return { success: true, user: userData };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Invalid email or password.' 
    };
  }
}

export function logout() {
  localStorage.removeItem('furluv_current_user');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('furluv_current_user') || 'null');
}
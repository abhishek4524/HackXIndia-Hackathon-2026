export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alpha-vision-squad-api.vercel.app/api';

export interface UserData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export const registerUser = async (userData: UserData): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data: { message: string; user?: BackendUser; error?: string } = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Transform backend response to match frontend expected format
    return {
      message: data.message,
      user: data.user ? {
        id: data.user._id, // Convert _id to id
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone
      } : undefined
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred during registration');
  }
};

export interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    // Handle both token and authToken cases
    const data: { 
      message: string; 
      token?: string; 
      authToken?: string;  // Add authToken to the response type
      user?: BackendUser; 
      error?: string 
    } = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Use token if available, otherwise use authToken
    const token = data.token || data.authToken;

    // Transform backend response to match frontend expected format
    return {
      message: data.message,
      token: token, // Use the available token
      user: data.user ? {
        id: data.user._id, // Convert _id to id
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone
      } : undefined
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred during login');
  }
};
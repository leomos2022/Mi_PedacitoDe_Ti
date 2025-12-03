export interface User {
  id: string;
  username: string;
  email: string;
  timezone: string;
  location: {
    lat: number;
    lng: number;
  };
  profilePhoto?: string;
}

export interface Photo {
  _id: string;
  userId: string | User;
  imageUrl: string;
  thumbnailUrl?: string;
  caption: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  category: 'together_mode' | 'shared_gallery' | 'synchronized_sunsets' | 'general';
  isMemory: boolean;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceMessage {
  _id: string;
  userId: string | User;
  audioUrl: string;
  duration: number;
  isPlayed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

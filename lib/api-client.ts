// import axios from 'axios';
// import { useAuth } from '@clerk/nextjs';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Client-side authentication interceptor
// if (typeof window !== 'undefined') {
//   apiClient.interceptors.request.use(async (config) => {
//     const token = await getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });
// }

// // Helper to get Clerk token
// async function getAuthToken(): Promise<string | null> {
//   try {
//     const { getToken } = await import('@clerk/nextjs');
//     return await getToken();
//   } catch (error) {
//     console.error('Failed to get auth token:', error);
//     return null;
//   }
// }
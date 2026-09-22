import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { clearOtpSessions, sendOtp, verifyOtpCode } from '../services/otp';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasGrantedLocation: boolean;
  phoneNumber: string;
  isVerifying: boolean;
  otpPreviewCode: string | null;
  hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  setPhoneNumber: (phone: string) => void;
  completeOnboarding: () => void;
  requestOtp: (phone: string) => Promise<{ ok: boolean; error?: string; previewCode?: string }>;
  verifyOtp: (code: string) => Promise<{ ok: boolean; error?: string }>;
  grantLocation: () => void;
  skipLocation: () => void;
  logout: () => void;
  resetDemoAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      hasGrantedLocation: false,
      phoneNumber: '',
      isVerifying: false,
      otpPreviewCode: null,
      hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      setPhoneNumber: (phone: string) => set({ phoneNumber: phone }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      requestOtp: async (phone: string) => {
        set({ phoneNumber: phone, isVerifying: true, otpPreviewCode: null });
        const result = await sendOtp(phone);
        if (!result.ok) {
          set({ isVerifying: false });
          return { ok: false, error: result.error };
        }
        set({ isVerifying: false, otpPreviewCode: result.previewCode });
        return { ok: true, previewCode: result.previewCode };
      },

      verifyOtp: async (code: string) => {
        const { phoneNumber } = get();
        set({ isVerifying: true });
        const result = verifyOtpCode(phoneNumber, code);
        if (!result.ok) {
          set({ isVerifying: false });
          return { ok: false, error: result.error };
        }
        set({
          isAuthenticated: true,
          isVerifying: false,
          otpPreviewCode: null,
        });
        return { ok: true };
      },

      grantLocation: () => set({ hasGrantedLocation: true }),

      skipLocation: () => set({ hasGrantedLocation: true }),

      logout: () => {
        clearOtpSessions();
        set({
          isAuthenticated: false,
          hasGrantedLocation: false,
          hasCompletedOnboarding: true,
          phoneNumber: '',
          otpPreviewCode: null,
        });
      },

      resetDemoAuth: () => {
        clearOtpSessions();
        set({
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          hasGrantedLocation: false,
          phoneNumber: '',
          isVerifying: false,
          otpPreviewCode: null,
        });
      },
    }),
    {
      name: 'quickride-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasGrantedLocation: state.hasGrantedLocation,
        phoneNumber: state.phoneNumber,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

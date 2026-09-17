import { beforeEach, describe, expect, test } from '@jest/globals';
import { peekOtpForTests, sendOtp, verifyOtpCode } from '../src/services/otp';
import { useAuthStore } from '../src/store/authStore';
import { useRideStore } from '../src/store/rideStore';
import { useUserStore } from '../src/store/userStore';
import { DEFAULT_COUNTRY, formatE164Display, isValidPhone, toE164 } from '../src/utils/phone';

describe('QuickRide Customer App State Management (Zustand)', () => {
  beforeEach(() => {
    useRideStore.getState().resetRide();
    useAuthStore.getState().resetDemoAuth();
  });

  test('AuthStore initial demo state and login flow', async () => {
    const auth = useAuthStore.getState();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.hasCompletedOnboarding).toBe(false);

    auth.completeOnboarding();
    expect(useAuthStore.getState().hasCompletedOnboarding).toBe(true);

    const phone = '+919876543210';
    const sent = await auth.requestOtp(phone);
    expect(sent.ok).toBe(true);
    expect(sent.previewCode).toBe('123456');

    const wrongCode = sent.previewCode === '000000' ? '111111' : '000000';
    const rejected = await auth.verifyOtp(wrongCode);
    expect(rejected.ok).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);

    const verified = await auth.verifyOtp(sent.previewCode ?? '');
    expect(verified.ok).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    auth.grantLocation();
    expect(useAuthStore.getState().hasGrantedLocation).toBe(true);
  });

  test('RideStore full booking lifecycle with simulation', () => {
    const ride = useRideStore.getState();
    expect(ride.currentStatus).toBe('IDLE');
    expect(ride.pickup).toBeDefined();

    ride.startSearchingForDriver();
    expect(useRideStore.getState().currentStatus).toBe('SEARCHING_DRIVER');
    expect(useRideStore.getState().activeRide).toBeDefined();

    ride.simulateDriverArrived();
    expect(useRideStore.getState().currentStatus).toBe('DRIVER_ARRIVED');

    ride.startTrip();
    expect(useRideStore.getState().currentStatus).toBe('RIDE_IN_PROGRESS');

    ride.completeTrip(5, 50, ['Clean Car', 'Polite Driver']);
    expect(useRideStore.getState().currentStatus).toBe('RIDE_COMPLETED');
    expect(useRideStore.getState().activeRide?.rating).toBe(5);
    expect(useRideStore.getState().activeRide?.driverTip).toBe(50);

    const history = useUserStore.getState().rideHistory;
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe('RIDE_COMPLETED');
  });

  test('UserStore wallet operations', () => {
    const initialBalance = useUserStore.getState().user.walletBalance;
    useUserStore.getState().addFundsToWallet(500);
    expect(useUserStore.getState().user.walletBalance).toBe(initialBalance + 500);
  });
});

describe('Phone number helpers', () => {
  test('validates Indian mobile numbers and formats E.164', () => {
    expect(isValidPhone('9876543210', DEFAULT_COUNTRY)).toBe(true);
    expect(isValidPhone('1876543210', DEFAULT_COUNTRY)).toBe(false);
    expect(isValidPhone('98765', DEFAULT_COUNTRY)).toBe(false);
    expect(toE164('9876543210', DEFAULT_COUNTRY)).toBe('+919876543210');
    expect(formatE164Display('+919876543210')).toBe('+91 98765 43210');
  });
});

describe('OTP service', () => {
  test('rejects unknown, incorrect, and accepts matching codes', async () => {
    const phone = '+919876543210';
    expect(verifyOtpCode(phone, '123456').ok).toBe(false);

    const sent = await sendOtp(phone);
    expect(sent.ok).toBe(true);
    const code = peekOtpForTests(phone);
    expect(code).toBe('123456');

    const wrong = code === '000000' ? '111111' : '000000';
    expect(verifyOtpCode(phone, wrong).ok).toBe(false);
    expect(verifyOtpCode(phone, code ?? '').ok).toBe(true);
    expect(peekOtpForTests(phone)).toBeNull();
  });
});

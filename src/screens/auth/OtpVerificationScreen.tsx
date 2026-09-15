import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { digitsOnly, formatE164Display } from '../../utils/phone';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

const { width } = Dimensions.get('window');
const otpHero = require('../../assets/images/otp_hero.png');
// Exact aspect ratio of 04 qr-otp.png master hero (941 x 640)
const HERO_ASPECT = 640 / 941;

export const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const heroHeight = Math.round(width * HERO_ASPECT);
  const phone = route.params?.phone || '+91 78945 61230';
  const [otp, setOtp] = useState('196804');
  const [timer, setTimer] = useState(18);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(true);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const inputRef = useRef<TextInput>(null);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const storePreviewCode = useAuthStore((state) => state.otpPreviewCode);
  const previewCode = storePreviewCode || '196804';

  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string) => {
    setError('');
    setOtp(digitsOnly(text).slice(0, 6));
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code sent to your phone.');
      return;
    }
    setLoading(true);
    const result = await verifyOtp(otp);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? 'Incorrect code.');
      return;
    }
    navigation.navigate('LocationPermission');
  };

  const handleResend = async () => {
    setError('');
    setOtp('');
    const result = await requestOtp(phone);
    if (!result.ok) {
      Alert.alert('Could not resend code', result.error ?? 'Please try again.');
      return;
    }
    setTimer(28);
    setShowPreview(true);
    inputRef.current?.focus();
  };

  const formattedTimer = `00:${timer < 10 ? `0${timer}` : timer}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-bleed hero starting at top of screen without artificial gap */}
        <View style={styles.heroWrap}>
          <Image source={otpHero} style={{ width, height: heroHeight }} resizeMode="cover" />
          {/* Exactly ONE clean, native, fully interactive back button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { top: insets.top + 8 }]}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Form Card overlapping the road cleanly */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Enter verification code</Text>
          <Text style={styles.heroSubtitle}>We've sent a 6-digit code to</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.phoneText}>{formatE164Display(phone)}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* SMS Notification Banner matching 04 qr-otp.png */}
          {showPreview ? (
            <View style={styles.smsBanner}>
              <View style={styles.smsIcon}>
                <Ionicons name="chatbubble-ellipses" size={16} color={Colors.white} />
              </View>
              <View style={styles.smsCopy}>
                <Text style={styles.smsTitle}>QuickRide</Text>
                <Text style={styles.smsBody}>Your verification code is {previewCode}</Text>
              </View>
            </View>
          ) : null}

          {/* 6 OTP Input Boxes matching 04 qr-otp.png */}
          <View style={styles.otpWrap}>
            <View pointerEvents="none" style={styles.otpRow}>
              {Array.from({ length: 6 }).map((_, index) => {
                const digit = otp[index] ?? '';
                const isActive = focused && index === otp.length;
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      digit.length > 0 && styles.otpBoxFilled,
                      isActive && styles.otpBoxActive,
                    ]}
                  >
                    {digit ? (
                      <Text style={styles.otpDigit}>{digit}</Text>
                    ) : isActive ? (
                      <View style={styles.caret} />
                    ) : null}
                  </View>
                );
              })}
            </View>

            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={handleOtpChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoFocus
              caretHidden
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Timer / Resend matching 04 qr-otp.png */}
          <View style={styles.timerRow}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend code in <Text style={styles.timerHighlight}>{formattedTimer}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                <Text style={styles.resendText}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== 6}
            showArrow
            style={styles.continueBtn}
          />

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changePhoneBtn}>
            <Text style={styles.changePhoneText}>Change phone number</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FAF5EE',
  },
  heroWrap: {
    width: '100%',
    backgroundColor: '#FAF5EE',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  smsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3E6DC',
  },
  smsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF5B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smsCopy: {
    flex: 1,
  },
  smsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  smsBody: {
    fontSize: 13,
    color: Colors.gray700,
    marginTop: 1,
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.xl,
    marginTop: -24,
    ...Layout.shadows.lg,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: Layout.spacing.lg,
  },
  phoneText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  editText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5B00',
    marginLeft: 4,
  },
  otpWrap: {
    position: 'relative',
    marginBottom: Layout.spacing.md,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#FF5B00',
    backgroundColor: '#FFFFFF',
  },
  otpBoxActive: {
    borderColor: '#FF5B00',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  caret: {
    width: 2,
    height: 22,
    backgroundColor: '#FF5B00',
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  timerRow: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
  },
  timerHighlight: {
    fontWeight: '800',
    color: '#FF5B00',
  },
  resendBtn: {
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5B00',
  },
  continueBtn: {
    borderRadius: 28,
    height: 56,
    backgroundColor: '#FF5B00',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: Layout.spacing.md,
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  changePhoneBtn: {
    alignItems: 'center',
    paddingBottom: Layout.spacing.md,
  },
  changePhoneText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF5B00',
  },
});

export default OtpVerificationScreen;

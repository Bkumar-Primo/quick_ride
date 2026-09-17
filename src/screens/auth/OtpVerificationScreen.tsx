import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { digitsOnly } from '../../utils/phone';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

const loginHero = require('../../assets/images/loginimage1.png');

export const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const phone = route.params?.phone || '+91 78945 61230';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(18);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const requestOtp = useAuthStore((state) => state.requestOtp);

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
    navigation.navigate('ProfileSetup');
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
    inputRef.current?.focus();
  };

  const formattedTimer = `00:${timer < 10 ? `0${timer}` : timer}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.heroContent, { paddingTop: insets.top + 8 }]}>
        <Image source={loginHero} style={styles.backdropImage} resizeMode="cover" />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,246,236,0.88)', 'rgba(255,246,236,0.35)', 'rgba(255,246,236,0)']}
          start={{ x: 0, y: 0.22 }}
          end={{ x: 0.55, y: 0.55 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.7)']}
          style={styles.heroBottomFade}
        />

        <View style={styles.heroTopRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#0B1220" />
          </TouchableOpacity>
          <QuickRideLogo size="md" />
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeTitle}>Enter verification{'\n'}code</Text>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
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
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heroContent: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Colors.heroCream,
  },
  backdropImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '90%',
  },
  heroBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
  },
  heroTopRow: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBlock: {
    zIndex: 2,
    marginTop: 10,
    paddingHorizontal: Layout.spacing.xl,
    maxWidth: '86%',
  },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0B1220',
    letterSpacing: -1.1,
    lineHeight: 40,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: 28,
    minHeight: '48%',
    marginTop: -36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 16,
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
    marginTop: 4,
    borderRadius: 999,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: Layout.spacing.md,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray500,
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

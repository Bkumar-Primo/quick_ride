import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import type React from 'react';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { CountryPickerModal } from '../../components/auth/CountryPickerModal';
import { useAppDialog } from '../../components/common/AppDialog';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import {
  type Country,
  DEFAULT_COUNTRY,
  digitsOnly,
  formatNationalNumber,
  isValidPhone,
  toE164,
} from '../../utils/phone';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const loginHero = require('../../assets/images/loginimage1.png');

const GoogleG = () => (
  <Svg width={18} height={18} viewBox="0 0 48 48">
    <Path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <Path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <Path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <Path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </Svg>
);

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const { showDialog } = useAppDialog();

  const handlePhoneChange = (text: string) => {
    setError('');
    setPhoneDigits(digitsOnly(text).slice(0, country.length));
  };

  const handleContinue = async () => {
    if (!isValidPhone(phoneDigits, country)) {
      setError(`Enter a valid ${country.length}-digit ${country.name} mobile number.`);
      return;
    }

    const e164 = toE164(phoneDigits, country);
    setLoading(true);
    const result = await requestOtp(e164);
    setLoading(false);

    if (!result.ok) {
      showDialog({
        title: 'Could not send code',
        message: result.error ?? 'Please try again.',
        tone: 'warning',
      });
      return;
    }

    useUserStore.getState().updateProfile({ phone: e164 });
    navigation.navigate('OtpVerification', { phone: e164 });
  };

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
          <QuickRideLogo size="md" />
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeTitle}>Welcome{'\n'}back!</Text>
          <Text style={styles.welcomeSubtitle}>Log in to continue{'\n'}your journey.</Text>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.inputLabel}>Phone number</Text>
          <Input
            isPhoneInput
            countryCode={country.dialCode}
            countryFlag={country.flag}
            onPressCountryCode={() => setPickerOpen(true)}
            value={formatNationalNumber(phoneDigits, country)}
            onChangeText={handlePhoneChange}
            placeholder="Enter your number"
            keyboardType="phone-pad"
            maxLength={country.iso === 'IN' ? 11 : country.length + 4}
            error={error}
            autoComplete="tel"
            textContentType="telephoneNumber"
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={phoneDigits.length === 0}
            showArrow
            style={styles.continueBtn}
          />

          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text>{' '}
            and <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                showDialog({
                  title: 'Continue with phone',
                  message: 'Phone verification is required to book rides.',
                })
              }
              style={styles.socialButton}
            >
              <GoogleG />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                showDialog({
                  title: 'Continue with phone',
                  message: 'Phone verification is required to book rides.',
                })
              }
              style={styles.socialButton}
            >
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <CountryPickerModal
        visible={pickerOpen}
        selectedIso={country.iso}
        onClose={() => setPickerOpen(false)}
        onSelect={(next) => {
          setCountry(next);
          setPhoneDigits((current) => current.slice(0, next.length));
          setError('');
        }}
      />
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
    alignItems: 'flex-start',
    paddingHorizontal: Layout.spacing.lg,
  },
  welcomeBlock: {
    zIndex: 2,
    marginTop: 10,
    paddingHorizontal: Layout.spacing.xl,
    maxWidth: '78%',
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0B1220',
    letterSpacing: -1.1,
    lineHeight: 46,
  },
  welcomeSubtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: '#1E293B',
    fontWeight: '600',
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
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray600,
    marginBottom: 8,
  },
  continueBtn: {
    marginTop: 4,
    borderRadius: 999,
  },
  termsText: {
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
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
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Layout.spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: Colors.white,
    gap: 6,
    paddingHorizontal: 8,
  },
  socialText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default LoginScreen;

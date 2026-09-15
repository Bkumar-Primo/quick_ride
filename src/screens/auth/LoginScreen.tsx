import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
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
import { CountryPickerModal } from '../../components/auth/CountryPickerModal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
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

const { width } = Dimensions.get('window');
const loginHero = require('../../assets/images/login_hero.png');
const LOGIN_HERO_ASPECT = 640 / 941;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const heroHeight = Math.round(width * LOGIN_HERO_ASPECT);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneDigits, setPhoneDigits] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestOtp = useAuthStore((state) => state.requestOtp);

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
      Alert.alert('Could not send code', result.error ?? 'Please try again.');
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
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image source={loginHero} style={{ width, height: heroHeight }} resizeMode="cover" />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Phone number or Email</Text>
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
                Alert.alert('Continue with phone', 'Phone verification is required to book rides.')
              }
              style={styles.socialButton}
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert('Continue with phone', 'Phone verification is required to book rides.')
              }
              style={styles.socialButton}
            >
              <Ionicons name="logo-apple" size={20} color="#000000" />
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    backgroundColor: Colors.heroCream,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroWrap: {
    width: '100%',
    backgroundColor: Colors.heroCream,
  },
  heroImage: {
    width: '100%',
    height: 340,
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.lg,
    marginTop: -28,
    ...Layout.shadows.lg,
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

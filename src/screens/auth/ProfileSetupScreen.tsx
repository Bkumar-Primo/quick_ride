import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { useUserStore } from '../../store/userStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileSetup'>;

const heroArt = require('../../assets/images/namescreen_image.png');

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const goToLocation = () => {
    navigation.navigate('LocationPermission');
  };

  const handleContinue = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    let hasError = false;

    if (!trimmedName) {
      setNameError('Enter your full name.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;

    updateProfile({ name: trimmedName, email: trimmedEmail });
    goToLocation();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      automaticOffset
    >
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        {/* <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#1E1B4B" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={goToLocation} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity> */}
        <View style={styles.topBarSpacer} />
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        bottomOffset={50}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          We’ll use this to create your account{'\n'}and keep you updated about your rides.
        </Text>

        <Image source={heroArt} style={styles.heroImage} resizeMode="contain" />

        <Text style={styles.label}>Full name</Text>
        <View style={[styles.inputRow, nameError ? styles.inputRowError : null]}>
          <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={(value) => {
              setNameError('');
              setName(value);
            }}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>Email address</Text>
        <View style={[styles.inputRow, emailError ? styles.inputRowError : null]}>
          <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={(value) => {
              setEmailError('');
              setEmail(value);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.helper}>We’ll send ride updates and important information here.</Text>

        <Button
          title="Continue"
          onPress={handleContinue}
          showArrow
          disabled={!name.trim() || !email.trim()}
          style={styles.continueBtn}
        />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: 8,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  topBarSpacer: {
    height: 48,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.xl,
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  heroImage: {
    width: '100%',
    height: 168,
    marginTop: 18,
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
  },
  inputRowError: {
    borderColor: Colors.danger,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    height: '100%',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 6,
  },
  helper: {
    marginTop: 10,
    marginBottom: 22,
    fontSize: 13,
    lineHeight: 18,
    color: '#94A3B8',
  },
  continueBtn: {
    borderRadius: 999,
    backgroundColor: '#FF5B00',
  },
});

export default ProfileSetupScreen;

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { images } from '../../../assets';

type Props = NativeStackScreenProps<AuthStackParamList, 'AllSet'>;

const heroArt = images.allSet;

const BENEFITS = [
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'A safer, more personal experience',
    body: 'We use your details to keep your account secure.',
  },
  {
    icon: 'mail-outline' as const,
    title: 'Ride updates',
    body: 'Get trip receipts, important updates and offers.',
  },
  {
    icon: 'person-outline' as const,
    title: 'A smoother booking experience',
    body: 'Your details help us serve you better.',
  },
];

export const AllSetScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const grantLocation = useAuthStore((state) => state.grantLocation);

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        {/* <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#1E1B4B" />
        </TouchableOpacity> */}
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <Image source={heroArt} style={styles.heroImage} resizeMode="contain" />

        <Text style={styles.title}>You’re all set!</Text>
        <Text style={styles.subtitle}>
          Thanks for sharing your details.{'\n'}Let’s get you on the road.
        </Text>

        <View style={styles.benefitCard}>
          {BENEFITS.map((item) => (
            <View key={item.title} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={item.icon} size={20} color="#FF5B00" />
              </View>
              <View style={styles.benefitCopy}>
                <Text style={styles.benefitTitle}>{item.title}</Text>
                <Text style={styles.benefitBody}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button title="Start Riding" onPress={grantLocation} showArrow style={styles.startBtn} />
      </ScrollView>
    </View>
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
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: 4,
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
  topBarSpacer: {
    height: 48,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 200,
    marginTop: 4,
  },
  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1B4B',
    textAlign: 'center',
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  benefitCard: {
    marginTop: 24,
    marginBottom: 28,
    backgroundColor: '#F7F8FC',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 18,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitCopy: {
    flex: 1,
    paddingTop: 2,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: 4,
  },
  benefitBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
  },
  startBtn: {
    borderRadius: 999,
    backgroundColor: '#FF5B00',
  },
});

export default AllSetScreen;

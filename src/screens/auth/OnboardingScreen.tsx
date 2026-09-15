import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuickRideLogo } from '../../components/common/QuickRideLogo';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    titleLine1: 'Your ride,',
    titleHighlight: 'just a tap away.',
    description: 'Reliable rides, anytime, anywhere.\nGet where you need to go, effortlessly.',
    image: require('../../assets/images/card_1.png'),
  },
  {
    id: '2',
    titleLine1: 'Real-time',
    titleHighlight: 'tracking.',
    description: 'Know exactly where your driver is,\nfrom pickup to drop-off.',
    image: require('../../assets/images/card_2.png'),
  },
  {
    id: '3',
    titleLine1: 'Safe & affordable',
    titleHighlight: 'rides.',
    description: 'Transparent fares, verified drivers,\nand 24/7 in-ride safety shield.',
    image: require('../../assets/images/card_3.png'),
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {/* Top Bar with Safe Insets, Exact Logo and Skip button */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <QuickRideLogo size="sm" />
        <TouchableOpacity activeOpacity={0.7} onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Title & Description exactly matching Screenshots 3, 4, 5 */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>
                {item.titleLine1}
                {'\n'}
                <Text style={styles.highlightText}>{item.titleHighlight}</Text>
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            {/* Exact Card Artwork */}
            <View style={styles.imageCardContainer}>
              <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
            </View>
          </View>
        )}
      />

      {/* Bottom Controls: Dots & Pill Continue Button */}
      <View style={styles.bottomControls}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
            />
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.88} onPress={handleNext} style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} style={styles.btnArrow} />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  slide: {
    width,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.sm,
  },
  titleSection: {
    alignItems: 'flex-start',
    marginTop: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.xs,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'left',
    letterSpacing: -0.6,
    lineHeight: 40,
  },
  highlightText: {
    color: '#FF5500',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'left',
    marginTop: 10,
    lineHeight: 22,
  },
  imageCardContainer: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Layout.spacing.sm,
  },
  cardImage: {
    width: width * 0.88,
    height: '100%',
  },
  bottomControls: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FF5B00',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E2E8F0',
  },
  actionBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF5B00',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadows.md,
  },
  actionBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.2,
  },
  btnArrow: {
    marginLeft: 8,
  },
});

export default OnboardingScreen;

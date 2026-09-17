import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
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
    image: require('../../assets/images/onboarding2.png'),
    imageWide: false,
  },
  {
    id: '2',
    titleLine1: 'Real-time',
    titleHighlight: 'tracking.',
    description: 'Know exactly where your driver is,\nfrom pickup to drop-off.',
    image: require('../../assets/images/onboarding3.png'),
    imageWide: true,
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
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
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <QuickRideLogo size="md" />
        <TouchableOpacity activeOpacity={0.7} onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        style={styles.carousel}
        onLayout={(e) => setCarouselHeight(e.nativeEvent.layout.height)}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, carouselHeight > 0 ? { height: carouselHeight } : null]}>
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>
                {item.titleLine1}
                {'\n'}
                <Text style={styles.highlightText}>{item.titleHighlight}</Text>
              </Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <View style={styles.imageCardContainer}>
              <Image
                source={item.image}
                style={item.imageWide ? styles.cardImageWide : styles.cardImage}
                resizeMode="contain"
              />
              <LinearGradient
                colors={['rgba(255,255,255,0)', Colors.white]}
                locations={[0.15, 1]}
                style={styles.bottomFade}
                pointerEvents="none"
              />
            </View>
          </View>
        )}
      />

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
    paddingBottom: 4,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
  },
  titleSection: {
    alignItems: 'flex-start',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: 4,
    paddingBottom: 0,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'left',
    letterSpacing: -0.7,
    lineHeight: 42,
  },
  highlightText: {
    color: '#FF5500',
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'left',
    marginTop: 8,
    lineHeight: 24,
  },
  imageCardContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImage: {
    width: '118%',
    height: '112%',
  },
  cardImageWide: {
    width: '100%',
    height: '128%',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
  },
  bottomControls: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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

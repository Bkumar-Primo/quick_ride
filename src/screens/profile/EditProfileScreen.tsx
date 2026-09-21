import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDialog } from '../../components/common/AppDialog';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import type { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../store/userStore';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const { showDialog } = useAppDialog();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      updateProfile({ name, phone, email });
      setLoading(false);
      showDialog({
        title: 'Profile updated',
        message: 'Your profile details have been saved.',
        tone: 'success',
        actions: [{ label: 'Done', onPress: () => navigation.goBack() }],
      });
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Notch Protection */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Photo with Change Badge */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Avatar name={user.name} size={90} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            placeholder="Your name"
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            placeholder="Your phone"
            keyboardType="phone-pad"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            placeholder="Your email"
            keyboardType="email-address"
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Layout.spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: Layout.spacing.sm,
  },
  form: {
    marginBottom: Layout.spacing.xl,
  },
  saveBtn: {
    width: '100%',
  },
});

export default EditProfileScreen;

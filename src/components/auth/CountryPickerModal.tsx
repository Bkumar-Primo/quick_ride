import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { COUNTRIES, type Country } from '../../utils/phone';

type Props = {
  visible: boolean;
  selectedIso: string;
  onClose: () => void;
  onSelect: (country: Country) => void;
};

export const CountryPickerModal: React.FC<Props> = ({
  visible,
  selectedIso,
  onClose,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="slide" visible={visible} transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Select country</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {COUNTRIES.map((country) => {
              const selected = country.iso === selectedIso;
              return (
                <TouchableOpacity
                  key={country.iso}
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => {
                    onSelect(country);
                    onClose();
                  }}
                >
                  <Text style={styles.flag}>{country.flag}</Text>
                  <View style={styles.meta}>
                    <Text style={styles.name}>{country.name}</Text>
                    <Text style={styles.dial}>{country.dialCode}</Text>
                  </View>
                  {selected ? (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray200,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 12,
  },
  rowSelected: {
    backgroundColor: Colors.primarySubtle,
  },
  flag: {
    fontSize: 22,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dial: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});

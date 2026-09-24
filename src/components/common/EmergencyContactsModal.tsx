import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';
import { Button } from './Button';

interface ContactItem {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isOfficial?: boolean;
}

const DEFAULT_CONTACTS: ContactItem[] = [
  {
    id: 'c-1',
    name: 'Mom (Primary)',
    relation: 'Family Contact',
    phone: '+91 98200 12345',
  },
  {
    id: 'c-police',
    name: 'Police Emergency Helpline',
    relation: 'National Emergency',
    phone: '112',
    isOfficial: true,
  },
  {
    id: 'c-quickride',
    name: 'QuickRide 24x7 Safety Desk',
    relation: 'Safety Team',
    phone: '+91 1800 784 257',
    isOfficial: true,
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [contacts, setContacts] = useState<ContactItem[]>(DEFAULT_CONTACTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleCall = async (phone: string) => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    const url = `tel:${cleaned}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Calling Emergency Contact', `Dialing ${phone} on your phone...`);
      }
    } catch {
      Alert.alert('Calling Emergency Contact', `Dialing ${phone} on your phone...`);
    }
  };

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Missing Info', 'Please provide contact name and phone number.');
      return;
    }
    const newContact: ContactItem = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      relation: 'Custom Contact',
      phone: newPhone.trim(),
    };
    setContacts([newContact, ...contacts]);
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="call" size={24} color="#10B981" />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Emergency Contacts</Text>
          <Text style={styles.subtitle}>
            Quick 1-tap call to your emergency contacts & rapid safety response team.
          </Text>

          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
            {contacts.map((contact) => (
              <View key={contact.id} style={styles.contactRow}>
                <View style={styles.avatarBg}>
                  <Ionicons
                    name={contact.isOfficial ? 'shield-checkmark' : 'person'}
                    size={20}
                    color={contact.isOfficial ? '#10B981' : Colors.primary}
                  />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>
                    {contact.phone} • {contact.relation}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.callBtn}
                  activeOpacity={0.85}
                  onPress={() => handleCall(contact.phone)}
                >
                  <Ionicons name="call" size={16} color={Colors.white} />
                  <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>
              </View>
            ))}

            {showAddForm ? (
              <View style={styles.addForm}>
                <Text style={styles.addFormTitle}>Add Emergency Contact</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name (e.g. Dad, Sister)"
                  value={newName}
                  onChangeText={setNewName}
                  placeholderTextColor={Colors.gray400}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number (+91...)"
                  keyboardType="phone-pad"
                  value={newPhone}
                  onChangeText={setNewPhone}
                  placeholderTextColor={Colors.gray400}
                />
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelFormBtn}
                    onPress={() => setShowAddForm(false)}
                  >
                    <Text style={styles.cancelFormText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveFormBtn} onPress={handleAddContact}>
                    <Text style={styles.saveFormText}>Save Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addContactRow}
                activeOpacity={0.8}
                onPress={() => setShowAddForm(true)}
              >
                <View style={styles.addPlusBg}>
                  <Ionicons name="add" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.addContactText}>Add New Emergency Contact</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <Button
            title="Close"
            variant="secondary"
            onPress={onClose}
            style={{ marginTop: Layout.spacing.lg }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Layout.spacing.xl,
    ...Layout.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Layout.spacing.lg,
    lineHeight: 18,
  },
  listScroll: {
    maxHeight: 340,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.gray50,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginBottom: 10,
  },
  avatarBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
    ...Layout.shadows.sm,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contactPhone: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    ...Layout.shadows.sm,
  },
  callBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  addContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: '#FFF3ED',
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: '#FFD8C2',
    marginTop: 4,
  },
  addPlusBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addContactText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  addForm: {
    backgroundColor: Colors.gray50,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginTop: 8,
  },
  addFormTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelFormBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cancelFormText: {
    color: Colors.gray600,
    fontWeight: '600',
    fontSize: 13,
  },
  saveFormBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  saveFormText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default EmergencyContactsModal;

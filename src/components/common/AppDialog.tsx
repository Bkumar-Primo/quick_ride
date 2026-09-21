import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Layout } from '../../constants/layout';

type DialogAction = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

type DialogOptions = {
  title: string;
  message: string;
  actions?: DialogAction[];
  tone?: 'success' | 'warning' | 'danger' | 'info';
};

type AppDialogContextValue = {
  showDialog: (options: DialogOptions) => void;
  dismissDialog: () => void;
};

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

const toneConfig = {
  success: { icon: 'checkmark' as const, background: '#DCFCE7', color: '#16A34A' },
  warning: { icon: 'alert' as const, background: '#FEF3C7', color: '#D97706' },
  danger: { icon: 'warning' as const, background: '#FEE2E2', color: Colors.danger },
  info: { icon: 'information' as const, background: Colors.primarySubtle, color: Colors.primary },
};

export const AppDialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);
  const dismissDialog = () => setDialog(null);
  const showDialog = (options: DialogOptions) => setDialog(options);
  const value = { showDialog, dismissDialog };
  const actions = dialog?.actions?.length ? dialog.actions : [{ label: 'Got it' }];
  const tone = toneConfig[dialog?.tone ?? 'info'];

  const handleAction = (action: DialogAction) => {
    dismissDialog();
    action.onPress?.();
  };

  return (
    <AppDialogContext.Provider value={value}>
      {children}
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(dialog)}
        onRequestClose={dismissDialog}
        statusBarTranslucent
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissDialog} />
          <View style={styles.card} accessibilityViewIsModal>
            <View style={[styles.iconWrap, { backgroundColor: tone.background }]}>
              <Ionicons name={tone.icon} size={26} color={tone.color} />
            </View>
            <Text style={styles.title} selectable>
              {dialog?.title}
            </Text>
            <Text style={styles.message} selectable>
              {dialog?.message}
            </Text>
            <View style={[styles.actions, actions.length === 1 && styles.singleAction]}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  activeOpacity={0.85}
                  onPress={() => handleAction(action)}
                  style={[
                    styles.action,
                    actions.length > 1 && styles.splitAction,
                    action.variant === 'secondary' && styles.secondaryAction,
                    action.variant === 'danger' && styles.dangerAction,
                  ]}
                >
                  <Text
                    style={[
                      styles.actionText,
                      action.variant === 'secondary' && styles.secondaryActionText,
                      action.variant === 'danger' && styles.dangerActionText,
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AppDialogContext.Provider>
  );
};

export const useAppDialog = () => {
  const context = useContext(AppDialogContext);
  if (!context) throw new Error('useAppDialog must be used within AppDialogProvider.');
  return context;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.52)',
    padding: Layout.spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xl,
    boxShadow: '0 12px 32px rgba(17, 24, 39, 0.22)',
  },
  iconWrap: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
    marginBottom: Layout.spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: Layout.spacing.sm,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.xl,
  },
  singleAction: { justifyContent: 'center' },
  action: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Layout.spacing.lg,
  },
  splitAction: { flex: 1 },
  secondaryAction: { backgroundColor: Colors.gray100 },
  dangerAction: { backgroundColor: '#FEE2E2' },
  actionText: { color: Colors.white, fontSize: 14, fontWeight: '800' },
  secondaryActionText: { color: Colors.gray700 },
  dangerActionText: { color: Colors.danger },
});

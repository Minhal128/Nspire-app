import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

export interface PickerOption {
  label: string;
  value: string;
}

interface IOSPickerModalProps {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function IOSPickerModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: IOSPickerModalProps) {
  // Works on both iOS and Android now

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  const renderItem = ({ item }: { item: PickerOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedValue === item.value && styles.optionItemSelected,
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text
        style={[
          styles.optionText,
          selectedValue === item.value && styles.optionTextSelected,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Options List */}
            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={renderItem}
              style={styles.list}
              showsVerticalScrollIndicator={true}
              initialNumToRender={20}
            />

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3E',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  list: {
    maxHeight: 400,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3C3C3E',
  },
  optionItemSelected: {
    backgroundColor: '#3C3C3E',
  },
  optionText: {
    fontSize: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 16,
    marginTop: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
});

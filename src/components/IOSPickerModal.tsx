import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
  // Temporary value while picker is open
  const [tempValue, setTempValue] = useState(selectedValue || '');

  // Reset temp value when modal opens
  useEffect(() => {
    if (visible) {
      setTempValue(selectedValue || '');
    }
  }, [visible, selectedValue]);

  const handleDone = () => {
    onSelect(tempValue);
    onClose();
  };

  const handleCancel = () => {
    setTempValue(selectedValue || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header with title and Done button */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Native Picker */}
          <Picker
            selectedValue={tempValue}
            onValueChange={(itemValue) => setTempValue(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {options.map((option, index) => (
              <Picker.Item
                key={`${option.value}-${index}`}
                label={option.label}
                value={option.value}
                color={Platform.OS === 'ios' ? '#007AFF' : '#1F2937'}
              />
            ))}
          </Picker>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  picker: {
    backgroundColor: '#2C2C2E',
  },
  pickerItem: {
    color: '#007AFF',
    fontSize: 20,
  },
  cancelButton: {
    marginHorizontal: 16,
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

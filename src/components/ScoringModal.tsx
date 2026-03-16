import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import ModalZoomWrapper from './ModalZoomWrapper';
import {
    calculateUnitScore,
    ScoringResult,
    SEVERITY_LEVELS,
    POSSIBLE_SCORE,
    DEFICIENCY_OPTIONS,
    getSeverityColor,
    getScoreStatus,
} from '../utils/scoringCalculations';
import { isUnitLocation } from '../data/deficiencyMapping';
import { UNIT_TOTAL_POSSIBLE_POINTS } from '../data/insideDeficiencyMapping';

interface ScoringModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (scoringResult: ScoringResult) => void;
    itemName: string;
    location: string;
    totalSamples: number;
    initialDeficiencies?: number;
    initialSeverity?: string;
}

const ScoringModal: React.FC<ScoringModalProps> = ({
    visible,
    onClose,
    onSave,
    itemName,
    location,
    totalSamples,
    initialDeficiencies = 0,
    initialSeverity = 'Moderate',
}) => {
    const [deficiencies, setDeficiencies] = useState(initialDeficiencies);
    const [severity, setSeverity] = useState(initialSeverity);
    const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
    const [showDeficiencyPicker, setShowDeficiencyPicker] = useState(false);

    // Determine if this is a Unit location (50 possible points) vs Inside/Outside (25 possible points)
    const isUnit = isUnitLocation(location);
    const possibleScore = isUnit ? UNIT_TOTAL_POSSIBLE_POINTS : POSSIBLE_SCORE;

    // Calculate score dynamically whenever inputs change
    useEffect(() => {
        const result = calculateUnitScore({
            totalSamples,
            deficiencies,
            severity,
        });
        setScoringResult(result);
    }, [totalSamples, deficiencies, severity]);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setDeficiencies(initialDeficiencies);
            setSeverity(initialSeverity);
        }
    }, [visible, initialDeficiencies, initialSeverity]);

    const handleSave = () => {
        if (scoringResult) {
            onSave(scoringResult);
        }
        onClose();
    };

    const scoreStatus = scoringResult ? getScoreStatus(scoringResult.score) : null;
    const severityColor = getSeverityColor(severity);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <ModalZoomWrapper>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerTitleContainer}>
                                <Text style={styles.headerTitle} numberOfLines={1}>
                                    {itemName}
                                </Text>
                                <Text style={styles.headerSubtitle}>{location}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Location and Severity Row */}
                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Location</Text>
                                    <View style={styles.readOnlyField}>
                                        <Text style={styles.readOnlyText}>{location}</Text>
                                    </View>
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Severity</Text>
                                    <View style={[styles.readOnlyField, { backgroundColor: severityColor }]}>
                                        <Text style={[styles.readOnlyText, styles.whiteText]}>{severity}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* All Sample and Pts Lost (Raw) Row */}
                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>All Sample</Text>
                                    <View style={styles.readOnlyField}>
                                        <Text style={styles.readOnlyText}>{scoringResult?.allSample || totalSamples}</Text>
                                    </View>
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Pts Lost (Raw)</Text>
                                    <View style={styles.readOnlyField}>
                                        <Text style={styles.readOnlyText}>{scoringResult?.ptsLostRaw?.toFixed(2) || '0.00'}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Pts Lost and Possible Score Row */}
                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Pts Lost</Text>
                                    <View style={styles.readOnlyField}>
                                        <Text style={styles.readOnlyText}>{scoringResult?.ptsLost?.toFixed(2) || '0.00'}</Text>
                                    </View>
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Possible Score</Text>
                                    <View style={styles.readOnlyField}>
                                        <Text style={styles.readOnlyText}>{possibleScore}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Max Pts Lost and Score Row */}
                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Max Pts Lost</Text>
                                    <View style={styles.readOnlyField}>
                                        <Text style={styles.readOnlyText}>{scoringResult?.maxPtsLost?.toFixed(2) || '5.50'}</Text>
                                    </View>
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.fieldLabel}>Score</Text>
                                    <View style={[styles.readOnlyField, scoreStatus && { borderColor: scoreStatus.color, borderWidth: 2 }]}>
                                        <Text style={[styles.readOnlyText, styles.scoreText, scoreStatus && { color: scoreStatus.color }]}>
                                            {scoringResult?.score?.toFixed(2) || possibleScore.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* # of Deficiencies */}
                            <View style={styles.fullField}>
                                <Text style={styles.fieldLabel}># of Deficiencies</Text>
                                {Platform.OS === 'ios' ? (
                                    <TouchableOpacity
                                        style={styles.deficiencyDropdown}
                                        onPress={() => setShowDeficiencyPicker(true)}
                                    >
                                        <Text style={styles.deficiencyText}>{deficiencies}</Text>
                                        <Ionicons name="chevron-down" size={20} color="#666666" />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={deficiencies}
                                            onValueChange={(value) => setDeficiencies(value)}
                                            style={styles.picker}
                                        >
                                            {DEFICIENCY_OPTIONS.map((option) => (
                                                <Picker.Item
                                                    key={option.value}
                                                    label={option.label}
                                                    value={option.value}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Footer Buttons */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ModalZoomWrapper>

            {/* iOS Deficiency Picker Modal */}
            {Platform.OS === 'ios' && (
                <Modal
                    visible={showDeficiencyPicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowDeficiencyPicker(false)}
                >
                    <View style={styles.pickerModalOverlay}>
                        <View style={styles.pickerModalContent}>
                            <View style={styles.pickerModalHeader}>
                                <TouchableOpacity onPress={() => setShowDeficiencyPicker(false)}>
                                    <Text style={styles.pickerModalCancel}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={styles.pickerModalTitle}># of Deficiencies</Text>
                                <TouchableOpacity onPress={() => setShowDeficiencyPicker(false)}>
                                    <Text style={styles.pickerModalDone}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                selectedValue={deficiencies}
                                onValueChange={(value) => setDeficiencies(value)}
                                style={styles.iosPicker}
                            >
                                {DEFICIENCY_OPTIONS.map((option) => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Modal>
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitleContainer: {
        flex: 1,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    halfField: {
        flex: 1,
    },
    fullField: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    readOnlyField: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        minHeight: 44,
        justifyContent: 'center',
    },
    readOnlyText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    whiteText: {
        color: '#FFFFFF',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: '700',
    },
    deficiencyDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        minHeight: 44,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    deficiencyText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        overflow: 'hidden',
    },
    picker: {
        height: 44,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // iOS Picker Modal Styles
    pickerModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    pickerModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    pickerModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    pickerModalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    pickerModalCancel: {
        fontSize: 16,
        color: '#6B7280',
    },
    pickerModalDone: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
    },
    iosPicker: {
        height: 200,
    },
});

export default ScoringModal;

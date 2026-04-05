import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

interface ReportPreviewModalProps {
    visible: boolean;
    title: string;
    html: string;
    onClose: () => void;
    actionLabel?: string;
    onAction?: (() => void | Promise<void>) | null;
}

export default function ReportPreviewModal({
    visible,
    title,
    html,
    onClose,
    actionLabel,
    onAction,
}: ReportPreviewModalProps) {
    const [actionLoading, setActionLoading] = useState(false);

    const handleAction = async () => {
        if (!onAction || actionLoading) return;

        try {
            setActionLoading(true);
            await Promise.resolve(onAction());
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color="#6B7280" />
                    </TouchableOpacity>

                    <Text style={styles.title} numberOfLines={1}>
                        {title || 'Report Preview'}
                    </Text>

                    {onAction ? (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleAction}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.actionButtonText}>{actionLabel || 'Action'}</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.actionPlaceholder} />
                    )}
                </View>

                <WebView
                    source={{ html }}
                    style={styles.webView}
                    originWhitelist={['*']}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    showsVerticalScrollIndicator={true}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        flex: 1,
        marginHorizontal: 12,
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    actionButton: {
        minWidth: 64,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    actionPlaceholder: {
        width: 64,
        height: 36,
    },
    webView: {
        flex: 1,
    },
});

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ReportPreviewModal from '../components/ReportPreviewModal';

interface OpenReportPreviewPayload {
    title?: string;
    html: string;
    actionLabel?: string;
    onAction?: (() => void | Promise<void>) | null;
}

interface ReportPreviewContextValue {
    openReportPreview: (payload: OpenReportPreviewPayload) => void;
    closeReportPreview: () => void;
}

const ReportPreviewContext = createContext<ReportPreviewContextValue | undefined>(undefined);

export function ReportPreviewProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('Report Preview');
    const [html, setHtml] = useState('');
    const [actionLabel, setActionLabel] = useState<string | undefined>(undefined);
    const [onAction, setOnAction] = useState<(() => void | Promise<void>) | null>(null);

    const closeReportPreview = useCallback(() => {
        setVisible(false);
        setActionLabel(undefined);
        setOnAction(null);
    }, []);

    const openReportPreview = useCallback((payload: OpenReportPreviewPayload) => {
        setTitle(payload.title || 'Report Preview');
        setHtml(payload.html || '');
        setActionLabel(payload.actionLabel);
        setOnAction(() => (typeof payload.onAction === 'function' ? payload.onAction : null));
        setVisible(true);
    }, []);

    const value = useMemo(
        () => ({
            openReportPreview,
            closeReportPreview,
        }),
        [openReportPreview, closeReportPreview]
    );

    return (
        <ReportPreviewContext.Provider value={value}>
            {children}
            <ReportPreviewModal
                visible={visible}
                title={title}
                html={html}
                onClose={closeReportPreview}
                actionLabel={actionLabel}
                onAction={onAction}
            />
        </ReportPreviewContext.Provider>
    );
}

export function useReportPreview() {
    const context = useContext(ReportPreviewContext);
    if (!context) {
        throw new Error('useReportPreview must be used inside ReportPreviewProvider');
    }

    return context;
}

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inspection } from '../services/api';
import { getInspectionStatusColor } from '../utils/otherPortal';

/**
 * One inspection row in the Other portal.
 *
 * Web renders the identical mobile card on /other/dashboard and
 * /other/inspections, so both app screens share this component instead of
 * copying it the way the web pages do.
 */
export default function OtherInspectionCard({ inspection }: { inspection: Inspection }) {
  const propertyName =
    typeof inspection.property === 'object' ? inspection.property?.name || 'N/A' : 'N/A';

  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idBadgeText}>
            {inspection.inspectionId || inspection._id?.slice(-6)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getInspectionStatusColor(inspection.status) },
          ]}
        >
          <Text style={styles.statusText}>{inspection.status || 'Pending'}</Text>
        </View>
      </View>

      <Text style={styles.propertyName}>{propertyName}</Text>
      <Text style={styles.scheduledDate}>
        {inspection.scheduledDate ? new Date(inspection.scheduledDate).toLocaleDateString() : 'N/A'}
      </Text>

      <View style={styles.metaGrid}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Type</Text>
          <Text style={styles.metaValue}>{inspection.inspectionType || 'Standard'}</Text>
        </View>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>Score</Text>
          <Text style={styles.metaValue}>
            {inspection.complianceScore ? `${inspection.complianceScore}%` : '-'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Sits inside a white section card, so it needs its own tint.
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  scheduledDate: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  metaLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
});

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Transaction } from '../../domain/transaction.store';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

interface HistoryListProps {
  transactions: Transaction[];
}

export const HistoryList = ({ transactions }: HistoryListProps) => {
  if (transactions.length === 0) {
      return (
          <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune brique posée...</Text>
          </View>
      );
  }

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
        <View style={styles.left}>
            <View style={styles.dot} />
            <View>
                <Text style={styles.date}>{format(new Date(item.date), "d MMM yyyy 'à' HH:mm", { locale: fr })}</Text>
                <Text style={styles.type}>{item.type === 'deposit' ? 'Dépôt' : 'Retrait'}</Text>
            </View>
        </View>
        
        <View style={styles.right}>
            <Text style={styles.amount}>+{item.amount.toLocaleString()} F</Text>
             {/* Mock Share Button for Story 2.3 */}
            <TouchableOpacity style={styles.shareBtn}>
                <Ionicons name="share-social-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.title}>HISTORIQUE</Text>
        {transactions.map(t => (
            <View key={t.id}>{renderItem({item: t})}</View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      marginTop: Spacing.xl,
      paddingHorizontal: Spacing.md,
      width: '100%',
  },
  title: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginBottom: Spacing.md,
      opacity: 0.7,
  },
  emptyContainer: {
      padding: Spacing.lg,
      alignItems: 'center',
  },
  emptyText: {
      color: Colors.textSecondary,
      fontStyle: 'italic',
  },
  item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  left: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.primary,
      marginRight: Spacing.md,
  },
  date: {
      color: Colors.text,
      fontSize: 14,
      fontWeight: '500',
  },
  type: {
      color: Colors.textSecondary,
      fontSize: 10,
  },
  right: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  amount: {
      color: Colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
      marginRight: Spacing.md,
  },
  shareBtn: {
      padding: 4,
  }
});

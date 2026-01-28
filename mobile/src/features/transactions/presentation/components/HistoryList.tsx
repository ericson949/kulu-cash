import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { Transaction } from '../../domain/transaction.store';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

interface HistoryListProps {
  transactions: Transaction[];
}

export const HistoryList = ({ transactions }: HistoryListProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            {/* Proof Thumbnail */}
            {item.proofUri && (
                <TouchableOpacity onPress={() => setSelectedImage(item.proofUri)}>
                    <Image source={{ uri: item.proofUri }} style={styles.thumbnail} />
                </TouchableOpacity>
            )}

            <Text style={styles.amount}>+{item.amount.toLocaleString()} F</Text>
             
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

        {/* Full Screen Image Modal */}
        <Modal visible={!!selectedImage} transparent={true} animationType="fade">
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
                    <View style={styles.modalBackdrop} />
                </TouchableWithoutFeedback>
                
                <View style={styles.modalContent}>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
                         <Ionicons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
  },
  
  // Gallery Styles
  thumbnail: {
      width: 32,
      height: 32,
      borderRadius: 6,
      marginRight: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.textSecondary,
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
  },
  modalContent: {
      width: '100%',
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  fullImage: {
      width: '90%',
      height: '90%',
      borderRadius: 12,
  },
  closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 10,
  }
});

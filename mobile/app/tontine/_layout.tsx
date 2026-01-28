import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function TontineLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // Determine current step
  let currentStep = 1;
  let stepTitleKey = 'step1Title';

  if (pathname.includes('setup-logic')) {
    currentStep = 2;
    stepTitleKey = 'step2Title';
  } else if (pathname.includes('custom-goal')) {
    currentStep = 1;
    stepTitleKey = 'step1Title';
  }

  const isStep1 = currentStep === 1 && !pathname.includes('custom-goal');
  
  // Determine Header Title
  let headerTitle = t('createTontine.title');
  if (pathname.includes('custom-goal')) {
      headerTitle = t('createTontine.customGoal.headerTitle');
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          {/* Left Button: Back on sub-steps, Close on Root */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.iconBtn}
          >
            {isStep1 ? (
                <MaterialIcons name="close" size={24} color="#FFF" />
            ) : (
                <MaterialIcons name="arrow-back-ios" size={20} color="#FFF" style={{ paddingLeft: 6 }} />
            )}
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{headerTitle}</Text>

          {/* Right Button: Help (Step 1) or Close (Others) */}
          <TouchableOpacity 
            onPress={() => isStep1 ? null : router.dismissAll()} 
            style={styles.iconBtn}
          >
             {isStep1 ? (
                 <MaterialIcons name="help-outline" size={24} color="#FFF" />
             ) : (
                 <MaterialIcons name="close" size={24} color="#FFF" />
             )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* PROGRESS SECTION */}
      <View style={styles.progressSection}>
         <View style={styles.progressHeader}>
            <Text style={styles.stepIndicator}>{t(`createTontine.step${currentStep}`)}</Text>
            <Text style={styles.stepTitle}>{t(`createTontine.${stepTitleKey}`)}</Text>
         </View>
         <View style={styles.progressTrack}>
             <View style={[styles.progressSegment, currentStep >= 1 && styles.progressActive]} />
             <View style={[styles.progressSegment, currentStep >= 2 && styles.progressActive]} />
             <View style={[styles.progressSegment, currentStep >= 3 && styles.progressActive]} />
             <View style={[styles.progressSegment, currentStep >= 4 && styles.progressActive]} />
         </View>
      </View>

      {/* CONTENT SLOT */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216', // Deep Dark Green
  },
  header: {
      backgroundColor: 'rgba(16, 34, 22, 0.95)',
  },
  headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  iconBtn: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
  },
  
  progressSection: {
      paddingHorizontal: 24,
      paddingBottom: 20,
      gap: 8,
  },
  progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  stepIndicator: {
      color: Colors.primary,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 1,
  },
  stepTitle: {
      color: '#9cbaa6',
      fontSize: 12,
      fontWeight: 'bold',
  },
  progressTrack: {
      flexDirection: 'row',
      height: 6,
      gap: 6,
  },
  progressSegment: {
      flex: 1,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  progressActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 5,
  },
});

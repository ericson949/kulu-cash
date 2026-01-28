import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ICONS = ['favorite', 'flight', 'home', 'directions-car', 'celebration', 'school', 'diamond', 'computer', 'fitness-center', 'pets'];
const COLORS = [
    Colors.primary, 
    '#3b82f6', // blue-500
    '#a855f7', // purple-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#eab308', // yellow-500
    '#06b6d4', // cyan-500
];

export default function CustomGoalScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [goalName, setGoalName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('favorite');
  const [selectedColor, setSelectedColor] = useState(Colors.primary);

  return (
    <View style={styles.container}>
        {/* HEADER */}
        <SafeAreaView edges={['top']} style={styles.header}>
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <MaterialIcons name="arrow-back-ios" size={20} color="#FFF" style={{ paddingLeft: 6 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('createTontine.customGoal.headerTitle')}</Text>
                <View style={[styles.iconBtn, { opacity: 0 }]} /> 
            </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* HERRO / MASCOT */}
            <View style={styles.heroSection}>
                <View style={styles.mascotContainer}>
                    {/* Placeholder for Kulu Mascot */}
                    <Image 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEd5ptBXqprX-I-hHLKZSLmPiHuHBB6jMy0sb4XIL8k0it4NwZBBOhAjAUcI8cY5hxPzYizNusSRqsSvEBIkaDc67uS7AbQVPUwzcQ8bEzbYeg_OVu_A3RYH2Io6arJt9Kq0j7i7nRwUivsKMpmBf8uMQ2YZnDhV8Jwkuloy5rqI_gjjbmTipyBX1p47dwNPYyUI5saWgQTkV6fqzR-GTEMr9-QfqDcawF1eWqlvhNPwgxSXhzoOECXFGt9Fe7DeajX2fKgXk0OSJv' }}
                        style={styles.mascotImage}
                        resizeMode="cover"
                    />
                    <View style={styles.editBadge}>
                         <MaterialIcons name="brush" size={16} color={Colors.background} />
                    </View>
                </View>
                <Text style={styles.title}>{t('createTontine.customGoal.title')}</Text>
                <Text style={styles.subtitle}>{t('createTontine.customGoal.subtitle')}</Text>
            </View>

            {/* FORM */}
            <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('createTontine.customGoal.nameLabel')}</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder={t('createTontine.customGoal.namePlaceholder')}
                        placeholderTextColor="#9bbba6"
                        value={goalName}
                        onChangeText={setGoalName}
                    />
                </View>

                {/* ICONS */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('createTontine.customGoal.iconLabel')}</Text>
                    <View style={styles.iconGrid}>
                        {ICONS.map((icon) => {
                            const isSelected = selectedIcon === icon;
                            return (
                                <TouchableOpacity 
                                    key={icon}
                                    onPress={() => setSelectedIcon(icon)}
                                    style={[
                                        styles.iconItem,
                                        // Ensure consistent border width to avoid layout shifts
                                        isSelected 
                                            ? { backgroundColor: Colors.primary, borderColor: Colors.primary, borderWidth: 1 } 
                                            : { backgroundColor: '#1b271f', borderColor: '#3a5543', borderWidth: 1 }
                                    ]}
                                >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons 
                                            name={icon as any} 
                                            size={28} 
                                            color={isSelected ? Colors.background : '#FFF'}
                                            style={{ textAlign: 'center' }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* COLORS */}
                <View style={[styles.inputGroup, { paddingBottom: 100 }]}>
                    <Text style={styles.label}>{t('createTontine.customGoal.colorLabel')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
                        {COLORS.map((color) => {
                            const isSelected = selectedColor === color;
                            return (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => setSelectedColor(color)}
                                    style={[
                                        styles.colorItem,
                                        { backgroundColor: color },
                                        isSelected && styles.colorItemSelected
                                    ]}
                                />
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </ScrollView>

         {/* FOOTER */}
        <LinearGradient
            colors={['transparent', 'rgba(16, 34, 22, 0.95)', '#102216']}
            style={styles.footer}
        >
             <TouchableOpacity style={styles.saveBtn} activeOpacity={0.9}>
                 <Text style={styles.saveBtnText}>{t('createTontine.customGoal.save')}</Text>
             </TouchableOpacity>
        </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  header: {
      backgroundColor: '#102216', // Match container bg
      paddingBottom: 8,
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
      borderRadius: 20,
      // backgroundColor: '#FFF', // Removed white background
      justifyContent: 'center',
      alignItems: 'center', 
  },
  headerTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
  },
  
  scrollContent: {
      paddingBottom: 40,
  },
  heroSection: {
      alignItems: 'center',
      paddingTop: 24,
      paddingHorizontal: 16,
      marginBottom: 32,
  },
  mascotContainer: {
      position: 'relative',
      width: 128,
      height: 128,
      backgroundColor: 'rgba(13, 242, 89, 0.1)',
      borderRadius: 64,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
  },
  mascotImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
  },
  editBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: Colors.primary,
      padding: 8,
      borderRadius: 20,
  },
  title: {
      color: '#FFF',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
  },
  subtitle: {
      color: '#9cbaa6',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 24,
      lineHeight: 24,
  },

  formSection: {
      paddingHorizontal: 16,
      gap: 32,
  },
  inputGroup: {
      gap: 16,
  },
  label: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
  },
  textInput: {
      backgroundColor: '#1b271f',
      borderWidth: 1,
      borderColor: '#3a5543',
      borderRadius: 12,
      height: 56,
      paddingHorizontal: 16,
      color: '#FFF',
      fontSize: 18,
  },
  iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center', // Center icons
  },
  iconItem: {
      width: Math.floor((width - 32 - 48) / 5), // 5 cols with gaps, rounded down to ensure fit
      aspectRatio: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },
  
  colorRow: {
      gap: 16,
      paddingRight: 16,
      paddingLeft: 4, // Add padding to avoid clipping selected border
      paddingVertical: 4, // Add padding to avoid clipping selected border
  },
  colorItem: {
      width: 40,
      height: 40,
      borderRadius: 20,
  },
  colorItemSelected: {
      borderWidth: 4,
      borderColor: 'rgba(255,255,255,0.3)',
      transform: [{ scale: 1.1 }],
  },

  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      paddingBottom: 40,
  },
  saveBtn: {
      backgroundColor: Colors.primary,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 4,
  },
  saveBtnText: {
      color: '#102216',
      fontSize: 18,
      fontWeight: 'bold',
  },
});

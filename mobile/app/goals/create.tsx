import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGoalStore, GoalState } from '@/src/features/goals/domain/goal.store';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { SegmentedControl } from '@/src/shared/components/SegmentedControl';
import { Ionicons } from '@expo/vector-icons';
import { addWeeks, addMonths, addDays, format, isBefore, startOfDay, differenceInCalendarWeeks, differenceInCalendarMonths, differenceInCalendarDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const TEMPLATES = [
  { id: 'motorcycle', source: require('@/assets/goal-templates/motorcycle.png'), label: 'Moto' },
  { id: 'house', source: require('@/assets/goal-templates/house.png'), label: 'Maison' },
  { id: 'wedding', source: require('@/assets/kulu-sticker.png'), label: 'Mariage' }, 
  { id: 'travel', source: require('@/assets/kulu-sticker.png'), label: 'Voyage' },
];

export default function CreateGoalScreen() {
  const router = useRouter();
  const addGoal = useGoalStore((state: GoalState) => state.addGoal);

  // --- WIZARD STATE ---
  const [step, setStep] = useState(1); // 1: Type, 2: Mechanics, 3: Identity

  // --- STEP 1: TYPE ---
  const [tontineType, setTontineType] = useState<'fixed' | 'variable_b'>('fixed');
  
  // --- STEP 2: MECHANICS ---
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'daily'>('weekly');
  const [brickAmount, setBrickAmount] = useState('');
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addWeeks(new Date(), 52)); // Default ~1 year

  // Date Pickers Visibility
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Retroactive Logic
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [initialBalance, setInitialBalance] = useState('');
  const [expectedBalance, setExpectedBalance] = useState(0);

  // Project Association (To trigger Step 3)
  const [linkToProject, setLinkToProject] = useState(false);

  // --- STEP 3: IDENTITY ---
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // --- COMPUTED TOTAL ---
  const [computedTotal, setComputedTotal] = useState(0);

  // -------------------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------------------

  useEffect(() => {
    // 1. Check Retroactivity
    const now = startOfDay(new Date());
    const start = startOfDay(startDate);
    
    // Retroactive check
    if (isBefore(start, now)) {
        setIsRetroactive(true);
        let elapsed = 0;
        if (frequency === 'weekly') elapsed = differenceInCalendarWeeks(now, start);
        if (frequency === 'monthly') elapsed = differenceInCalendarMonths(now, start);
        if (frequency === 'daily') elapsed = differenceInCalendarDays(now, start);

        const amt = parseInt(brickAmount || '0', 10);
        const expected = elapsed * amt;
        setExpectedBalance(expected);
        // User Request: Pre-fill input with expected amount
        setInitialBalance(expected.toString());
    } else {
        setIsRetroactive(false);
        setExpectedBalance(0);
        setInitialBalance('');
    }

    // 2. Compute Total from Date Range
    let durationCount = 0;
    if (frequency === 'weekly') durationCount = Math.max(0, differenceInCalendarWeeks(endDate, startDate));
    if (frequency === 'monthly') durationCount = Math.max(0, differenceInCalendarMonths(endDate, startDate));
    if (frequency === 'daily') durationCount = Math.max(0, differenceInCalendarDays(endDate, startDate));
    
    const amount = parseInt(brickAmount || '0', 10);
    setComputedTotal(amount * durationCount);

  }, [brickAmount, startDate, endDate, frequency]);


  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------

  const handleNext = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    
    if (step === 1) {
        setStep(2);
    } else if (step === 2) {
        if (!brickAmount) {
             Alert.alert("Oups", "Il faut définir combien tu poses !");
             return;
        }
        if (isBefore(endDate, startDate)) {
             Alert.alert("Erreur Dates", "La fin ne peut pas être avant le début !");
             return;
        }
        
        if (linkToProject) {
            setStep(3);
        } else {
            submitGoal(); // Skip Step 3
        }

    } else if (step === 3) {
        submitGoal();
    }
  };

  const submitGoal = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const finalName = name.trim() || `Ma Tontine ${frequency === 'weekly' ? 'Hebdo' : 'Mensuelle'}`;
    const amountVal = parseInt(brickAmount, 10);
    const initBalVal = initialBalance ? parseInt(initialBalance, 10) : 0;
    
    // Calculate final duration
    let durationVal = 0;
    if (frequency === 'weekly') durationVal = Math.max(1, differenceInCalendarWeeks(endDate, startDate));
    if (frequency === 'monthly') durationVal = Math.max(1, differenceInCalendarMonths(endDate, startDate));
    if (frequency === 'daily') durationVal = Math.max(1, differenceInCalendarDays(endDate, startDate));

    addGoal({
      name: finalName,
      description: `Tontine ${tontineType === 'variable_b' ? 'Challenge' : 'Fixe'} ${frequency} de ${amountVal} FCFA`,
      targetAmount: amountVal * durationVal,
      brickAmount: amountVal,
      frequency,
      duration: durationVal,
      startDate: startDate.toISOString(),
      tontineType,
      initialBalance: initBalVal,
      imageUri: selectedTemplate || undefined,
    });
    
    router.back();
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  // -------------------------------------------------------------------------
  // RENDER STEPS
  // -------------------------------------------------------------------------

  const renderStep1_Type = () => (
    <View style={styles.stepContainer}>
        <TouchableOpacity 
            style={[styles.cardSelect, tontineType === 'fixed' && styles.cardSelected]}
            onPress={() => setTontineType('fixed')}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <Ionicons name="cube-outline" size={28} color={tontineType === 'fixed' ? Colors.primary : Colors.textSecondary} />
                <View style={{flex: 1, marginLeft: Spacing.md}}>
                    <Text style={styles.cardTitle}>🧱 Fixe (Classique)</Text>
                    <Text style={styles.cardDesc}>Le même montant à chaque fois. Simple et stable.</Text>
                </View>
                {tontineType === 'fixed' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.cardSelect, tontineType === 'variable_b' && styles.cardSelected]}
            onPress={() => setTontineType('variable_b')}
            activeOpacity={0.8}
        >
             <View style={styles.cardHeader}>
                <Ionicons name="trending-up-outline" size={28} color={tontineType === 'variable_b' ? Colors.primary : Colors.textSecondary} />
                <View style={{flex: 1, marginLeft: Spacing.md}}>
                    <Text style={styles.cardTitle}>📈 Challenge (Variable)</Text>
                    <Text style={styles.cardDesc}>On augmente la mise progressivement. Pour les ambitieux.</Text>
                </View>
                {tontineType === 'variable_b' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
             </View>
        </TouchableOpacity>
    </View>
  );

  const renderStep2_Mechanics = () => (
    <View style={styles.stepContainer}>
        
        <Text style={styles.sectionTitle}>1. FRÉQUENCE</Text>
        <SegmentedControl 
            options={[
                { label: 'Hebdo', value: 'weekly' },
                { label: 'Mensuel', value: 'monthly' },
                { label: 'Jour', value: 'daily' }
            ]}
            selectedValue={frequency}
            onValueChange={(v) => setFrequency(v as any)}
            style={{ marginBottom: Spacing.lg }}
        />

        <Text style={styles.sectionTitle}>2. MONTANT BRIQUE</Text>
        <View style={styles.inputContainer}>
            <TextInput 
                style={styles.inputBig} 
                placeholder="5000" 
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={brickAmount}
                onChangeText={setBrickAmount}
            />
            <Text style={styles.suffix}>FCFA</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>3. PÉRIODE</Text>
        
        {/* Dates Row */}
        <View style={styles.row}>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateLabel}>Début</Text>
                <Text style={styles.dateValue}>{format(startDate, "d MMM yyyy", { locale: fr })}</Text>
            </TouchableOpacity>

            <View style={{width: Spacing.md}} />

            <TouchableOpacity style={styles.dateBox} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateLabel}>Fin</Text>
                <Text style={styles.dateValue}>{format(endDate, "d MMM yyyy", { locale: fr })}</Text>
            </TouchableOpacity>
        </View>

        {showStartPicker && (
            <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />
        )}
        {showEndPicker && (
            <DateTimePicker value={endDate} mode="date" display="default" minimumDate={startDate} onChange={onEndDateChange} />
        )}

        {/* Retroactive Warning Panel - Appears between dates if relevant */}
        {isRetroactive && (
            <View style={styles.retroactiveBox}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs}}>
                    <Ionicons name="time-outline" size={18} color={Colors.secondary} />
                    <Text style={styles.retroactiveTitle}> Tontine Rétroactive</Text>
                </View>
                <Text style={styles.retroactiveText}>
                    Tu aurais dû cotiser ~<Text style={{fontWeight:'bold'}}>{expectedBalance.toLocaleString()} F</Text>.
                </Text>
                <Text style={styles.labelInput}>Déjà en caisse ?</Text>
                <View style={styles.miniInputContainer}>
                     <TextInput 
                        style={styles.miniInput} 
                        placeholder="0" 
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="numeric"
                        value={initialBalance}
                        onChangeText={setInitialBalance}
                    />
                    <Text style={styles.suffixSmall}>FCFA</Text>
                </View>
            </View>
        )}

        {/* Total Simulation */}
        <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>OBJECTIF TOTAL ESTIMÉ</Text>
            <Text style={styles.resultAmount}>{computedTotal.toLocaleString()} FCFA</Text>
        </View>
        
        {/* Checkbox for Step 3 */}
        <TouchableOpacity 
            style={styles.checkboxRow} 
            onPress={() => setLinkToProject(!linkToProject)}
            activeOpacity={0.8}
        >
            <View style={[styles.checkbox, linkToProject && styles.checkboxChecked]}>
                {linkToProject && <Ionicons name="checkmark" size={16} color="#000" />}
            </View>
            <Text style={styles.checkboxLabel}>Associer un projet (Moto, Maison...) ?</Text>
        </TouchableOpacity>

    </View>
  );

  const renderStep3_Identity = () => (
    <View style={styles.stepContainer}>
        <Text style={styles.label}>Nom de la tontine</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ex: Ma Moto, Dot Mariage..." 
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
        />

        <Text style={styles.label} style={{marginTop: Spacing.lg}}>Choisis une image</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateList}>
            {TEMPLATES.map((t) => (
                <TouchableOpacity 
                    key={t.id} 
                    style={[styles.templateItem, selectedTemplate === t.id && styles.templateSelected]}
                    onPress={() => setSelectedTemplate(t.id)}
                >
                    <Image source={t.source} style={styles.templateImage} />
                    <Text style={styles.templateLabel}>{t.label}</Text>
                    {selectedTemplate === t.id && (
                        <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={12} color="#000" />
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
  );

  // -------------------------------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------------------------------

  return (
    <DirtBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        
        {/* UNIFIED HEADER */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Nouvelle Tontine</Text>
            </View>

            <View style={styles.stepBadge}>
                <Text style={styles.stepText}>{step}/3</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
            {step === 1 && renderStep1_Type()}
            {step === 2 && renderStep2_Mechanics()}
            {step === 3 && renderStep3_Identity()}
        </ScrollView>

        <View style={styles.footerAction}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                    {step === 3 || (!linkToProject && step === 2) ? "Lancer la Tontine 🚀" : "Continuer"}
                </Text>
                {step < 3 && (linkToProject || step === 1) && <Ionicons name="arrow-forward" size={20} color="#000" style={{marginLeft: 8}} />}
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: 120, // Space for footer
      paddingTop: Spacing.md,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingTop: 60,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
      marginRight: Spacing.md,
      padding: Spacing.xs,
  },
  headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.text,
      fontFamily: Typography.heading,
  },
  stepBadge: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
  },
  stepText: {
      color: Colors.primary,
      fontWeight: 'bold',
      fontSize: 14,
  },
  stepContainer: {
     gap: Spacing.md,
  },
  
  // CARD SELECT
  cardSelect: {
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: Spacing.lg,
      borderWidth: 2,
      borderColor: 'transparent',
      marginBottom: Spacing.md,
  },
  cardSelected: {
      borderColor: Colors.primary,
      backgroundColor: 'rgba(255, 193, 7, 0.05)',
  },
  cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.text,
      marginBottom: 4,
  },
  cardDesc: {
      fontSize: 14,
      color: Colors.textSecondary,
      lineHeight: 20,
  },

  // SECTION TITLES
  sectionTitle: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.xs,
      marginLeft: Spacing.xs,
  },

  // DATE BOXES
  row: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  dateBox: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 12,
      padding: Spacing.md,
      alignItems: 'center',
  },
  dateLabel: {
      color: Colors.textSecondary,
      fontSize: 12,
      marginBottom: 4,
  },
  dateValue: {
      color: Colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
  },

  // RETROACTIVE
  retroactiveBox: {
      backgroundColor: 'rgba(211, 84, 0, 0.1)', // Terracotta tint
      borderColor: 'rgba(211, 84, 0, 0.3)',
      borderWidth: 1,
      borderRadius: 16,
      padding: Spacing.md,
      marginVertical: Spacing.lg,
  },
  retroactiveTitle: {
      color: Colors.secondary,
      fontWeight: 'bold',
      marginLeft: Spacing.xs,
  },
  retroactiveText: {
      color: Colors.text,
      fontSize: 14,
      marginBottom: Spacing.md,
      marginLeft: Spacing.xs,
  },
  labelInput: {
      color: Colors.textSecondary,
      fontSize: 12,
      marginBottom: Spacing.xs,
      marginLeft: Spacing.xs,
  },
  miniInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.background,
      borderRadius: 8,
      paddingHorizontal: Spacing.md,
      height: 44,
  },
  miniInput: {
      flex: 1,
      color: Colors.text,
      fontSize: 16,
      fontWeight: 'bold',
  },
  suffixSmall: {
      color: Colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
  },

  // CHECKBOX
  checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.lg,
      padding: Spacing.sm,
  },
  checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: Colors.primary,
      marginRight: Spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
  },
  checkboxChecked: {
      backgroundColor: Colors.primary,
  },
  checkboxLabel: {
      color: Colors.text,
      fontSize: 16,
      fontWeight: '500',
  },

  // INPUTS
  label: {
      color: Colors.textSecondary,
      fontSize: 14,
      marginBottom: Spacing.xs,
      marginLeft: Spacing.xs,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.surface,
      borderRadius: 16,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      height: 64,
  },
  inputBig: {
      flex: 1,
      color: Colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: Typography.heading,
  },
  input: {
      backgroundColor: Colors.surface,
      borderRadius: 12,
      padding: Spacing.md,
      color: Colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      fontFamily: Typography.body,
  },
  suffix: {
      color: Colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: Spacing.xs,
  },

  // RESULT CARD
  resultCard: {
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      borderRadius: 20,
      padding: Spacing.lg,
      alignItems: 'center',
      marginTop: Spacing.xl,
      borderWidth: 1,
      borderColor: Colors.accent,
  },
  resultLabel: {
      color: Colors.accent,
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: Spacing.xs,
      letterSpacing: 1,
  },
  resultAmount: {
      color: Colors.text, // Fixed: Colors.white did not exist
      fontSize: 32,
      fontWeight: '900',
      fontFamily: Typography.heading,
  },

  // TEMPLATES
  templateList: {
      flexDirection: 'row',
      marginTop: Spacing.xs,
  },
  templateItem: {
      marginRight: Spacing.md,
      alignItems: 'center',
      padding: Spacing.xs,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
  },
  templateSelected: {
      borderColor: Colors.primary,
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  templateImage: {
      width: 60,
      height: 60,
      marginBottom: Spacing.xs,
  },
  templateLabel: {
      color: Colors.textSecondary,
      fontSize: 12,
  },
  checkBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },

  // FOOTER ACTION
  footerAction: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.xl,
      backgroundColor: Colors.background, 
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
  },
  nextButton: {
      backgroundColor: Colors.primary,
      padding: Spacing.lg,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  nextButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: Typography.heading,
  },
});

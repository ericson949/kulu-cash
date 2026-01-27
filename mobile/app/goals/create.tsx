import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGoalStore, GoalState } from '@/src/features/goals/domain/goal.store';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { SegmentedControl } from '@/src/shared/components/SegmentedControl';
import { Ionicons } from '@expo/vector-icons';
import { addWeeks, addMonths, addDays, format, isBefore, startOfDay, differenceInCalendarWeeks, differenceInCalendarMonths } from 'date-fns';
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

  // --- STEP 1: TYPE & FREQ ---
  const [tontineType, setTontineType] = useState<'fixed' | 'variable_b'>('fixed');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'daily'>('weekly');

  // --- STEP 2: MECHANICS ---
  const [brickAmount, setBrickAmount] = useState('');
  const [duration, setDuration] = useState('52'); // Default
  const [startDate, setStartDate] = useState(new Date());
  
  // Retroactive Logic
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [initialBalance, setInitialBalance] = useState('');
  const [expectedBalance, setExpectedBalance] = useState(0);

  // --- STEP 3: IDENTITY ---
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // --- COMPUTED ---
  const [computedTotal, setComputedTotal] = useState(0);
  const [endDateDisplay, setEndDateDisplay] = useState('');

  // -------------------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------------------

  useEffect(() => {
    // 1. Check Retroactivity
    const now = startOfDay(new Date());
    const start = startOfDay(startDate);
    
    if (isBefore(start, now)) {
        setIsRetroactive(true);
        // Calculate expected balance
        let elapsed = 0;
        if (frequency === 'weekly') elapsed = differenceInCalendarWeeks(now, start);
        if (frequency === 'monthly') elapsed = differenceInCalendarMonths(now, start);
        // Basic calculation for Fixed type (Type B logic to be added later if needed)
        const amt = parseInt(brickAmount || '0', 10);
        setExpectedBalance(elapsed * amt);
    } else {
        setIsRetroactive(false);
        setExpectedBalance(0);
        setInitialBalance('');
    }

    // 2. Compute Total & End Date
    const amount = parseInt(brickAmount || '0', 10);
    const dur = parseInt(duration || '0', 10);
    setComputedTotal(amount * dur);

    let end = new Date(startDate);
    if (frequency === 'weekly') end = addWeeks(end, dur);
    if (frequency === 'monthly') end = addMonths(end, dur);
    if (frequency === 'daily') end = addDays(end, dur);
    setEndDateDisplay(format(end, "d MMMM yyyy", { locale: fr }));

  }, [brickAmount, duration, frequency, startDate]);


  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------

  const handleNext = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    
    if (step === 1) {
        setStep(2);
    } else if (step === 2) {
        if (!brickAmount || !duration) {
             Alert.alert("Oups", "Il faut définir la brique et la durée !");
             return;
        }
        setStep(3);
    } else if (step === 3) {
        submitGoal();
    }
  };

  const submitGoal = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const finalName = name.trim() || `Ma Tontine ${frequency === 'weekly' ? 'Hebdo' : 'Mensuelle'}`;
    const amountVal = parseInt(brickAmount, 10);
    const durationVal = parseInt(duration, 10);
    const initBalVal = initialBalance ? parseInt(initialBalance, 10) : 0;

    addGoal({
      name: finalName,
      description: `Tontine ${tontineType} ${frequency} de ${amountVal} FCFA`,
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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  // -------------------------------------------------------------------------
  // RENDER STEPS
  // -------------------------------------------------------------------------

  const renderStep1_Type = () => (
    <View style={styles.stepContainer}>
        <Text style={styles.question}>Quel type de tontine ?</Text>
        
        <TouchableOpacity 
            style={[styles.cardSelect, tontineType === 'fixed' && styles.cardSelected]}
            onPress={() => setTontineType('fixed')}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>🧱 Fixe (Classique)</Text>
                {tontineType === 'fixed' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
            </View>
            <Text style={styles.cardDesc}>Le même montant à chaque fois. Simple et efficace.</Text>
        </TouchableOpacity>

        {/* Disabled Type B for MVP cleanliness or show as coming soon */}
        <TouchableOpacity 
            style={[styles.cardSelect, tontineType === 'variable_b' && styles.cardSelected, { opacity: 0.5 }]}
            onPress={() => Alert.alert("Bientôt !", "Le mode Challenge arrive bientôt.")}
            //onPress={() => setTontineType('variable_b')}
        >
             <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📈 Challenge (Type B)</Text>
             </View>
             <Text style={styles.cardDesc}>On augmente la mise chaque semaine. Pour les vrais bâtisseurs.</Text>
        </TouchableOpacity>

        <Text style={styles.question} style={{marginTop: Spacing.xl}}>Quelle fréquence ?</Text>
        <SegmentedControl 
            options={[
                { label: 'Hebdo', value: 'weekly' },
                { label: 'Mensuel', value: 'monthly' }
            ]}
            selectedValue={frequency}
            onValueChange={(v) => setFrequency(v as any)}
        />
    </View>
  );

  const renderStep2_Mechanics = () => (
    <View style={styles.stepContainer}>
        <Text style={styles.question}>Dates & Montants</Text>

        {/* Date Picker Trigger */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.dateText}>Début : {format(startDate, "d MMMM yyyy", { locale: fr })}</Text>
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}

        {/* Retroactive Warning */}
        {isRetroactive && (
            <View style={styles.retroactiveBox}>
                <Text style={styles.retroactiveTitle}>🕰️ Tontine Rétroactive</Text>
                <Text style={styles.retroactiveText}>
                    Tu aurais déjà dû cotiser environ <Text style={{fontWeight:'bold'}}>{expectedBalance.toLocaleString()} F</Text>.
                </Text>
                <Text style={styles.label}>Combien as-tu déjà mis de côté ?</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Ex: 50000" 
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                    value={initialBalance}
                    onChangeText={setInitialBalance}
                />
            </View>
        )}

        <View style={styles.row}>
            <View style={{flex: 1, marginRight: Spacing.md}}>
                <Text style={styles.label}>La Brique</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.inputBig} 
                        placeholder="5000" 
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="numeric"
                        value={brickAmount}
                        onChangeText={setBrickAmount}
                    />
                    <Text style={styles.suffix}>F</Text>
                </View>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.label}>Durée</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.inputBig} 
                        placeholder="52" 
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="numeric"
                        value={duration}
                        onChangeText={setDuration}
                    />
                    <Text style={styles.suffix}>{frequency === 'weekly' ? 'sem.' : 'mois'}</Text>
                </View>
            </View>
        </View>

        <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>OBJECTIF FINAL</Text>
            <Text style={styles.resultAmount}>{computedTotal.toLocaleString()} FCFA</Text>
            <Text style={styles.resultDate}>Fin le {endDateDisplay}</Text>
        </View>
    </View>
  );

  const renderStep3_Identity = () => (
    <View style={styles.stepContainer}>
        <Text style={styles.question}>Donne-lui une âme ✨</Text>
        
        <Text style={styles.label}>Nom du chantier</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ex: Ma Moto, Dot Mariage..." 
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Étape {step}/3</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
            {step === 1 && renderStep1_Type()}
            {step === 2 && renderStep2_Mechanics()}
            {step === 3 && renderStep3_Identity()}
        </ScrollView>

        <View style={styles.footerAction}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>{step === 3 ? "Lancer le Chantier 🚀" : "Continuer"}</Text>
                {step < 3 && <Ionicons name="arrow-forward" size={20} color="#000" style={{marginLeft: 8}} />}
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
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingTop: 60,
      marginBottom: Spacing.lg,
  },
  backButton: {
      marginRight: Spacing.md,
      padding: Spacing.xs,
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.text,
      fontFamily: Typography.heading,
  },
  stepContainer: {
     gap: Spacing.lg,
  },
  question: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.text,
      marginBottom: Spacing.md,
      fontFamily: Typography.heading,
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.text,
  },
  cardDesc: {
      fontSize: 14,
      color: Colors.textSecondary,
      lineHeight: 20,
  },
  // DATE BTN
  dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: Spacing.md,
      borderRadius: 12,
      alignSelf: 'flex-start',
  },
  dateText: {
      color: Colors.text,
      fontWeight: '600',
      marginLeft: Spacing.sm,
  },
  // RETROACTIVE
  retroactiveBox: {
      backgroundColor: 'rgba(211, 84, 0, 0.1)',
      borderColor: Colors.secondary,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.md,
      marginVertical: Spacing.sm,
  },
  retroactiveTitle: {
      color: Colors.secondary,
      fontWeight: 'bold',
      marginBottom: Spacing.xs,
  },
  retroactiveText: {
      color: Colors.textSecondary,
      fontSize: 14,
      marginBottom: Spacing.md,
  },
  // INPUTS
  label: {
      color: Colors.textSecondary,
      fontSize: 14,
      marginBottom: Spacing.xs,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.surface,
      borderRadius: 12,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      height: 56,
  },
  inputBig: {
      flex: 1,
      color: Colors.text,
      fontSize: 20,
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
      fontSize: 14,
      fontWeight: '600',
      marginLeft: Spacing.xs,
  },
  row: {
      flexDirection: 'row',
  },
  // RESULT CARD
  resultCard: {
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      borderRadius: 20,
      padding: Spacing.lg,
      alignItems: 'center',
      marginTop: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.accent,
  },
  resultLabel: {
      color: Colors.accent,
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: Spacing.xs,
      letterSpacing: 0.5,
  },
  resultAmount: {
      color: Colors.white,
      fontSize: 36,
      fontWeight: '900',
      fontFamily: Typography.heading,
      marginBottom: Spacing.xs,
  },
  resultDate: {
      color: Colors.textSecondary,
      fontSize: 14,
      fontStyle: 'italic',
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
      backgroundColor: Colors.background, // Should match background to cover scroll
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

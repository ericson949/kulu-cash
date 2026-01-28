import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.tabContainer}>
        {/* BLUR BACKGROUND */}
        {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 12, 0.95)' }]} />
        )}
        
        <View style={styles.tabContent}>
            {/* LEFT TABS */}
            <TabItem 
                icon="home" 
                label={t('tabs.home')} 
                isActive={state.index === 0} 
                onPress={() => navigation.navigate('index')} 
            />
            <TabItem 
                icon="account-balance" 
                label={t('tabs.tontines')} 
                isActive={state.index === 1} 
                onPress={() => navigation.navigate('tontines')} 
            />

            {/* SPACER FOR CENTER BUTTON */}
            <View style={{ width: 60 }} />

            {/* RIGHT TABS */}
            <TabItem 
                icon="notifications" 
                label={t('tabs.inbox')} 
                isActive={state.index === 3} 
                onPress={() => navigation.navigate('inbox')} 
                hasBadge
            />
            <TabItem 
                icon="person" 
                label={t('tabs.profile')} 
                isActive={state.index === 4} 
                onPress={() => navigation.navigate('profile')} 
            />
        </View>

        {/* CENTRAL FLOATING BUTTON */}
        <TouchableOpacity 
            style={styles.fab}
            activeOpacity={0.9}
            onPress={() => router.push('/tontine/create')}
        >
             <MaterialIcons name="add" size={32} color={Colors.background} style={{ fontWeight: 'bold' }} />
        </TouchableOpacity>
    </View>
  );
}

const TabItem = ({ icon, label, isActive, onPress, hasBadge }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.tabItem}>
        <View>
            <MaterialIcons 
                name={icon} 
                size={26} 
                color={isActive ? Colors.primary : Colors.textSecondary} 
            />
            {hasBadge && <View style={styles.badge} />}
        </View>
        <Text style={[
            styles.tabLabel, 
            { color: isActive ? Colors.primary : Colors.textSecondary }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function TabLayout() {
  return (
    <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
            headerShown: false,
        }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="tontines" options={{ title: 'Tontines' }} />
      <Tabs.Screen name="add" options={{ title: 'Add' }} />
      <Tabs.Screen name="inbox" options={{ title: 'Inbox' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 95 : 80,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        elevation: 0,
        backgroundColor: Platform.OS === 'android' ? 'rgba(10, 15, 12, 0.95)' : 'transparent',
    },
    tabContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 30, // px-8 approx
        paddingTop: 12, // pt-3
        height: '100%',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6, // gap-1.5
    },
    tabLabel: {
        fontSize: 9,
        fontWeight: '800', // font-black
        textTransform: 'uppercase',
        letterSpacing: 1.5, // tracking-widest
    },
    fab: {
        position: 'absolute',
        top: -32, // -top-8 (8 * 4 = 32)
        left: (width / 2) - 32, // Center horizontally
        width: 64, // w-16
        height: 64, // h-16
        borderRadius: 20, // rounded-2xl (approx 20px)
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3, // shadow approx
        shadowRadius: 24,
        elevation: 10,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: Colors.background,
    }
});

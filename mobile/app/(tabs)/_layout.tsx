import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/src/shared/theme/tokens';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import * as Haptics from 'expo-haptics';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

const CustomTabBarButton = ({ onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -25, // Lifted slightly more for pop
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={{
      width: 64, // Slightly bigger
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow // Shadow must be on the colored view for Android elevation
    }}>
      <Ionicons name="add" size={36} color={Colors.background} />
    </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
            backgroundColor: Colors.background, // Dark background
            borderTopWidth: 0,
            elevation: 0,
            height: Platform.OS === 'ios' ? 85 : 60,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        headerShown: false,
        tabBarShowLabel: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
        listeners={{
            tabPress: () => Haptics.selectionAsync(),
        }}
      />
      
      <Tabs.Screen
        name="actions"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={32} color="#000" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
        }}
        listeners={{
            tabPress: (e) => {
                e.preventDefault();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // Navigate to Create Goal Wizard
                router.push('/goals/create');
            },
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
        }}
        listeners={{
            tabPress: () => Haptics.selectionAsync(),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000', // Black shadow for better separation
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5, // Darker shadow
        shadowRadius: 8,
        elevation: 10, // Higher elevation for Android
    }
});

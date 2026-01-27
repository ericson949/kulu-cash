import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Colors } from '@/src/shared/theme/tokens';

interface BrickWallProps {
  totalBricks: number;
  completedBricks: number;
  brickHeight?: number;
}

const { width } = Dimensions.get('window');
const BRICK_RATIO = 2.5; // Width / Height

export const BrickWall = ({ totalBricks, completedBricks, brickHeight = 12 }: BrickWallProps) => {
  // Simple grid logic
  // We want to stack bricks from bottom.
  // Rows?
  // Let's just render a flex wrap container but "reversed"?
  // Or just a grid.
  
  // Generate bricks array
  const bricks = Array.from({ length: totalBricks }, (_, i) => {
      const isCompleted = i < completedBricks;
      return { id: i, isCompleted };
  });

  return (
    <View style={styles.container}>
      <View style={styles.wall}>
          {bricks.map((brick) => (
              <View 
                key={brick.id} 
                style={[
                    styles.brick, 
                    { height: brickHeight, width: brickHeight * BRICK_RATIO },
                    brick.isCompleted ? styles.brickCompleted : styles.brickEmpty
                ]} 
              />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  wall: {
      flexDirection: 'row',
      flexWrap: 'wrap-reverse', // Stack from bottom
      justifyContent: 'center',
      gap: 4,
      width: '100%',
  },
  brick: {
      borderRadius: 2,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  brickCompleted: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
  },
  brickEmpty: {
      backgroundColor: 'rgba(255,255,255,0.02)',
  }
});

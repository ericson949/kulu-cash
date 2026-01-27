import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export const ProofCaptureService = {
  requestPermissions: async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        "Permissions manquantes", 
        "Kulu a besoin de tes yeux pour voir les preuves ! 👀",
        [{ text: "Ouvrir Réglages", onPress: () => Linking.openSettings() }, { text: "Annuler" }]
      );
      return false;
    }
    return true;
  },

  takePhoto: async (): Promise<string | null> => {
    const hasPerms = await ProofCaptureService.requestPermissions();
    if (!hasPerms) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true, // Square crop for polaroid effect later?
      aspect: [4, 5], // Polaroid-ish
      quality: 0.5, // Compression as per Story 3.1
    });

    if (!result.canceled && result.assets[0].uri) {
      return result.assets[0].uri;
    }
    return null;
  },

  pickImage: async (): Promise<string | null> => {
    const hasPerms = await ProofCaptureService.requestPermissions();
    if (!hasPerms) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      return result.assets[0].uri;
    }
    return null;
  }
};

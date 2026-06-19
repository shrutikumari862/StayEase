import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css"
import { Text, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";


export default function Index() {
   const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)"} />
  }

  return  <Redirect href="/sign_up" />
}


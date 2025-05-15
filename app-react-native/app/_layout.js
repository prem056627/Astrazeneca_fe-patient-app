// app/_layout.js
import { Stack, Slot } from "expo-router";
import { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import { initializeApi } from "../services/auth";
import Constants from "expo-constants";
import { useReqIdStore, useStore } from "../zustand";
import { View, Text, BackHandler, Platform, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen"; // Import SplashScreen
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const pathname = usePathname();
  const envValues = Constants.expoConfig?.extra;
  const router = useRouter();
  const isLoggedIn = false;
  const { _, setRequestId } = useReqIdStore();
  const navigation = useNavigation();
  const { isGoBackAllowed } = useStore();

  async function seeToken() {
    // const zangocookie = await AsyncStorage.getItem("@zangocookie");
    // const csrftoken = await AsyncStorage.getItem("csrftoken");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const newUserFlag = await AsyncStorage.getItem("new_user_flag");
    console.log("_layout", accessToken, newUserFlag);
    if (accessToken) {
      if (newUserFlag === "yes") {
        router.replace("/loader");
        router.push("/profile");
      } else {
        router.replace("/loader");
        router.push("/webview");
      }
    } else {
      router.replace("/loader");
      router.push("/");
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (pathname === "/webview") {
          // Prevent back navigation when on webview

          return true; // Returning true prevents default behavior
        }
        return false; // Allow default back behavior for other screens
      }
    );

    return () => backHandler.remove(); // Cleanup listener
  }, [pathname]);

  const initializeLogin = async () => {
    const res = await initializeApi(envValues.apiUrl);
    setRequestId(res.request_id);
  };

  // useEffect(() => {
  //   initializeLogin();
  //   seeToken();
  // }, [])

  useEffect(() => {
    const prepare = async () => {
      try {
        // Perform initialization tasks
        await initializeLogin();
        await seeToken();

        // Add an additional delay (e.g., 3 seconds) for splash screen
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn("Error during initialization:", e);
      } finally {
        // Hide the splash screen after everything is done
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  const toastConfig = {
    warning: ({ text1, text2 }) => (
      <View
        style={{
          height: 60,
          width: "90%",
          backgroundColor: "#ffcc00",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>{text1}</Text>
        <Text>{text2}</Text>
      </View>
    ),
    error: ({ text1, text2 }) => (
      <View
        style={{
          height: 50,
          width: "90%",
          backgroundColor: "#A11327",
          padding: 10,
          borderRadius: 5,
          marginTop: 15,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>{text1}</Text>
        <Text style={{ color: "#ffffff" }}>{text2}</Text>
      </View>
    ),
    info: ({ text1, text2 }) => (
      <View
        style={{
          height: 60,
          width: "90%",
          backgroundColor: "#9933ff",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text>{text1}</Text>
        <Text>{text2}</Text>
      </View>
    ),
    success: ({ text1, text2 }) => (
      <View
        style={Platform.OS === "ios" ? styles.toastIos : styles.toastAndroid}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>{text1}</Text>
        <Text style={{ color: "#ffffff" }}>{text2}</Text>
      </View>
    ),
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/loader");
      router.replace("/webview");
    }
  }, [isLoggedIn]);

  return (
    <>
      {pathname === "/privacy" ? (
        <Slot />
      ) : (
        <Stack>
          <Stack.Screen
            name="loader"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              title: "Phone Number",
              headerShown: false,
              headerLeft: () => null,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="otp"
            options={{
              title: "OTP Verification",
              headerShown: false,
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              title: "Complete Profile",
              headerShown: false,
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="webview"
            options={{
              title: "Web Content",
              headerShown: false,
              headerLeft: () => null,
              gestureEnabled: isGoBackAllowed,
              headerBackVisible: false,
            }}
          />
        </Stack>
      )}
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  toastIos: {
    // height: 50,
    width: "90%",
    backgroundColor: "#A11327",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  toastAndroid: {
    // height: 50,
    width: "90%",
    backgroundColor: "#A11327",
    padding: 10,
    borderRadius: 5,
    marginTop: 0,
  },
});

import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  Platform,
  StatusBar,
  Linking,
  Share,
  BackHandler,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { hitLogout } from "../services/auth";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useStore } from "../zustand";

export default function WebViewScreen() {
  const envValues = Constants.expoConfig?.extra;
  // const [zangocookie, setZangocookie] = useState("");
  // const [csrftoken, setCsrftoken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [permissionsInitialized, setPermissionsInitialized] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const webviewRef = useRef(null);
  const navigation = useNavigation();
  const { isGoBackAllowed, setIsGoBackAllowed, setPhoneNumber, setOtp } = useStore();

  // Pre-request permissions at startup using compatible APIs
  const initializePermissions = async () => {
    try {
      console.log("Initializing permissions...");
      
      // Use ImagePicker for both camera and gallery permissions
      console.log("Initializing camera permission...");
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Camera permission status:", cameraStatus.status);
      setCameraPermission(cameraStatus.status);

      console.log("Initializing gallery permission...");
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Gallery permission status:", galleryStatus.status);
      setGalleryPermission(galleryStatus.status);

      console.log("Initializing media library permission...");
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      console.log("Media library status:", mediaLibraryStatus.status);
      
      setPermissionsInitialized(true);
    } catch (error) {
      console.error("Error initializing permissions:", error);
      // Continue even if there's an error with permissions
      setPermissionsInitialized(true);
    }
  };

  const fetchToken = async () => {
    // const zangocookie = await AsyncStorage.getItem("@zangocookie");
    // const csrftoken = await AsyncStorage.getItem("csrftoken");
    const accessToken = await AsyncStorage.getItem("accessToken");
    // setZangocookie(zangocookie || "");
    // setCsrftoken(csrftoken || "");
    setAccessToken(accessToken || '')
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchToken();
      await AsyncStorage.setItem("social_login", "no");
      await AsyncStorage.setItem("new_user_flag", "no");
      
      // Initialize permissions early
      await initializePermissions();

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };
    initialize();
  }, []);

  // Enhanced permission checks with compatible API
  const ensureCameraPermission = async () => {
    try {
      if (cameraPermission === "granted") {
        return true;
      }
      
      console.log("Requesting camera permission...");
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);
      setCameraPermission(status);
      
      if (status === "granted") {
        return true;
      } else {
        Alert.alert(
          "Camera Permission Required",
          "This feature requires camera access. Please enable camera permissions in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings", 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
        return false;
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      alert("Error accessing camera: " + error.message);
      return false;
    }
  };

  const ensureGalleryPermission = async () => {
    try {
      if (galleryPermission === "granted") {
        return true;
      }
      
      console.log("Requesting gallery permission...");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Gallery permission status:", status);
      setGalleryPermission(status);
      
      if (status === "granted") {
        return true;
      } else {
        Alert.alert(
          "Gallery Permission Required",
          "This feature requires access to your photos. Please enable gallery permissions in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Open Settings", 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
        return false;
      }
    } catch (error) {
      console.error("Error requesting gallery permission:", error);
      alert("Error accessing gallery: " + error.message);
      return false;
    }
  };

  // Image selection functions
  const showImageSourcePicker = (inputId) => {
    Alert.alert(
      "Select Image Source",
      "Choose where to select your image from",
      [
        {
          text: "Camera",
          onPress: () => takePhoto(inputId),
        },
        {
          text: "Gallery",
          onPress: () => pickImage(inputId),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async (inputId) => {
    if (!(await ensureGalleryPermission())) return;

    try {
      console.log("Opening image picker...");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log("Image picker result:", JSON.stringify(result));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Selected image URI:", result.assets[0].uri);
        webviewRef.current?.postMessage(
          JSON.stringify({ 
            type: "upload", 
            uri: result.assets[0].uri,
            inputId: inputId
          })
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to select image. Please try again.");
    }
  };

  const takePhoto = async (inputId) => {
    if (!(await ensureCameraPermission())) return;

    try {
      console.log("Launching camera...");
      
      // Use minimal options to reduce chance of crashes
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false, // Set to false to minimize processing
        quality: 0.8,        // Lower quality to reduce memory usage
        exif: false,         // Disable EXIF data to minimize processing
      });

      console.log("Camera result:", JSON.stringify(result));
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Photo URI:", result.assets[0].uri);
        
        // Make sure webviewRef exists before posting message
        if (webviewRef.current) {
          console.log("Sending camera result to WebView");
          webviewRef.current.postMessage(
            JSON.stringify({ 
              type: "upload", 
              uri: result.assets[0].uri,
              inputId: inputId
            })
          );
        } else {
          console.error("WebView reference is null!");
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Failed to take photo. Please try again.");
    }
  };

  const handleGoBack = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
    }
  };

  const handleNavigationChange = (navState) => {
    console.log("Current URL:", navState.url);
    const url = navState.url;

    try {
      const domain = new URL(url).hostname;

      // cashfree domain check
      if (domain.endsWith("cashfree.com")) {
        setIsGoBackAllowed(true);
        console.log("User is on Cashfree domain");
      } else {
        setIsGoBackAllowed(false);
        console.log("Not on Cashfree domain:", domain);
      }
    } catch (error) {
      console.error("Invalid URL:", url);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isGoBackAllowed) {
          handleGoBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isGoBackAllowed]);

  usePreventRemove(isGoBackAllowed, ({ data }) => {
    if (Platform.OS === "web") {
      const discard = confirm(
        "You have unsaved changes. Discard them and leave the screen?"
      );

      if (discard) {
        navigation.dispatch(data.action);
      }
    } else {
      handleGoBack();
    }
  });

  // Updated injectCookiesAndScripts to provide proper file selection UI
  const injectCookiesAndScripts = `

    window.localStorage.setItem('accessToken', '${accessToken}');

    // Handle file inputs with a custom selection menu
    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('click', (event) => {
        // Prevent the default file picker
        event.preventDefault();
        
        // Send message to React Native to show image source picker
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: "showImagePicker",
          inputId: input.id || Math.random().toString(36).substring(7) // Send ID to map back to correct input
        }));
        
        return false;
      });
    });
    
    // Define a global function for file downloads
    window.downloadFile = (url) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "download", url }));
    };
    
    // Override XMLHttpRequest for PDF base64 data
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      const promise = originalFetch.apply(this, arguments);
      return promise.then(response => {
        // Clone the response to avoid consuming it
        const clonedResponse = response.clone();
        return response;
      });
    };

    // for Debugging
      (function() {
      const logTypes = ['log', 'warn', 'error', 'info', 'debug'];
      logTypes.forEach(type => {
        const original = console[type];
        console[type] = function(...args) {
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: type,
              args: args
            }));
          } catch (err) {}
          original.apply(console, args);
        };
      });
    })();


    true;
  `;

  // Handle Downloads
  const handleDownload = async (url) => {
    try {
      const fileUri = FileSystem.documentDirectory + "downloaded_file.pdf";
      const downloadedFile = await FileSystem.downloadAsync(url, fileUri);
      // alert("File downloaded to: " + downloadedFile.uri);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download the file.");
    }
  };

  const handlePDF = async (source, filename, shouldShare = false) => {
    try {
      let fileUri;

      // Determine if the source is a URL or base64 data
      const isUrl = source.startsWith("http");

      if (isUrl) {
        // For URL sources, download the file first
        const downloadUri = `${
          FileSystem.cacheDirectory
        }${Date.now()}-${filename}`;
        const downloadResult = await FileSystem.downloadAsync(
          source,
          downloadUri
        );

        if (downloadResult.status !== 200) {
          throw new Error(
            `Failed to download PDF, status: ${downloadResult.status}`
          );
        }

        fileUri = downloadResult.uri;
        console.log("PDF downloaded successfully to:", fileUri);
      } else {
        // Handle base64 data as before
        let pureBase64 = source;
        if (source.startsWith("data:")) {
          pureBase64 = source.split(",")[1];
        }

        const uniqueFilename = `${Date.now()}-${filename}`;
        fileUri = `${FileSystem.cacheDirectory}${uniqueFilename}`;

        await FileSystem.writeAsStringAsync(fileUri, pureBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // Sharing logic remains the same
      if (shouldShare) {
        if (await Sharing.isAvailableAsync()) {
          try {
            const shareOptions = {
              mimeType: "application/pdf",
              dialogTitle: "Share Health Assessment Report",
              UTI: "com.adobe.pdf", // Required for iOS
            };

            await Sharing.shareAsync(fileUri, shareOptions);
          } catch (shareError) {
            console.error("Error sharing PDF:", shareError);
            alert("Failed to share the PDF. Please try again.");
          }
        } else {
          alert("Sharing is not available on this device");
        }
      } else {
        try {
          const permissions = await MediaLibrary.requestPermissionsAsync();
          if (permissions.granted) {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("Downloads", asset, false);
            alert("PDF saved to your device");
          } else {
            alert("Storage permission denied. Cannot save PDF.");
          }
        } catch (saveError) {
          console.error("Error saving PDF:", saveError);
          alert("Failed to save the PDF to your device");
        }
      }
    } catch (error) {
      console.error("Error handling PDF:", error);
      alert(`Failed to process the PDF: ${error.message}`);
    }
  };

  // Handle WebView messages with improved error handling
  const onMessage = async (event) => {
    const data = event.nativeEvent.data;

    try {
      const { type, args } = JSON.parse(event.nativeEvent.data);
      console[type]?.(
        "%c WebView Log >>>>>>>>>> ",  "background: #222; color: #bada55; padding: 6px 4px;",
        ...args,
      );
    } catch (err) {
      console.log("WebView Message (non-console):", event.nativeEvent.data);
    }

    try {
      const data = event.nativeEvent.data;
      const message = JSON.parse(data);

      console.log("Received message from WebView:", message.type);

      switch (message.type) {
        case "logout":
          setPhoneNumber('')
          setOtp(['', '', '', '', '', '']);
          // await AsyncStorage.removeItem("@zangocookie");
          // await AsyncStorage.removeItem("csrftoken");
          await AsyncStorage.removeItem("accessToken");
          await hitLogout(envValues.apiUrl);
          router.push({ pathname: "/" });
          break;

        case "showImagePicker":
          showImageSourcePicker(message.inputId);
          break;

        case "pickImage":
          pickImage();  // Keep for backward compatibility
          break;

        case "takePhoto":
          takePhoto();  // Keep for backward compatibility
          break;

        case "download":
          console.log("Download URL:", message.url);
          handleDownload(message.url);
          break;

        case "SHARE_PDF":
          console.log("SHARE_PDF URL:", message.pdfUrl);
          await handlePDF(
            message.pdfUrl,
            message.filename || "health-assessment-report.pdf",
            true
          );
          break;

        case "DOWNLOAD_PDF":
          console.log("DOWNLOAD_PDF URL:", message.pdfUrl);
          handleDownload(message.pdfUrl);
          break;
      }

      if (message.label === "redirect") {
        Linking.openURL(message.data.redirect_url);
      }
    } catch (error) {
      console.error("Error handling WebView message:", error);
    }
  };

  const handleUrlRequest = (request) => {
    const url = request.url;
    if (url.startsWith("mailto:") || url.startsWith("tel:")) {
      Linking.openURL(url).catch((err) => {
        console.error("Failed to open URL:", err);
        alert(
          `Cannot open ${url.startsWith("mailto:") ? "email app" : "phone app"}`
        );
      });

      return false;
    }
    return true;
  };

  return (
    <>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#A11327" />
        </View>
      )}
      <SafeAreaView style={styles.container}>
        {Platform.OS === "ios" ? (
          <StatusBar barStyle="dark-content" backgroundColor="#121826" />
        ) : (
          <StatusBar barStyle="light-content" backgroundColor="#121826" />
        )}
        <WebView
          ref={webviewRef}
          style={styles.webview}
          source={{ uri: `${envValues.apiUrl}/common/mobile_app/` }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowingReadAccessToURL={FileSystem.documentDirectory}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          originWhitelist={["*", "mailto:*", "tel:*"]} 
          injectedJavaScript={
            accessToken ? injectCookiesAndScripts : ""
          }
          onMessage={onMessage}
          onShouldStartLoadWithRequest={handleUrlRequest}
          onLoad={() => console.log("WebView loaded 🚀")}
          cacheEnabled={true}
          androidLayerType="hardware"
          onNavigationStateChange={handleNavigationChange}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { CountryPicker } from "react-native-country-codes-picker";
import {
  useStore,
  useReqIdStore,
  useNextStepStore,
  useUserInfoStore,
} from "../zustand/index.js";
import * as WebBrowser from "expo-web-browser";
import NewmiIcon from "../assets/svg/NewmiIcon.js";
import GoogleIcon from "../assets/svg/GoogleIcon.js";
import MicrosoftIcon from "../assets/svg/MicrosoftIcon.js";
import Constants from "expo-constants";
import * as Google from "expo-auth-session/providers/google.js";
import {
  submitPhoneNumber,
  submitConsent,
  sendOtp,
  signupUsername,
  googleLogin,
  postOIDC,
} from "../services/auth.js";
import Loader from "../components/ui/Loader.js";
import WaveTop from "../assets/svg/WaveTop.js";
import { EmailIcon } from "../assets/svg/EmailIcon.js";
import { MobileIcon } from "../assets/svg/MobileIcon.js";
import * as Application from "expo-application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  makeRedirectUri,
  useAuthRequest,
  exchangeCodeAsync,
  useAutoDiscovery,
} from "expo-auth-session";
import TagLineIcon from "../assets/svg/TagLineIcon.js";
import { ChevronDown } from "../assets/svg/ChevronDown.js";

WebBrowser.maybeCompleteAuthSession();

export default function PhoneInput() {
  const envValues = Constants.expoConfig?.extra;
  const { phoneNumber, setPhoneNumber, loginType, setLoginType, countryCode, setCountryCode } = useStore();
  const [loading, setLoading] = useState(false);
  const { requestId } = useReqIdStore();
  const { setNextStep } = useNextStepStore();
  const [token, setToken] = useState(null);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [show, setShow] = useState(false);
  // const [countryCode, setCountryCode] = useState("+91");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Google User Info Fetching
  const getGoogleUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      console.log("Google User Info:", user);
      await AsyncStorage.setItem("email", user.email);
    } catch (error) {
      console.error("Error fetching Google user info:", error);
    }
  };

  // Microsoft User Info Fetching
  const getMicrosoftUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("email", user.mail);
        return user;
      } else {
        console.error("Error fetching Microsoft user info:", user);
      }
    } catch (error) {
      console.error("Error fetching Microsoft user info:", error);
    }
  };

  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/common/v2.0"
  );
  const msRedirectUri = makeRedirectUri({
    scheme: undefined,
    path: "auth",
  });

  const regex = /:\/\/auth$/;
  const ms_result = msRedirectUri.replace(regex, "");
  // console.log("MS Redirect URI:", msRedirectUri, ms_result);

  const redirectUri = makeRedirectUri({
    native: `${Application.applicationId}:/`,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "761709807223-ig3estvm70il049u94livv8s9kbtok6q.apps.googleusercontent.com",
    androidClientId:
      "761709807223-2d5os5uee4ldhpl2n1e20fru8jrfkdst.apps.googleusercontent.com",
    redirectUri: redirectUri,
    scopes: ["profile", "email"],
  });

  const [msRequest, msResponse, msPromptAsync] = useAuthRequest(
    {
      clientId: "0987eb92-1cdc-4833-b326-a06fd0547cfc", // Your Microsoft client ID
      scopes: ["openid", "profile", "email", "offline_access", "User.Read"],
      redirectUri:
        Platform.OS == "ios"
          ? `msauth.${msRedirectUri}`
          : `msauth://${ms_result}/mfAC4DRhdRmk8Z3ROoxk0HtgwxQ%3D`,
    },
    discovery
  );

  useEffect(() => {
    if (response?.authentication != null) {
      handleGoogleEffect();
    }
  }, [response]);

  useEffect(() => {
    if (msResponse?.type === "success") {
      handleMicrosoftEffect();
    }
  }, [msResponse]);

  async function handleGoogleEffect() {
    try {
      setIsFullScreenLoading(true);
      console.log("Google Response:", response);
      const accessToken = response?.authentication?.accessToken;
      await getGoogleUserInfo(accessToken);
      await AsyncStorage.setItem("social_login", "yes");
      const res = await googleLogin(envValues.apiUrl, accessToken);
      const { data } = await postOIDC(
        envValues.apiUrl,
        res?.request_id,
        accessToken,
        "google"
      );
      console.log("Google Login Data:", data);
      if (data.success) {
        // await AsyncStorage.setItem("@zangocookie", c.zangocookie);
        // await AsyncStorage.setItem("csrftoken", c.csrftoken);
        await AsyncStorage.setItem('accessToken', data.token );
        await AsyncStorage.setItem(
          "new_user_flag",
          data.new_user_flag || "yes"
        );
        router.replace("/loader");
        router.push({
          pathname:
            data.new_user_flag === "yes" || data.new_user_flag === undefined
              ? "/profile"
              : "/webview",
        });
      }
    } finally {
      setIsFullScreenLoading(false);
    }
  }

  async function handleMicrosoftEffect() {
    try {
      setIsFullScreenLoading(true);
      console.log("Microsoft Response:", msResponse);
      if (msRequest && msResponse?.type === "success" && discovery) {
        const tokenResponse = await exchangeCodeAsync(
          {
            clientId: "0987eb92-1cdc-4833-b326-a06fd0547cfc", // Match your client ID
            code: msResponse.params.code,
            extraParams: msRequest.codeVerifier
              ? { code_verifier: msRequest.codeVerifier }
              : undefined,
            redirectUri: `msauth.${msRedirectUri}`,
          },
          discovery
        );
        const accessToken = tokenResponse.accessToken;
        setToken(accessToken);
        console.log("Microsoft Access Token:", accessToken);

        // Fetch Microsoft user info
        const userInfo = await getMicrosoftUserInfo(accessToken);
        await AsyncStorage.setItem("social_login", "yes");
        console.log("Microsoft User Info:", userInfo);
        const res = await googleLogin(envValues.apiUrl, accessToken);
        console.log("Microsoft Login Response:", res);
        const { data} = await postOIDC(
          envValues.apiUrl,
          res?.request_id,
          accessToken,
          "microsoft"
        );
        console.log("Microsoft Login Data:", data);
        if (data.success) {
          // await AsyncStorage.setItem("@zangocookie", c.zangocookie);
          // await AsyncStorage.setItem("csrftoken", c.csrftoken);
          await AsyncStorage.setItem('accessToken', data.token );
          await AsyncStorage.setItem(
            "new_user_flag",
            data.new_user_flag || "yes"
          );
          router.replace("/loader");
          router.push({
            pathname:
              data.new_user_flag === "yes" || data.new_user_flag === undefined
                ? "/profile"
                : "/webview",
          });
        }
      }
    } catch (error) {
      console.error("Error in Microsoft login:", error);
    } finally {
      setIsFullScreenLoading(false);
    }
  }

  const redirectToOtpPage = () => {
    router.push({
      pathname: "/otp",
      params: { phone: phoneNumber },
    });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  function switchLoginType() {
    setLoginType(loginType === "phone" ? "email" : "phone");
    setPhoneNumber("");
  }

  const handleSubmit = async () => {
    setLoading(true);
    var res = await submitPhoneNumber(
      envValues.apiUrl,
      loginType == "email" ? phoneNumber : `${countryCode}${phoneNumber}`,
      requestId
    );
    console.log("Phone Submit Respons jbjbe:", res);
    if (loginType == "email") {
      console.log("seeting gor email");
      await AsyncStorage.setItem("social_login", "yes");
      await AsyncStorage.setItem("email", phoneNumber);
    }
    if (res.success) {
      setNextStep(res.next);
      if (res.next === "signup_username") {
        await AsyncStorage.setItem("mobile", `${countryCode}${phoneNumber}`);
        // if(loginType=='email'){
        //   console.log('seeting gor email')
        //   await AsyncStorage.setItem("social_login", "yes");
        //   await AsyncStorage.setItem("email", phoneNumber);
        // }
        console.log("New user");
        var res3 = await signupUsername(
          envValues.apiUrl,
          loginType == "email" ? phoneNumber : `${countryCode}${phoneNumber}`,
          requestId
        );
        var res1 = await submitConsent(
          envValues.apiUrl,
          loginType == "email" ? phoneNumber : `${countryCode}${phoneNumber}`,
          requestId
        );
        var res2 = await sendOtp(
          envValues.apiUrl,
          loginType == "email" ? phoneNumber : `${countryCode}${phoneNumber}`,
          requestId,
          "send_signup_otp"
        );
        console.log("Consent:", res1);
        console.log("OTP:", res2);
        console.log("Username:", res3);
        if (res.success && res2.success && res1.success && res3.success) {
          redirectToOtpPage();
        } else {
          console.log("Error");
        }
        setLoading(false);
      } else {
        console.log("Existing user");
        var res2 = await sendOtp(
          envValues.apiUrl,
          loginType == "email" ? phoneNumber : `${countryCode}${phoneNumber}`,
          requestId,
          "send_login_otp"
        );
        console.log("OTP:", res2);
        if (res.success && res2.success) {
          redirectToOtpPage();
        } else {
          console.log("Error");
        }
        setLoading(false);
      }
    }else{
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={
          Platform.OS != "android" ? styles.container : styles.containerAndroid
        }
      >
        <WaveTop />
        <View style={styles.content}>
          <View style={styles.icon}>
            <NewmiIcon />
          </View>
          <View style={styles.form}>
            <Text style={styles.title}>Log In/Sign Up</Text>
            {loginType === "phone" ? (
              <>
                <Text style={styles.subtitle}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.prefix}>
                    <TouchableOpacity onPress={() => setShow(true)} style={{flexDirection:'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 14,
                        }}
                      >
                        {countryCode}
                      </Text>
                      <ChevronDown />
                    </TouchableOpacity>
                  </Text>
                  <TextInput
                    style={styles.inputWithPrefix}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="99999 00000"
                    keyboardType="phone-pad"
                    // maxLength={10}
                    placeholderTextColor="#A6A5A5"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputWithPrefix}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter"
                    keyboardType="email-address"
                    // maxLength={10}
                    placeholderTextColor="#A6A5A5"
                  />
                </View>
              </>
            )}

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR Log in via</Text>
              <View style={styles.line} />
            </View>
            {Platform.OS == "android" && (
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => msPromptAsync()}
                >
                  <MicrosoftIcon />
                  <Text style={styles.socialText}>Microsoft</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => promptAsync()}
                >
                  <GoogleIcon />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={switchLoginType}
              style={styles.buttonEmail}
            >
              <View>
                {loginType == "email" ? <MobileIcon /> : <EmailIcon />}
              </View>

              <Text style={styles.buttonTextEmail}>
                Login{" "}
                {loginType == "email" ? "using Mobile number" : "with Email"}
              </Text>
            </TouchableOpacity>

            <CountryPicker
              show={show}
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
              style={{
                modal: {
                  height: 300,
                  // position: 'absolute',
                  // bottom: 0,
                  width: "100%",
                  // marginTop: 'auto',
                },
                backdrop: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
              onBackdropPress={() => setShow(false)}
              enableModalAvoiding={true}
              lang="en"
              disableBackdrop={true}
            />

            <TouchableOpacity
              style={[
                styles.button,
                ((loginType === "phone" && phoneNumber.length < 1) ||
                  (loginType === "email" && !isValidEmail(phoneNumber))) &&
                  styles.buttonDisabled,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                (loginType === "phone" && phoneNumber.length < 1) ||
                (loginType === "email" && !isValidEmail(phoneNumber)) ||
                loading
              }
            >
              {loading ? (
                <Loader size="small" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    ((loginType === "phone" && phoneNumber.length < 1) ||
                      (loginType === "email" && !isValidEmail(phoneNumber))) &&
                      styles.buttonTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {!(Platform.OS === "android" && isKeyboardVisible) && (
            <View style={styles.tagLineContainer}>
              <TagLineIcon />
            </View>
          )}
        </View>
        {isFullScreenLoading && (
          <View style={styles.fullScreenLoader}>
            <Loader size="large" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  tagLineContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  fullScreenLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  containerAndroid: {
    flex: 1,
    backgroundColor: "#f9fafc",
    paddingTop: 20,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  form: {
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
    letterSpacing: 0.2,
    lineHeight: 36,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 12,
    color: "#000000",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDE2E5",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  button: {
    backgroundColor: "#BC1A23",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 35,
  },
  buttonEmail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 12,
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 24,
  },
  buttonTextEmail: {
    fontSize: 12,
    // fontWeight: "bold",
    lineHeight: 24,
    marginLeft: 7,
  },
  buttonTextDisabled: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  orText: {
    marginHorizontal: 10,
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 30,
    gap: 30,
  },
  socialButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 20,
  },
  socialText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#E8E8E8",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 10,
  },
  prefix: {
    color: "#000",
    fontSize: 16,
    marginRight: 5,
  },
  inputWithPrefix: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
  },
});

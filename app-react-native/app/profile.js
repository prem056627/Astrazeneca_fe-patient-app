// app/index.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, Platform } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";
import NewmiIcon from "../assets/svg/NewmiIcon";
import CalendarIcon from "../assets/svg/CalendarIcon";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getProfileData, submitProfile } from "../services/profile";
import Constants from "expo-constants";
import Loader from "../components/ui/Loader.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WaveTop from "../assets/svg/WaveTop.js";
import Toast from 'react-native-toast-message';


const otpValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(1, "Too short!").required("First Name is required"),
  lastName: Yup.string().min(1, "Too short!").required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  category: Yup.string().required("Please select a category"),
  dob: Yup.date().required("Date of Birth is required"),
});

const socialValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(1, "Too short!").required("First Name is required"),
  lastName: Yup.string().min(1, "Too short!").required("Last Name is required"),
  mobile: Yup.string().required("Mobile is required").min(10, "Invalid mobile number"),
  category: Yup.string().required("Please select a category"),
  dob: Yup.date().required("Date of Birth is required"),
});

export default function Profile() {
  const [social_login, setSocialLogin] = useState('no');
  async function seeSocialLogin() {
    const social_login = await AsyncStorage.getItem('social_login')
    console.log('social_login',social_login)
    setSocialLogin(social_login)
  }
  useEffect(() => {
    seeSocialLogin()
  }, [])
  const [loading, setLoading] = useState(false);
  const envValues = Constants.expoConfig?.extra
  const [date, setDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const handleSubmit = async (values) => {
    const storedEmail = await AsyncStorage.getItem('email')
    const storedMobile = await AsyncStorage.getItem('mobile')
    setLoading(true)
    console.log(values);
    // const csrftoken = await AsyncStorage.getItem('csrftoken')
    // const zangoCookie = await AsyncStorage.getItem('@zangocookie')
    const accessToken = await AsyncStorage.getItem('accessToken')
    const postData = social_login=='yes'?{...values, email: storedEmail}:{...values, mobile: storedMobile}
    const res = await submitProfile(envValues.apiUrl, postData, accessToken)
    console.log(res)
    if(res.success){
      router.replace("/loader");
      router.push({
        pathname: "/webview",
      });
    }else{
      console.log(res.response.errors)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${social_login=='yes'?(res.response.errors.mobile.__errors[0]):(res.response.errors.email_id.__errors[0])}`
      });
    }
    setLoading(false)
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={
          Platform.OS != "android" ? styles.container : styles.containerAndroid
        }>
          <WaveTop />
          <View style={styles.content}>
            <View style={styles.icon}>
              <NewmiIcon />
            </View>
            <View style={styles.form}>
              <Text style={styles.title}>Add Personal Details</Text>
            </View>
            <Formik
              initialValues={social_login=='yes'?{ firstName: "", lastName: "", mobile: "", category: "", dob: "" }:{ firstName: "", lastName: "", email: "", category: "", dob: "" }}
              validationSchema={social_login=='yes'?socialValidationSchema:otpValidationSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
                errors,
                touched,
                isValid,
                dirty,
              }) => (
                <View>
                  {/* First Name */}
                  <Text style={styles.label}>First Name*</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                    placeholder="Enter"
                    placeholderTextColor="#64758B"
                  />
                  {touched.firstName && errors.firstName && (
                    <Text style={{ color: "#BC1A23", fontSize: 9, marginTop: 1 }}>
                      {errors.firstName}
                    </Text>
                  )}

                  {/* Last Name */}
                  <Text style={styles.label}>Last Name*</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    placeholder="Enter"
                    placeholderTextColor="#64758B"
                  />
                  {touched.lastName && errors.lastName && (
                    <Text style={{ color: "#BC1A23", fontSize: 9, marginTop: 1 }}>
                      {errors.lastName}
                    </Text>
                  )}

                  {/* Radio Buttons */}
                  <Text style={styles.label}>Gender*</Text>
                  {["Male", "Female", "Prefer not to mention"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setFieldValue("category", option)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#8BB2A0",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        {values.category === option && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              backgroundColor: "#8BB2A0",
                              borderRadius: 5,
                            }}
                          />
                        )}
                      </View>
                      <Text style={styles.optionaText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                  {touched.category && errors.category && (
                    <Text style={{ color: "#BC1A23", fontSize: 9, marginTop: 1 }}>
                      {errors.category}
                    </Text>
                  )}
                  {social_login=='yes' ? (<>
                    {/* Mobile */}
                    <Text style={styles.label}>Mobile*</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("mobile")}
                      onBlur={handleBlur("mobile")}
                      value={values.mobile}
                      placeholder="Enter"
                      placeholderTextColor="#64758B"
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                    {touched.mobile && errors.mobile && (
                      <Text style={{ color: "#BC1A23", fontSize: 9, marginTop: 1 }}>
                        {errors.mobile}
                      </Text>
                    )}
                  </>):(<>
                    {/* Email */}
                    <Text style={styles.label}>Email*</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      placeholder="Enter"
                      placeholderTextColor="#64758B"
                    />
                    {touched.email && errors.email && (
                      <Text style={{ color: "#BC1A23", fontSize: 9, marginTop: 1 }}>
                        {errors.email}
                      </Text>
                    )}
                  </>)}
                  
                  {/* Date Picker */}
                  <Text style={styles.label}>Date of Birth*</Text>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    style={[
                      styles.input,
                      {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        display: "flex",
                      },
                    ]}
                  >
                    <Text
                      style={!values.dob ? styles.dobPlaceholder : styles.dobText}
                    >
                      {values.dob ? values.dob.toLocaleDateString() : "DD/MM/YYYY"}
                    </Text>
                    <CalendarIcon />
                  </TouchableOpacity>
                  {touched.dob && errors.dob && (
                    <Text style={{ color: "#BC1A23", fontSize: 9, marginTop: 1 }}>
                      {errors.dob}
                    </Text>
                  )}

                  <DateTimePickerModal
                    maximumDate={new Date()}
                    isVisible={isDatePickerVisible}
                    mode="date"
                    minimumDate={new Date(1900, 0, 1)}
                    onConfirm={(date) => {
                      setFieldValue("dob", date);
                      hideDatePicker();
                    }}
                    onCancel={hideDatePicker}
                    // display="inline"
                  />
                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      (!isValid || !dirty || loading) && styles.buttonDisabled
                    ]} 
                    onPress={handleSubmit}
                    disabled={!isValid || !dirty || loading}
                  >
                    {loading ? <Loader size="small" /> : (
                      <Text style={[
                        styles.buttonText, 
                        (!isValid || !dirty) && styles.buttonTextDisabled
                      ]}>Continue</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  containerAndroid: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
  },
  icon:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 20,
    letterSpacing: 0.2,
    lineHeight: 36,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#BC1A23',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 50
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  buttonTextDisabled: {
    color: '#ffffff', 
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 24,
  },
  webViewButton: {
    backgroundColor: "#34C759",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
    marginTop: 20,
  },
  input: {
    // borderWidth: 1,
    // borderColor: "#ddd",
    backgroundColor: "#F1F5F9",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  dobText: {
    color: "black",
    fontSize: 16,
    fontWeight: 400,
  },
  dobPlaceholder: {
    color: "#64758B",
    fontSize: 15,
    fontWeight: 400,
  },
  optionaText: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 20,
    letterSpacing: 0.2
  },
});

import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { router } from 'expo-router';
import { useNextStepStore, useReqIdStore, useStore } from '../zustand/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewmiIcon from '../assets/svg/NewmiIcon.js';
import { resendOtp, submitOtp } from '../services/auth.js';
import Constants from 'expo-constants';
import Loader from '../components/ui/Loader.js';
import Toast from 'react-native-toast-message';
import WaveTop from '../assets/svg/WaveTop.js';
import TagLineIcon from '../assets/svg/TagLineIcon.js';
import TickIcon from '../assets/svg/TickIcon.js';

export default function OTPVerification() {
  const [loading, setLoading] = useState(false);
  const envValues = Constants.expoConfig?.extra
  // const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const { phoneNumber, otp, setOtp, termsAccepted, setTermsAccepted, loginType, setLoginType, countryCode } = useStore();
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const {requestId} = useReqIdStore()
  const {nextStep, setNextStep} = useNextStepStore()
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  })

  function goBackAndClearOtp() {
    setOtp(Array(6).fill(''));
    router.back();
    setNextStep('');
    setTermsAccepted(false);
  }

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    
    if (value === '' && index >= 0) {
      newOtp[index] = '';
      setOtp(newOtp);
      
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
      return;
    }
    
    if (value.length === 1) {
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    if ((nextStep === 'signup_username') && !termsAccepted) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please accept the terms and conditions'
      });
      return;
    }
    setLoading(true)
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      console.log('Verifying OTP:', otpValue, loginType=='email'?phoneNumber:`${countryCode}${phoneNumber}`, otp);
      const {data} = await submitOtp(envValues.apiUrl, loginType=='email'?phoneNumber:`${countryCode}${phoneNumber}`, requestId, otpValue, nextStep==='signup_username'?'verify_signup_otp':'verify_login_otp')
      // console.log(data,c)
      if(data.success){
        setLoading(false)

        // await AsyncStorage.setItem('@zangocookie',c.zangocookie );
        // await AsyncStorage.setItem('csrftoken',c.csrftoken );
        await AsyncStorage.setItem('accessToken', data.token );

        if(data.new_user_flag!=undefined){
          await AsyncStorage.setItem('new_user_flag',data.new_user_flag);
        }else{
          await AsyncStorage.setItem('new_user_flag','yes');
        }
        router.replace("/loader");
        router.push({
          pathname: (nextStep==='signup_username' || data.new_user_flag==='yes')?'/profile':'/webview',
        });
        // Toast.show({
        //   type: 'success',
        //   text1: 'Success',
        //   text2: `User Logged In Successfully`
        // });
      }else{
        console.log('Error')
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${data.message}`
        });
        setLoading(false)
      }
    }
  };

  const handleResendOtp = async () => {
    const res = await resendOtp(envValues.apiUrl, loginType=='email'?phoneNumber:`${countryCode}${phoneNumber}`, requestId, nextStep==='signup_username'?'resend_signup_otp':'resend_login_otp')
    console.log(res);
    if(res.success){
      setCountdown(30);
      setCanResend(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `OTP sent again`
      });
    }else{
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${res.message}`
      });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={Platform.OS!=='android'?styles.container:styles.containerAndroid}>
      <WaveTop />
      <View style={styles.content}>
      <View style={[styles.topHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
          <NewmiIcon />
        </View>
        <View style={styles.form}>
            <Text style={styles.title}>Log In/Sign Up</Text>
            <Text style={styles.verifyText}>Verify your {loginType=='email'?'email':'mobile number'} </Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Enter the OTP sent to</Text>
              <Text style={styles.phone}>{loginType=='email'?null:countryCode} {phoneNumber}</Text>
              <TouchableOpacity onPress={goBackAndClearOtp}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
            </View>
        </View>
      

        <View style={styles.otpContainer}>
  {otp.map((digit, index) => (
    <TextInput
      key={index}
      ref={ref => inputRefs.current[index] = ref}
      style={styles.otpInput}
      value={digit}
      onChangeText={(value) => handleOtpChange(value, index)}
      keyboardType="numeric"
      maxLength={1}
    />
  ))}
</View>
        {/* After the OTP input container and before the verify button */}
        {canResend ? (
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendButton}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendText}>Resend OTP in {countdown}s</Text>
        )}

        {(nextStep === 'signup_username') && (
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted && <Text style={styles.checkmark}>
             <TickIcon />

                </Text>}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text 
                style={styles.termsLink}
                onPress={() => router.push('/privacy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        )}

          
        <TouchableOpacity 
          style={[
            styles.button, 
            (!otp.every(digit => digit) || (nextStep === 'signup_username' && !termsAccepted)) && styles.buttonDisabled, 
            loading && styles.buttonDisabled
          ]} 
          onPress={handleVerify}
          disabled={!otp.every(digit => digit) || loading || (nextStep === 'signup_username' && !termsAccepted)}
        >
          {
            loading ? (
              <Loader size='small' />
            ) : (
              <Text style={[
                styles.buttonText, 
                (!otp.every(digit => digit) || (nextStep === 'signup_username' && !termsAccepted)) && styles.buttonTextDisabled
              ]}>
                Verify and Continue
              </Text>
            )
          }
        </TouchableOpacity>
        {!(Platform.OS === 'android' && isKeyboardVisible) && (
            <View style={styles.tagLineContainer}>
              <TagLineIcon />
            </View>
          )}
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40
  },
  containerAndroid: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
  },
  form:{
    paddingTop: 40
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 30,
    letterSpacing: 0.2,
    lineHeight: 36,
    marginTop: 20
  },
  verifyText:{
    fontSize: 14,
    color: '#393C3C',
    lineHeight: 20,
    fontWeight: 500
  },
  subtitle:{
    fontSize: 14,
    color: '#898989',
    lineHeight: 20,
  },
  subtitleContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 30,
    marginTop: 10
  },
  phone: {
    fontSize: 14,
    color: '#545454',
    fontWeight: 600,
    lineHeight: 20,
  },
  edit: {
    fontSize: 14,
    color: '#88A299',
    marginLeft: 6,
    fontWeight: 600,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 30,
  },
  otpInput: {
    width: 50, 
    height: 65, 
    // borderWidth: 1,
    // borderColor: '#CBD5E1', 
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: "#F1F5F9",
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
  resendText: {
    fontSize: 12,
    color: '#717171',
    lineHeight: 20,
  },
  resendButton: {
    fontSize: 12,
    color: '#BC1A23',
    lineHeight: 20,
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#BC1A23',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#BC1A23',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  checkboxChecked: {
    backgroundColor: '#BC1A23',
  },
  termsText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    height: '100%', 
    paddingTop: 30,
  },
  modalContentIos: {
    backgroundColor: '#ffffff',
    padding: 20,
    height: '75%', 
    paddingTop: 30,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#334155',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#BC1A23',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#334155',
    marginBottom: 20,
  },
  termsLink:{
    color: '#BC1A23',
    fontWeight: 600,
    lineHeight: 20,
  }
});
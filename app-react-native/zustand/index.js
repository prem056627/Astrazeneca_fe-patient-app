import {create} from 'zustand';

export const useStore = create((set) => ({
    phoneNumber: '',
    setPhoneNumber: (value) => set({ phoneNumber: value }),
    otp: ['', '', '', '', '', ''],
    setOtp: (value) => set({ otp: value }),
    termsAccepted : false,
    setTermsAccepted: (value) => set({ termsAccepted: value }),
    isGoBackAllowed: false,
    setIsGoBackAllowed: (value) => set({ isGoBackAllowed: value }),
    loginType:'phone',
    setLoginType: (value) => set({ loginType: value }),

    countryCode: '+91',
    setCountryCode: (value) => set({ countryCode: value }),
}))

export const useReqIdStore = create((set) => ({
    requestId: '',
    setRequestId: (value) => set({ requestId: value }),
}))

export const useNextStepStore = create((set) => ({
    nextStep: '',
    setNextStep: (value) => set({ nextStep: value }),
}))

export const useUserInfoStore = create((set) => ({
    userInfo: null,
    setUserInfo: (value) => set({ userInfo: value }),
}))
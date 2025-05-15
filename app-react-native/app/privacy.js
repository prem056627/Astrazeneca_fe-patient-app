import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Keyboard, TouchableWithoutFeedback, Modal, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import NewmiIcon from '../assets/svg/NewmiIcon.js';
import WaveTop from '../assets/svg/WaveTop.js';

export default function OTPVerification() {
  return (
    <View style={Platform.OS!=='android'?styles.container:styles.containerAndroid}>
      <WaveTop />
      <View style={styles.content}>
      <View style={[styles.topHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
          <NewmiIcon />
        </View>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.privacyContent}>
          <Text style={styles.privacyText}>
Use of Newmi App/Website{"\n\n"}
Newmi allows you to conduct an online consultation with your Doctor or HCP (Healthcare Provider). As such, on the platform, an HCP may provide virtual consults, diagnosis, and prescriptions, as appropriate. You, the user, consent to Newmi transferring your consult queries to the HCP(s) selected and determined by you for the respective consult. You understand and agree that the information during these interactions is subject to our Privacy Policy.{"\n\n"}
Newmi, however, is not a substitute for a primary care doctor, or in-person health care interactions. You agree not to use Newmi as a substitute for a primary care doctor or in-person doctor visits. Diagnosis and prescriptions provided via the Newmi apps/website are at the sole discretion of the HCPs using the platform. You understand and agree that any issues, questions, or concerns relating to these consults must be taken up directly with your HCPs.{"\n\n"}
Newmi is a platform for you to connect with your doctor and discuss topics related to your health and well-being. Newmi do not take responsibility for the any advice given during the interactions on our app/website, and the agreement with and implementation of that advice is solely at the discretion of the Users.{"\n\n"}
NEVER USE Newmi IN A POTENTIAL OR ACTUAL MEDICAL EMERGENCY{"\n\n"}
DOCTOR-PATIENT RELATIONSHIP{"\n\n"}
While our platform supports Doctor-Patient relationships, we do not create nor are responsible for doctor-patient relationships. During your use of our Apps and website services, you may come across and/or receive content - text, data, graphics, images, information, suggestions, guidance, and other material – including information provided in response to your particular query by your HCP(s). However, the provision or exchange of such information does not create a licensed doctor-patient relationship, between Newmi and you.{"\n\n"}
HEALTH CARE PROVIDERS ON Newmi{"\n\n"}
While we take steps to verify the medical registration of doctors and HCPs using our platform to provide their services, we make no guarantees, representations, or warranties, whether expressed or implied, with respect to professional qualifications, quality of work, expertise or other information provided by the HCPs on their profiles. We do not recommend or endorse any specific individual and/or HCP(s) that may be mentioned on the website or Apps. In no event we will be liable to the user or anyone else for any decision made or action taken by the user or anyone else on basis of the information provided on the website and/or Apps. No medical, legal or any other decision shall be based solely upon the information provided through the website or Apps.{"\n\n"}
MEDICAL ADVICE{"\n\n"}
The information and communication through the website or Apps is not intended to be a substitute for professional medical advice, diagnosis or treatment. Always seek the advice of a physician or other qualified Health Care Provider with any questions the user may have regarding a medical condition. Newmi does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on the website or Apps. The website or Apps may contain health- or medical-related materials which the user may find offensive, then they may not want to use our website or Apps.{"\n\n"}
In no event will Newmi be liable to the user or anyone else for any decision made or action taken by the user or anyone else on basis of the information provided on the website and/or Apps. No medical, legal or any other decision shall be based solely upon the information provided through this website or Apps.{"\n\n"}
DRUGS AND MEDICINES POLICY{"\n\n"}
The information about drugs, including generic drugs, health supplements, contained in the Apps and website is general in nature and is intended for use as an informational aid. It does not cover all possible uses, actions, precautions, side effects, or interactions of these medicines, nor is the information intended as medical advice for individual problems or for making an evaluation as to the risks & benefits of taking a particular drug. All such actions should be taken only under the advice of a qualified medical professional.{"\n\n"}
PAYMENTS & PURCHASES{"\n\n"}
You may decide to buy packages, products and services through our website and/or Apps. Payment for such purchases is your responsibility and can be executed through different means - including (but not limited to) credit and debit cards, gift coupons, third-party payment services and gateways (incl. CCAvenue, Paypal) and in some cases cash.{"\n\n"}
You are responsible for providing valid payment information (for any of the payment means including but not limited to those mentioned above) at the time you purchase any plans, products and services. You represent and warrant that you are an authorized user of such payment means, and you agree to pay all charges resulting from your transaction at the prices then in effect. You agree that Newmi may pass your payment information (e.g. credit card) and related personally identifiable information to its designated service provider(s) for their use in charging you for appropriate services utilized. The ultimate responsibility of payment lies with the purchaser of the packages, products and/or services.{"\n\n"}
The charges for any plans, products or services may attract taxes, or any other charges as levied by competent authorities in a given region. These additional charges will be borne by the purchaser and will be paid at the time of purchase. Newmi reserves the right to modify or terminate membership plans, change prices, or institute new charges for any product or service at any time, with at least thirty (30) days' notice where applicable to existing customers.{"\n\n"}
COMMUNICATIONS TO THE USER{"\n\n"}
When you register on Newmi website and/or Apps, we may communicate with you, including by sending information, correspondence, and notices to you. These communications may be sent via email, SMS (text message), push notification, or otherwise using contact information associated with your account, including information provided when you register or update information in your Account profile. These communications will not contain Personal Health Information.{"\n\n"}
When the user signs up for our email newsletters they will receive additional promotional emails from us or our Sponsors, Partners and Associates. In order to subscribe to Newmi newsletters via email, we need the user’s contact information, like name and email address. You can opt out of promotional communications and control your communications preferences through your Account settings. If you experience difficulties with our automated unsubscribe service, please contact us. Newmi will unsubscribe you from that newsletter.{"\n\n"}
YOUR ACCOUNT SECURITY AND PRIVACY{"\n\n"}
Accurate and complete registration information is required to use Newmi App and website. You, the user, are responsible for maintaining the confidentiality of your account access information and password. You are responsible for the security of your passwords and for any use of your account. You must immediately notify us of any unauthorized use of your password or account. You are not permitted to allow any other person or entity to use your identity for using any of Newmi website or App.{"\n\n"}
To send us an email, use the "Contact Us"/Support/feedback links located on our website and Apps. You grant Newmi and all other persons or entities involved in the operation of the website and Apps the right to transmit, monitor, retrieve, store, and use your information in connection with the operation of the website and Apps. Newmi cannot and does not assume any responsibility or liability for any information you submit, or your or third parties' use or misuse of information transmitted or received using Newmi.{"\n\n"}
INTERNATIONAL USERS CONSENT TO TERMS AND POLICIES{"\n\n"}
We make no representation that all products, Content or Services described on or available through the Apps/website, are appropriate or available for use in locations outside India. Registered Users and Visitors access our Content and Services on their own initiative and are responsible for compliance with local laws. We make no claim that Content or Services are appropriate or may be downloaded outside of India. Personal information ("Information") that is submitted to Newmi Apps and website will be collected, processed, stored, disclosed and disposed of in accordance with applicable law and our Privacy Policy. If you are a non-Indian member, you acknowledge and agree that Newmi may collect and use your Information and disclose it to other entities outside your resident jurisdiction. In addition, such Information may be stored on servers located outside your resident jurisdiction. Indian law may not provide the degree of protection for Information that is available in other countries. By providing us with your Information, you acknowledge that you consent to the transfer of such Information outside your resident jurisdiction as detailed in these T&C and Privacy Policy. If you do not consent to such transfer, you may not use our Apps or website. The product information provided on Newmi is presently intended only for residents of India, and may have different product labeling and disclosure requirements in different countries.{"\n\n"}
ACKNOWLEDGEMENTS{"\n\n"}
We have attempted to provide acknowledgement of sources as references for text, but there is likelihood that several acknowledgements are not mentioned. The Company is certainly willing to correct omissions of citations & encourage our readers to email us with further information regarding the sources.{"\n\n"}
If the user believes any materials accessible on or from the website/Apps infringe their copyright, they may request removal of those materials (or access thereto) from the website/Apps by contacting Newmi and providing the following information:{"\n"}
- Identification of the copyrighted work that the user believes to be infringed. Please describe the work, and where possible include a copy or the location (e.g., URL) of an authorized version of the work.{"\n"}
- Identification of the material that the user believes to be infringing and its location. Please describe the material and provide us with its URL or any other pertinent information that will allow us to locate the material.{"\n"}
- User’s name, address, telephone number and (if available) e-mail address.{"\n"}
- A statement that the user has a good faith belief that the complaint of use of the materials is not authorized by the copyright owner, its agent, or the law.{"\n"}
- A statement that the information that the user has supplied is accurate, and indicating that "under penalty of perjury," the user is the copyright owner or is authorized to act on the copyright owner's behalf.{"\n"}
- A signature or the electronic equivalent from the copyright holder or authorized representative.{"\n\n"}
In an effort to protect the rights of copyright owners, Newmi maintains a policy for the termination, in appropriate circumstances, of subscribers and account holders of the website/Apps who are repeat infringers.{"\n\n"}
COPYRIGHTS{"\n\n"}
Information on the Newmi website and Apps is for personal use & may not be sold or redistributed. To reprint or electronically reproduce any document or graphic in whole or in part for any reason is expressly prohibited, unless prior written consent is obtained from Newmi. The Content is protected by copyright under both Indian and foreign laws. Title to the Content remains with Newmi or its licensors. Any use of the Content not expressly permitted by these Terms & Conditions is a breach of these T&C and may violate copyright, trademark, and other laws. Content and features are subject to change or terminate without notice in the editorial discretion of Newmi. All rights not expressly granted herein are reserved to Newmi and its licensors.{"\n\n"}
All content on the Newmi website and Apps including designs, text, graphics, pictures, information, applications, software, music, sound and other files, and their selection and arrangement (the "Site Content") are the sole proprietary property of Newmi unless otherwise indicated. You do not have the right to modify, copy, perform, distribute, frame, reproduce, republish, upload, download, scrape, display, post, transmit, or sell in any form or by any means, in whole or in part, without Newmi’s prior written consent as they are protected under applicable copyright laws and treaty provisions (including but not limited to applicable intellectual property laws).{"\n\n"}
TRADEMARKS{"\n\n"}
We also own the names we use for our products and services on Newmi, and these names are protected by trademark laws in India and internationally. Any use of our trademarks require our prior written approval.{"\n\n"}
USER PROFILE AND PRIVACY POLICY{"\n\n"}
Our website's and Apps' registration and query requires users to give us personal information such as their name, email and demographic information such as their address and telephone number. The user's personal information is used to contact the visitor as and when necessary. This personal information also allows us to inform the users about updates to the service and further additions on Newmi website and Apps. We collect personal information from user when they register on Newmi’s website or Apps, or when they submit a query to us. We maintain this information as private to the best of our ability.{"\n\n"}
USER CONDUCT{"\n\n"}
User shall use the website and Apps for lawful purposes only. User shall not post or transmit through Newmi website or Apps, any material which violates or infringes in any way upon the rights of others, which is unlawful, threatening, abusive, defamatory, invasive of privacy or publicity rights, vulgar, obscene, profane or otherwise objectionable. User shall not use Newmi website or Apps to advertise or perform any commercial solicitation. The user also understands that the company cannot & does not guarantee or warrant that files available for downloading through the service will be free of infection or viruses, worms or other code that manifest contaminating or destructive properties. You may not access the website or Apps for any benchmarking or competitive purposes such as monitoring its availability, performance or functionality. You may not resell, redistribute, or put to any commercial use, any content or information from this app or site.{"\n\n"}
USER LICENSE{"\n\n"}
Provided that you are eligible for use of the website and/or Apps, Newmi hereby grants you a limited license to access and use the website and/or Apps and the Site Content solely for your personal, non-commercial use. You may not republish Site Content on any internet, intranet or extranet site or incorporate the information in any other database or compilation, and any other use of the Site Content is strictly prohibited. Unauthorized use may violate applicable laws including copyright and trademark laws and applicable communications regulations and statutes. Unless explicitly stated here, nothing in these Terms & Conditions shall be construed as conferring any license to intellectual property rights. This license is revocable at any time without notice and with or without cause.{"\n\n"}
LINKING TO US{"\n\n"}
Usually, we don't mind if you have a simple link from your website to ours. However, you must first ask our permission if you intend to frame our site or incorporate pieces of it into a different site or product in a way that is not clear to our users. You are not allowed to link to us if you engage in illegal, obscene, or offensive content, or if the link in any way has a negative impact on our reputation.{"\n\n"}
LIABILITY{"\n\n"}
The use of the Newmi website and Apps and the Content is at your own risk. The providers of this website and Apps disclaim any & all liabilities arising directly or indirectly to anybody as a result of use of this website and/or Apps.{"\n\n"}
INDEMNITY{"\n\n"}
You agree to defend, indemnify, and hold Newmi, its officers, directors, employees, agents, licensors, and suppliers, harmless from and against any claims, actions or demands, liabilities and settlements including without limitation, reasonable legal and accounting fees, resulting from, or alleged to result from, your violation of these Terms and Conditions.{"\n\n"}
In no event shall Newmi and its parent organizations, subsidiaries and affiliates, and each of their directors, officers, agents, consultants, contractors, partners, employees, suppliers and sponsors be liable to you or any third person for any indirect, consequential, punitive, special, incidental or exemplary damages of any type or kind, including loss of data, revenue, profits, or other economic advantage, arising out of or in any way connected with the website and/or apps, including for any content obtained through the service, any error, omission, interruption, deletion, inaccuracy, defect, delay in operation or transmission, communications line failure, technical malfunction or other problems of any telephone network or service, computer systems, servers or providers, computer equipment, software, failure or email or players on account of technical problems or traffic congestion on the internet or at the app or website or combination thereof, even if Newmi has been previously advised of such damages or has been previously advised of the possibility of such damages. Under no circumstances will Newmi be responsible for any loss or damage, including any loss or damage to any user content or personal injury or death, resulting from anyone's use of the Apps, website or any user content posted on or through the Apps or website or transmitted to users, or any interaction between users of the app or website, whether online or offline even if Newmi has been previously advised of such damages or has been previously advised of the possibility of such damages.{"\n\n"}
Newmi does not represent or warrant that software, content or materials on the Apps or website are accurate, complete, reliable, current or error-free or that the Apps, website or its servers, or any platform applications are free of viruses or other harmful components. The Apps, website and all content are provided to you strictly on an "as is" basis. Therefore, you should exercise caution in the use and downloading of any such software, content or materials and use industry-recognized software to detect and disinfect viruses. Without limiting the foregoing, you understand and agree that you download or otherwise obtain content, material, data or software from or through the Apps or website at your own discretion and risk and that you will be solely responsible for your use thereof and any injury or damage to your or to any person's computer, or other hardware or software, related to or resulting from using or downloading materials in connection with the app or website, theft or destruction or unauthorized access to, or alteration of the app or website, loss of data or other harm of any kind that may result. The app or website may be temporarily unavailable from time to time for maintenance or other reasons.{"\n\n"}
INVALIDITY{"\n\n"}
If any one or more of the provisions contained in the T&C Agreement should be determined to be invalid, illegal or unenforceable in any respect, the validity, legality and enforceability of the remaining provisions of the Agreement shall not in any way be affected or impaired thereby.{"\n\n"}
GOVERNING LAW{"\n\n"}
This Agreement shall in all respects be governed by and be construed in accordance with the laws of the Gurgaon, Haryana and applicable laws of India therein.
</Text>
          </ScrollView>
        </View>
    </View>
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
    backgroundColor: '#f9fafc',
    paddingTop: 40
  },
  containerAndroid: {
    flex: 1,
    backgroundColor: "#f9fafc",
    paddingTop: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    // justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    paddingVertical: 20,
    position: 'relative',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#334155',
    fontWeight: '500',
  },
  privacyContent: {         
    paddingTop: 20,
  },                                                                                                                        
  privacyText: {  
    fontSize: 14,  
    lineHeight: 24,  
    color: '#334155',
  }
});
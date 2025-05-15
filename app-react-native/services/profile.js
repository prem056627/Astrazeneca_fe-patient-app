import { formatDate } from "../utils";
const genderMap = {
  "Male":"male",
  "Female":"female",
  "Prefer not to mention":"others"
}
export async function submitProfile(baseUrl,values, accessToken){
  console.log(values)

  const today = formatDate(new Date());
  const formData = new FormData();
  formData.append('name', `${values.firstName} ${values.lastName}`);
  formData.append('email_id', values.email);
  formData.append('gender', genderMap[values.category]);
  formData.append('dob', formatDate(values.dob));
  formData.append('mobile', values.mobile);
  // formData.append('csrfmiddlewaretoken', csrfToken);
  // formData.append('registration_date', today);
  // formData.append('patient_type', 'N');
  // formData.append('clinic', 24); 


  const res = await fetch(`${baseUrl}/patient/patients/?form_type=create_form`,{
      method: "POST",
      headers: {
        // "X-Csrftoken": csrfToken,
        // "Cookie": `cookie_consent=decline; csrftoken=${csrfToken}; zangocookie=${zangoCookie}`,
        "Authorization": `Bearer ${accessToken}`,
        "Referer": `${baseUrl}/patient/patients/`
      },
      body: formData
    })
    console.log(res)
    const data = await res.json();
    console.log(data)
    return data;
}

export async function getProfileData(baseUrl){
  console.log('fetching profile data...')
  const res = await fetch(`${baseUrl}/patient/patient-api/`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    console.log(data)
    return data;
}
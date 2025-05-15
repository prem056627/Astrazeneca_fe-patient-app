// const commonAuthUrl= '/loginSignup/api/Patient/'
const commonAuthUrl = '/common/loginapi/Patient/'
export async function initializeApi (baseUrl){
    console.log('initializing api', `${baseUrl}${commonAuthUrl}`)
    const res = await fetch(`${baseUrl}${commonAuthUrl}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json();
      console.log(data)
      return data;
}

export async function submitPhoneNumber(baseUrl, phoneNumber, requestId){
  console.log('submitting phone number', `${baseUrl}${commonAuthUrl}`, {
    username: phoneNumber,
    step:"verify_username",
    request_id: requestId
  })
    const res = await fetch(`${baseUrl}${commonAuthUrl}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": `${baseUrl}${commonAuthUrl}`
        },
        body: JSON.stringify({
          username: phoneNumber,
          step:"verify_username",
          request_id:requestId
        })
      })
      const data = await res.json();
      return data;
}


export async function signupUsername(baseUrl, phoneNumber, requestId){
    const res = await fetch(`${baseUrl}${commonAuthUrl}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: phoneNumber,
          step:"signup_username",
          request_id:requestId
        })
      })
      const data = await res.json();
      return data;
}


export async function submitConsent(baseUrl, phoneNumber, requestId){
  console.log('submitting consent', {
    username: phoneNumber,
    step:"submit_consent",
    request_id:requestId,
    consent_text:""
  })
    const res = await fetch(`${baseUrl}${commonAuthUrl}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: phoneNumber,
          step:"submit_consent",
          request_id:requestId,
          consent_text:""
        })
      })
      const data = await res.json();
      return data;
}

export async function sendOtp(baseUrl, phoneNumber, requestId, step){
  console.log('sending otp', `${baseUrl}${commonAuthUrl}`)
    const res = await fetch(`${baseUrl}${commonAuthUrl}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: phoneNumber,
            step: step,
            request_id:requestId,
            consent_text:""
          })
      })
      const data = await res.json();
      return data;
}
export async function submitOtp(baseUrl, phoneNumber, requestId, otp, step) {
  const numOtp = Number(otp)
  console.log(numOtp, typeof(numOtp), step, `${baseUrl}${commonAuthUrl}`)
  const res = await fetch(`${baseUrl}${commonAuthUrl}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          username: phoneNumber,
          step: step,
          request_id: requestId,
          otp: numOtp
      }),
      credentials: 'include',
  });
  
  // const setCookieHeader = res.headers.get('set-cookie');
  
  // if (setCookieHeader) {
  //     const cookies = setCookieHeader.split(',').map(cookie => cookie.split(';')[0].trim());
  //     var c = {}
  //     cookies.forEach(cookie => {
  //         if (cookie.startsWith('zangocookie=')) {
  //             c['zangocookie'] = cookie.split('=')[1];
  //         } else if (cookie.startsWith('csrftoken=')) {
  //             c['csrftoken'] = cookie.split('=')[1];
  //         }
  //     });
  //     console.log(c);
  // } else {
  //     console.log('No cookies found in the response');
  // }
  const data = await res.json();

  console.log('new response', data)
  return {data};
}

export async function resendOtp(baseUrl, phoneNumber, requestId, step){
    const res = await fetch(`${baseUrl}${commonAuthUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: phoneNumber,
            step:step,
            request_id:requestId,
          })
      })
      const data = await res.json();
      return data;
}


export async function googleLogin(baseUrl, token){
    const res = await fetch(`${baseUrl}${commonAuthUrl}?token=${token}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })
      const data = await res.json();
      console.log('token data',data)
      return data;
}


export async function postOIDC(baseUrl, requestId, token, provider){
  console.log('post oidc',requestId, token,`${baseUrl}${commonAuthUrl}`)
  const res = await fetch(`${baseUrl}${commonAuthUrl}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          step:"initiate_oidc",
          request_id:requestId,
          token:token,
          device:'mobile',
          provider_name: provider,
        })
    })

    // const setCookieHeader = res.headers.get('set-cookie');
  
  // if (setCookieHeader) {
  //     const cookies = setCookieHeader.split(',').map(cookie => cookie.split(';')[0].trim());
  //     var c = {}
  //     cookies.forEach(cookie => {
  //         if (cookie.startsWith('zangocookie=')) {
  //             c['zangocookie'] = cookie.split('=')[1];
  //         } else if (cookie.startsWith('csrftoken=')) {
  //             c['csrftoken'] = cookie.split('=')[1];
  //         }
  //     });
  //     console.log(c);
  // } else {
  //     console.log('No cookies found in the response');
  // }
  const data = await res.json();
  return {data};
}


export async function hitLogout(baseUrl){
  console.log('hitting logout', `${baseUrl}/logout`)
  const res = await fetch(`${baseUrl}/logout`,{
      method: "GET",
    })
    console.log('token data',res)
    return res;
}
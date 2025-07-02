import React, { useState } from 'react';
import FacebookLogin from '@greatsumini/react-facebook-login';

const LoginWithFacebook = () => {
  const [fbResponse, setFbResponse] = useState(null);

  const handleFacebookSuccess = (response) => {
    console.log('Facebook login success:', response);

    // Gửi AccessToken tới Backend
    fetch('http://localhost:5024/api/auth/facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ AccessToken: response.accessToken }),
    })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => { throw new Error(`HTTP error! status: ${res.status}, ${text}`); });
      }
      return res.json();
    })
    .then((data) => {
      console.log('Server response:', data);
      setFbResponse(data);
    })
    .catch((err) => {
      console.error('Error:', err.message);
      alert('An error occurred: ' + err.message);
    });    
  };

  return (
    <div>
      <FacebookLogin
        appId="1485098685691556" // Thay bằng App ID của bạn
        autoLoad={false}
        onSuccess={handleFacebookSuccess}
        onFail={(error) => console.error('Facebook login failed:', error)}
        onProfileSuccess={(profile) => console.log('Profile fetched successfully:', profile)}
      />
      {fbResponse && (
        <div>
          <h2>Login Successful</h2>
          <p>Token: {fbResponse.Token}</p>
        </div>
      )}
    </div>
  );
};

export default LoginWithFacebook;





// import React, { useState } from 'react';
// import FacebookLogin from '@greatsumini/react-facebook-login';

// const LoginWithFacebook = () => {
//   // Hàm xử lý khi người dùng đăng nhập thành công
//   const [fb, setFb] = useState("");
//   const [fbName, setFbName] = useState("");

//   return (
//     <div>
//       <div>
//       <FacebookLogin
//         appId="1485098685691556" // Thay YOUR_FACEBOOK_APP_ID bằng ID ứng dụng Facebook của bạn
//         autoLoad={false}
//         onSuccess={(response) => {
//           setFb(response);
//           console.log(response);
//         }}
//         onFail={(error) =>{
//           setFb(null);
//         }}
//         onProfileSuccess={(response) => {
//           setFbName(response.name);
//           console.log(response);
//         }}
//       />
//       </div>
//       <p>Facebook Name: {fbName}</p>
//       <p>Facebook Token: {fb?.accessToken}</p>
//     </div>
//   );
// };

// export default LoginWithFacebook;

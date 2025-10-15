import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("User Info:", decoded);

    // Simpan data user ke localStorage
    localStorage.setItem('google_token', credentialResponse.credential);
    localStorage.setItem('user_name', decoded.name);
    localStorage.setItem('user_email', decoded.email);
    localStorage.setItem('user_picture', decoded.picture);

    navigate('/dashboard');
  };

  return (
    <GoogleOAuthProvider clientId="525708452903-dcktg2s01kmqqofgf49uplo07k8stvdg.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Team Task Tracker</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Login gagal')}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

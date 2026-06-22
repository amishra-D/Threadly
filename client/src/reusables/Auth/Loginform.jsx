import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleLogin } from '../../features/auth/authSlice';
import { Input } from '../../Components/ui/input';
import { Button } from '../../Components/ui/button';
import { Label } from '../../Components/ui/label';
import { toast } from "sonner";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Loginform = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Show helpful toast when arriving after OTP verification
  useEffect(() => {
    if (location.state?.verified) {
      toast.success('Email verified! Please log in to continue.');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { email: location.state?.email || '' }
  });

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success(result.message || "Login successful!");
      // New users have no bio — send them to profile setup
      const isNewUser = !result.user?.bio;
      navigate(isNewUser ? '/setup-profile' : '/home');
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      toast.success(result.message || "Google login successful!");
      const isNewUser = !result.user?.bio;
      navigate(isNewUser ? '/setup-profile' : '/home');
    } catch (err) {
      toast.error(err || "Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was cancelled or failed.");
  };

  return (
    <div className="h-fit flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 rounded-xl shadow-xl w-full max-w-sm space-y-5"
      >
        {/* Google Sign-In */}
        <div className="flex flex-col items-center gap-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="filled_black"
            shape="pill"
            size="large"
            width="100%"
            text="continue_with"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-xs text-gray-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <div>
          <Label htmlFor="email" className="mb-4 text-sm font-medium">Email</Label>
          <Input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="anonymous@gmail.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="mb-5 text-sm font-medium">Password</Label>
          <Input
            type="password"
            {...register('password', { required: 'Password is required' })}
            placeholder="dgyues#sv"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ddff00] font-semibold hover:bg-[#ddff00c5] transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Loginform;


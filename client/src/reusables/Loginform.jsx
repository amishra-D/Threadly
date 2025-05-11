import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { Input } from '../Components/ui/input';
import { Button } from '../Components/ui/button';
import { Label } from '../Components/ui/label';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';

const Loginform = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success(result.message || "Login successfull!");
      navigate('/home');
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  };
  

  return (
    <div className="h-fit flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 rounded-xl shadow-xl w-full max-w-sm space-y-5"
      >

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
Login        </Button>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Loginform;

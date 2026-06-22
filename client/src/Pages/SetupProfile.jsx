import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/user/usersSlice';
import { Input } from '../Components/ui/input';
import { Button } from '../Components/ui/button';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { toast } from 'sonner';

const banners = [
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449178/banner4_oamidu.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449178/banner5_hldlga.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/banner2_awnhdj.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449178/banner3_jxeakw.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/banner1_fw78ir.png",
];

const avatars = [
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Maria",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Caleb",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Sophia",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=James",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Olivia",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Ethan",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Isabella",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Jackson",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Emily",
  "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas",
];

const STEPS = ['banner', 'avatar', 'details'];

const SetupProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.user);

  // email passed from OTP page so we can auto-login after setup
  const email = location.state?.email;

  const [step, setStep] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(banners[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFinish = async (data) => {
    const profileData = {
      username: data.username,
      bio: data.bio || '',
      location: data.location || '',
      url: selectedAvatar,
      banner: selectedBanner,
    };
    try {
      await dispatch(updateUser(profileData)).unwrap();
      toast.success('Profile set up! Welcome to Threadly 🎉');
      navigate('/home');
    } catch (err) {
      toast.error('Could not save profile. You can update it later.');
      navigate('/home');
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };


  const stepTitles = ['Pick your banner', 'Pick your avatar', 'Tell us about you'];
  const stepSubtitles = [
    'Choose a cover image for your profile',
    'Choose an avatar that represents you',
    'Add some details to personalise your profile',
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-[#ddff00] tracking-wide mb-1">THREADLY</h1>
        <p className="text-gray-400 text-sm">Let's set up your profile — takes 30 seconds</p>
      </div>

      {/* Step indicator */}
      <div className="w-full max-w-2xl flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-[#ddff00]' : 'bg-gray-700'
              }`}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Step title */}
      <div className="w-full max-w-2xl mb-6">
        <h2 className="text-2xl font-bold">{stepTitles[step]}</h2>
        <p className="text-gray-400 text-sm mt-1">{stepSubtitles[step]}</p>
      </div>

      {/* STEP 0 – Banner */}
      {step === 0 && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {banners.map((banner, i) => (
              <div
                key={i}
                onClick={() => setSelectedBanner(banner)}
                className={`rounded-xl overflow-hidden cursor-pointer border-4 transition-all duration-200 ${
                  selectedBanner === banner
                    ? 'border-[#ddff00] ring-2 ring-[#ddff00] ring-offset-2 ring-offset-black'
                    : 'border-gray-700 hover:border-gray-400'
                }`}
              >
                <img src={banner} alt={`banner-${i}`} className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={handleSkip}>
              Skip setup
            </Button>
            <Button
              className="bg-[#ddff00] text-black font-semibold hover:bg-[#c8e600] px-8"
              onClick={() => setStep(1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 1 – Avatar */}
      {step === 1 && (
        <div className="w-full max-w-2xl space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={selectedBanner}
                alt="banner preview"
                className="w-64 h-20 object-cover rounded-xl opacity-70"
              />
              <img
                src={selectedAvatar}
                alt="avatar preview"
                className="w-16 h-16 rounded-full border-4 border-black absolute -bottom-6 left-4 bg-gray-800"
              />
            </div>
          </div>

          {/* Avatar grid */}
          <div className="grid grid-cols-5 gap-3 mt-8">
            {avatars.map((avatar, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={`rounded-full p-1 transition-all duration-200 ${
                  selectedAvatar === avatar
                    ? 'ring-2 ring-[#ddff00] ring-offset-2 ring-offset-black'
                    : 'ring-1 ring-gray-700 hover:ring-gray-400'
                }`}
              >
                <img src={avatar} alt={`avatar-${i}`} className="w-12 h-12 rounded-full" />
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setStep(0)}>
              ← Back
            </Button>
            <Button
              className="bg-[#ddff00] text-black font-semibold hover:bg-[#c8e600] px-8"
              onClick={() => setStep(2)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2 – Details */}
      {step === 2 && (
        <form onSubmit={handleSubmit(handleFinish)} className="w-full max-w-2xl space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-300">
              Username <span className="text-red-400">*</span>
            </Label>
            <Input
              id="username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
              })}
              placeholder="your_username"
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#ddff00]"
            />
            {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              {...register('bio', {
                maxLength: { value: 200, message: 'Max 200 characters' },
              })}
              placeholder="Tell the world something about you..."
              rows={3}
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#ddff00]"
            />
            {errors.bio && <p className="text-red-400 text-sm">{errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-300">
              Location
            </Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="City, Country"
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#ddff00]"
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => setStep(1)}
            >
              ← Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#ddff00] text-black font-bold hover:bg-[#c8e600] px-8"
            >
              {loading ? 'Saving...' : 'Finish Setup 🎉'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SetupProfile;

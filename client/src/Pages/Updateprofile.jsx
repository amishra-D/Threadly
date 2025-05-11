import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/features/user/usersSlice'

import { Button } from '../Components/ui/button'
import { Input } from '../Components/ui/input'
import { Textarea } from '../Components/ui/textarea'
import { Label } from '../Components/ui/label'
import { Card, CardHeader, CardContent } from '../Components/ui/card'
import { toast } from 'sonner'

const banners = [
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449178/banner4_oamidu.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449178/banner5_hldlga.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/banner2_awnhdj.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449178/banner3_jxeakw.png",
  "https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/banner1_fw78ir.png"
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

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [selectedBanner, setSelectedBanner] = useState(banners[0]);

  useEffect(() => {
    if (user) {
      setValue('username', user.username || '');
      setValue('bio', user.bio || '');
      setValue('location', user.location || '');
      setSelectedAvatar(user.avatar || avatars[0]);
      setSelectedBanner(user.banner || banners[0]);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    const profileData = {
      username: data.username,
      bio: data.bio,
      location: data.location || '',
      url: selectedAvatar||'https://res.cloudinary.com/dgvmc3ezr/image/upload/v1746449179/Logo_igihne.png',
      banner: selectedBanner,
    };

    try {
      const result = await dispatch(updateUser(profileData)).unwrap();
      toast.success(result.message || 'Updated successfully!');
    } catch (err) {
      toast.error('Cannot update Profile!');
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 w-fit px-0 hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Update Profile</h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
            <div className="space-y-2">
              <Label className="text-lg">Choose Banner</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {banners.map((banner, i) => (
                  <div
                    key={i}
                    className={`border-4 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                      selectedBanner === banner
                        ? 'border-[#ddff00] ring-2 ring-offset-2'
                        : 'border-gray-300 hover:border-[#ddff00]'
                    }`}
                    onClick={() => setSelectedBanner(banner)}
                  >
                    <img src={banner} alt={`banner-${i}`} className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-lg">Choose Avatar</Label>
              <div className="flex justify-center">
                <img
                  src={selectedAvatar}
                  alt="Selected Avatar"
                  className="w-32 h-32 rounded-full border-4 border-primary object-cover shadow-md"
                />
              </div>
              <div className="grid grid-cols-5 gap-3">
                {avatars.map((avatar, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-auto p-1 transition-all ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-primary ring-offset-1 border-2 border-[#ddff00]'
                        : 'border-1 border-[#ddff00] hover:ring-1 hover:ring-muted'
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <img
                      src={avatar}
                      alt={`avatar-${i}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  {...register('username', {
                    minLength: { value: 3, message: 'Minimum 3 characters' },
                  })}
                  placeholder="Enter your username"
                  className="border border-gray-300"
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  Bio <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="bio"
                  {...register('bio', {
                    required: 'Bio is required',
                    maxLength: { value: 200, message: 'Max 200 characters' },
                  })}
                  placeholder="Tell something about yourself..."
                  rows={4}
                  className="border border-gray-300"
                />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Your city or country"
                  className="border border-gray-300"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#ddff00] border border-[#ddff00] hover:bg-[#d4e600] focus:ring-2 focus:ring-[#d4e600]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfile;

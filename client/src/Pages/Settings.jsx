import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, deleteuser } from '../features/user/usersSlice';
import { logoutUser, resetpassword } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../Components/ui/card";
import { User, Lock, Trash2, ChevronLeft, LogOut, ShieldAlert } from "lucide-react";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Button } from "../Components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../Components/ui/dialog";

function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const deleteaccount = async () => {
    try {
      await dispatch(deleteuser()).unwrap();
      navigate('/auth');
      toast.success('User deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete account');
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to log out');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await dispatch(resetpassword(passwordData)).unwrap();
      toast.success('Password reset successfully!');
      setIsResetPasswordDialogOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  return (
    <div className="w-full text-white pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ddff0005] via-transparent to-transparent pointer-events-none" />
      
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="absolute flex items-center top-2 left-2 gap-1 z-50 w-fit px-0 hover:bg-transparent"
      >
        <ChevronLeft className="h-5 w-5" />
        Back
      </Button>

      <div className="max-w-4xl mt-16 mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
        
        <div>
          <h1 className="text-3xl font-bold text-[#ddff00]">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <Card className="bg-black/60 backdrop-blur-xl border border-[#ddff0020] shadow-2xl shadow-black">
            <CardHeader className="flex flex-row items-center space-x-4 border-b border-[#ddff0010] pb-4">
              <div className="w-10 h-10 rounded-full bg-[#ddff0010] flex items-center justify-center border border-[#ddff0030]">
                <User className="w-5 h-5 text-[#ddff00]" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Profile Information</CardTitle>
                <p className="text-sm text-gray-400">Update your public facing details.</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleProfileChange}
                  placeholder="your_username"
                  required
                  className="bg-gray-900/50 border-gray-700 text-white focus-visible:ring-[#ddff00] focus-visible:border-[#ddff00] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleProfileChange}
                  placeholder="Something about you"
                  className="bg-gray-900/50 border-gray-700 text-white focus-visible:ring-[#ddff00] focus-visible:border-[#ddff00] transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#ddff0010] pt-4">
              <Button 
                type="submit" 
                className="ml-auto bg-[#ddff00] text-black hover:bg-[#b5c937] transition-colors shadow-lg shadow-[#ddff0020] font-semibold" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </form>

        <Card className="bg-black/60 backdrop-blur-xl border border-[#ddff0020] shadow-2xl shadow-black">
          <CardHeader className="flex flex-row items-center space-x-4 border-b border-[#ddff0010] pb-4">
            <div className="w-10 h-10 rounded-full bg-[#ddff0010] flex items-center justify-center border border-[#ddff0030]">
              <Lock className="w-5 h-5 text-[#ddff00]" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Security</CardTitle>
              <p className="text-sm text-gray-400">Manage your password and security settings.</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-gray-700 text-white hover:border-[#ddff00] hover:text-[#ddff00] transition-colors">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md w-full bg-gray-950 border border-gray-800 text-white">
                <DialogTitle className="text-[#ddff00]">Reset Password</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter your current email and choose a new password.
                </DialogDescription>

                <form onSubmit={handlePasswordSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={passwordData.email}
                        onChange={handlePasswordChange}
                        placeholder="your@email.com"
                        required
                        className="bg-gray-900 border-gray-700 text-white focus-visible:ring-[#ddff00]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        required
                        className="bg-gray-900 border-gray-700 text-white focus-visible:ring-[#ddff00]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        required
                        className="bg-gray-900 border-gray-700 text-white focus-visible:ring-[#ddff00]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <DialogClose asChild>
                      <Button variant="ghost" className="text-gray-400 hover:text-white">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-[#ddff00] text-black hover:bg-[#b5c937]">Reset Password</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-950/20 backdrop-blur-xl border border-red-900/50 shadow-2xl shadow-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900" />
          <CardHeader className="flex flex-row items-center space-x-4 border-b border-red-900/30 pb-4">
            <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center border border-red-900/50">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
              <p className="text-sm text-gray-400">Irreversible and destructive actions.</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white transition-colors" 
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex-1 bg-red-900/80 hover:bg-red-700 border border-red-700 text-white transition-colors" 
              onClick={deleteaccount}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}

export default SettingsPage;

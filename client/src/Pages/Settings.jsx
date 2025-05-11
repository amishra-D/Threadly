import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser,deleteuser } from '@/features/user/usersSlice';
import { resetpassword } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, Lock, Trash2, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

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

  // Populate form with current user data
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
const deleteaccount=async()=>{
  try{
  await dispatch(deleteuser()).unwrap();
  navigate('/auth')
  toast.success('User deleted successfully');
  }
  catch(error){
    console.error(error);
    }
}
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
    <div> 
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="absolute flex items-center top-2 left-2 gap-1 w-fit px-0 hover:bg-transparent"
      >
        <ChevronLeft className="h-5 w-5" />
        Back
      </Button>

      <div className="max-w-3xl mt-10 mx-auto px-4 py-8 space-y-6">
        
        {/* Profile Update Section */}
        <form onSubmit={handleProfileSubmit}>
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
              <User className="w-5 h-5" />
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleProfileChange}
                  placeholder="your_username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleProfileChange}
                  placeholder="Something about you"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto z-50" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Change Password Section */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
            <Lock className="w-5 h-5" />
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-sm w-full">
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  Enter your new password.
                </DialogDescription>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={passwordData.email}
                        onChange={handlePasswordChange}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Reset Password</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Separator />
            <Button variant="destructive" className="w-full" onClick={deleteaccount}>
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

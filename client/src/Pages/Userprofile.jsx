import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBookmarks, getUserProfile,getYourUser } from '@/features/user/usersSlice';
import { toast } from 'sonner';
import PostCard from '../reusables/Postcard';
import ProfileSkeleton from '@/reusables/ProfileSkeleton';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, Pen } from 'lucide-react';
import WithSidebarLayout from '@/reusables/WithSidebarLayout';

const Userprofile = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { myuser, user, posts, bookmarks, likedposts,Likesreceived,loading } = useSelector((state) => state.user);
  const location = useLocation();
  const { userData } = location.state || {};

    useEffect(() => {
      const fetch = async () => {
        try {
          const result = await dispatch(getYourUser()).unwrap();
          console.log("Result from API:", result);
        } catch (err) {
          toast.error(err.message || "Cannot fetch posts");
        }
      };
      fetch();
    }, [dispatch]);
    const isMe = userData?.username === myuser?.username || userData===undefined;
    console.log("userdata",userData,isMe)
  const username = isMe ? myuser?.username : userData?.username;

  useEffect(() => {

    if (username) {
      const fetchProfile = async () => {
        try {
          const response = await dispatch(getUserProfile(username)).unwrap();
          console.log("Fetched user from dispatch result:", response);
                    console.log("fetched user...",user)
          if (isMe) {
            await dispatch(getBookmarks()).unwrap();
          }
        } catch (error) {
          toast.error(error.message || 'Failed to fetch user profile');
        }
      };

      fetchProfile();
    }
  }, [dispatch, username, isMe]);

if(loading)
  return(
<ProfileSkeleton/>)

  return (
    <div className="bg-black min-h-screen w-full relative flex flex-col items-center pb-16">
      <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className=" absolute flex items-center top-2 left-2 gap-1 z-50 w-fit px-0 hover:bg-transparent"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </Button>
      <div className="w-full h-56 sm:h-64 bg-gradient-to-r from-[#141414] via-[#1f1f1f] to-[#2a2a2a] relative overflow-hidden">
  <div
    className="absolute inset-0 bg-cover bg-center opacity-50"
    style={{ backgroundImage: `url(${user?.banner})` }}
  />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
</div>


      <div className="w-full relative md:-mt-16 z-10">
       
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 sm:-bottom-16 bg-black rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-6 shadow-xl border border-[#ddff0020] max-w-5xl w-full">
        {isMe &&( <Button className="absolute right-2 -bottom-10 text-xs sm:right-10 sm:bottom-5 sm:top-auto flex items-center justify-centersm:text-sm w-fit bg-[#ddff00] hover:bg-[#b5c937]" onClick={()=>navigate('/updateprofile')}>
  <span className="mr-2"><Pen /></span> 
  Edit profile
</Button>)}

           <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#ddff00] p-1 bg-black shadow-md hover:scale-105 transition-transform">
            <img 
              src={user?.pfp} 
              alt="Profile" 
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{user?.username}</h2>
            <p className="text-[#ddff00aa] text-sm sm:text-base mt-1">{user?.bio}</p>
            <div className="flex justify-center sm:justify-start gap-6 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-[#ddff00] font-bold">{posts?.length || 0}</span>
                <span className="text-gray-400 text-xs">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#ddff00] font-bold">{Likesreceived || 0}</span>
                <span className="text-gray-400 text-xs">Likes</span>
              </div>
              {isMe && (
                <div className="flex flex-col items-center">
                  <span className="text-[#ddff00] font-bold">{bookmarks?.length || 0}</span>
                  <span className="text-gray-400 text-xs">Saved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-28 sm:pt-32" />

      <Tabs defaultValue="overview" className="w-full max-w-5xl mt-8 px-4 sm:px-6">
        <TabsList className="flex justify-between sm:justify-around gap-1 sm:gap-4 w-full bg-gray-900/50 backdrop-blur-sm rounded-lg p-2 border border-[#ddff0020]">
          <TabsTrigger value="overview" className="tab-trigger">Overview</TabsTrigger>
          <TabsTrigger value="posts" className="tab-trigger">Posts</TabsTrigger>
          {isMe && <TabsTrigger value="saved" className="tab-trigger">Bookmarks</TabsTrigger>}
          {isMe && <TabsTrigger value="liked" className="tab-trigger">Liked</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="bg-gray-900/30 border border-[#ddff0020] rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-[#ddff00] mb-4 border-b border-[#ddff0020] pb-2">Account Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-400">Posts</p>
                  <p className="text-white">{posts?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Likes Received</p>
                  <p className="text-white">{Likesreceived || 0}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-400">Account Created</p>
                  <p className="text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Location</p>
                  <p className="text-white">{user?.location || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post, index) => post && (
                <PostCard key={post._id || index} post={post} index={index} />
              ))}
            </div>
          ) : (
            <NoContent icon="message" title="No Posts Yet" message={`When ${user?.username} shares something, you'll see it here.`} />
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {bookmarks.map((post, index) => post && (
                <PostCard key={post._id || index} post={post} index={index} />
              ))}
            </div>
          ) : (
            <NoContent icon="bookmark" title="No Bookmarks Yet" message="Save posts to revisit them later." />
          )}
        </TabsContent>

        <TabsContent value="liked" className="mt-6">
          {likedposts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {likedposts.map((post, index) => post && (
                <PostCard key={post._id || index} post={post} index={index} />
              ))}
            </div>
          ) : (
            <NoContent icon="heart" title="No Liked Posts" message={`Posts that ${user?.username} likes will appear here.`} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NoContent = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 border-2 border-[#ddff0050] rounded-full flex items-center justify-center mb-4">
      <Icon type={icon} />
    </div>
    <h3 className="text-xl font-semibold text-[#ddff00] mb-2">{title}</h3>
    <p className="text-[#ddff00aa]">{message}</p>
  </div>
);

const Icon = ({ type }) => {
  const icons = {
    message: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ddff00aa" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    bookmark: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ddff00aa" strokeWidth="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ddff00aa" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  };
  return icons[type] || null;
};

export default Userprofile;

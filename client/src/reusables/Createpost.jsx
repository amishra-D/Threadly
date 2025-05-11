import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImagePlus, Video, Type, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { getYourUser } from '../features/user/usersSlice';
import {
  createTextPost,
  getAllPosts,
  uploadImagePost,
  uploadVideoPost
} from '../features/posts/postsSlice';


const Createpost = () => {
  const dispatch = useDispatch();
  const { myuser } = useSelector((state) => state.user);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const { status: postStatus } = useSelector((state) => state.posts);

  const [postType, setPostType] = useState('text');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const id = activeBoard?._id;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      caption: '',
      content: ''
    }
  });

  useEffect(() => {
    dispatch(getYourUser());
  }, [dispatch]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValidImage = postType === 'image' && file.type.startsWith('image/');
    const isValidVideo = postType === 'video' && file.type.startsWith('video/');

    if (!isValidImage && !isValidVideo) {
      toast.error(`Please upload a valid ${postType} file.`);
      return;
    }

    const maxSize = postType === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size too large (max ${postType === 'image' ? '5MB' : '20MB'})`);
      return;
    }

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaFile(null);
  };

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("Please select a board before posting");
      return;
    }

    try {
      if (postType === 'text') {
        await dispatch(createTextPost({
          boardId: id,
          data: {
            caption: data.caption,
            content: data.content,
            type: "text"
          }
        })).unwrap();
      } else if (postType === 'image') {
        const formData = new FormData();
        formData.append('caption', data.caption);
        formData.append('content', data.content || "");
        formData.append('type', 'image');
        formData.append('imgfile', mediaFile);

        await dispatch(uploadImagePost({ boardId: id, formData })).unwrap();
      } else if (postType === 'video') {
        const formData = new FormData();
        formData.append('caption', data.caption);
        formData.append('content', data.content || "");
        formData.append('type', 'video');
        formData.append('vidfile', mediaFile);

        await dispatch(uploadVideoPost({ boardId: id, formData })).unwrap();
      }

      toast.success('Post created successfully!');
      reset();
      setMediaPreview(null);
      setMediaFile(null);
      dispatch(getAllPosts());
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create post');
    }
  };

  return (
    <Card className="w-full max-w-2xl transition-all mx-auto mb-4 border border-gray-800 bg-black rounded-lg shadow-lg z-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#ddff00]">Create Post</CardTitle>
        <CardDescription className="flex items-center gap-3 mt-2">
          <img
            className="h-8 w-8 rounded-full border-2 border-[#ddff00] object-cover"
            src={myuser?.pfp || '/default-avatar.png'}
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
          <span className="text-gray-300">{myuser?.username || 'Anonymous'}</span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Input
              {...register("caption", {
                maxLength: {
                  value: 100,
                  message: "Caption must be less than 100 characters"
                }
              })}
              placeholder="Add a caption..."
              className="bg-gray-900 border-gray-800 text-white focus:border-[#ddff00] focus:ring-[#ddff00]"
            />
            {errors.caption && (
              <p className="mt-1 text-sm text-red-500">{errors.caption.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 10,
                  message: "Post must be at least 10 characters"
                },
                maxLength: {
                  value: 1000,
                  message: "Post must be less than 1000 characters"
                }
              })}
              placeholder="What's happening?"
              className="min-h-[120px] bg-gray-900 border-gray-800 text-white focus:border-[#ddff00] focus:ring-[#ddff00]"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {(postType === 'image' || postType === 'video') && (
            <div className="space-y-2">
              <input
                type="file"
                id="media-upload"
                accept={postType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleMediaChange}
                className="hidden"
              />
              <label
                htmlFor="media-upload"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                  mediaPreview ? 'border-transparent' : 'border-gray-700 hover:border-[#ddff00]'
                }`}
              >
                {mediaPreview ? (
                  <div className="relative w-full">
                    {postType === 'image' ? (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="max-h-80 w-full object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        className="max-h-80 w-full object-contain rounded-lg"
                      />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {postType === 'image' ? (
                      <ImagePlus className="h-12 w-12 text-gray-500 mb-2" />
                    ) : (
                      <Video className="h-12 w-12 text-gray-500 mb-2" />
                    )}
                    <p className="text-gray-400 text-center">
                      Click to upload {postType === 'image' ? 'an image' : 'a video'}
                      <br />
                      <span className="text-xs text-gray-500">
                        {postType === 'image' ? 'JPEG, PNG (max 5MB)' : 'MP4, MOV (max 20MB)'}
                      </span>
                    </p>
                  </>
                )}
              </label>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={postType === 'text' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center gap-1 ${
                postType === 'text' ? 'bg-[#ddff00] text-black' : 'text-gray-400 hover:text-[#ddff00]'
              }`}
              onClick={() => {
                setPostType('text');
                setMediaPreview(null);
                setMediaFile(null);
                clearErrors();
              }}
            >
              <Type className="h-4 w-4" />
              Text
            </Button>
            <Button
              type="button"
              variant={postType === 'image' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center gap-1 ${
                postType === 'image' ? 'bg-[#ddff00] text-black' : 'text-gray-400 hover:text-[#ddff00]'
              }`}
              onClick={() => {
                setPostType('image');
                clearErrors();
              }}
            >
              <ImagePlus className="h-4 w-4" />
              Image
            </Button>
            <Button
              type="button"
              variant={postType === 'video' ? 'default' : 'ghost'}
              size="sm"
              className={`flex items-center gap-1 ${
                postType === 'video' ? 'bg-[#ddff00] text-black' : 'text-gray-400 hover:text-[#ddff00]'
              }`}
              onClick={() => {
                setPostType('video');
                clearErrors();
              }}
            >
              <Video className="h-4 w-4" />
              Video
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t border-gray-800 pt-4">
          <Button
            type="submit"
            disabled={postStatus === 'loading' || (postType !== 'text' && !mediaFile)}
            className="bg-[#ddff00] hover:bg-[#ddff00]/90 text-black font-medium"
          >
            {postStatus === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Createpost;

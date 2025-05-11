import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "../Components/ui/card";
import { MessageSquare, ThumbsUp, ThumbsDown, ArrowRight, UserCog, Image, Lock, Shield, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from 'react-router-dom';
import {useSelector,useDispatch } from 'react-redux'
import { getYourUser } from '../features/user/usersSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};
const FeatureCard = ({ icon: Icon, title, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      whilehover={{ y: -5 }}
      className="h-full"
    >
      <Card className='bg-[#1d1c1c] border-gray-800 hover:border-[#ddff00]/30 transition-all h-full'>
        <CardHeader className='flex flex-row items-center gap-4'>
          <motion.div 
            className='p-3 rounded-full bg-[#ddff00]/10'
            whilehover={{ rotate: 10, scale: 1.1 }}
          >
            <Icon className='text-[#ddff00]' />
          </motion.div>
          <h2 className='font-bold text-xl sm:text-2xl'>{title}</h2>
        </CardHeader>
        <CardContent>
          <p className='text-gray-300'>{description}</p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className='text-white border-gray-600 hover:bg-[#ddff00]/10 hover:border-[#ddff00]/30'
            whilehover={{ scale: 1.05 }}
            whiletap={{ scale: 0.95 }}
          >
            Learn more
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Landing = () => {
const dispatch=useDispatch();
  const navigate=useNavigate();
  const { myuser } = useSelector((state) => state.user);
console.log(myuser)
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    dispatch(getYourUser());
  }, [dispatch]);

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: UserCog,
      title: "Anonymous Profiles",
      description: "Create an account without revealing your real identity. Express yourself freely without fear of judgment."
    },
    {
      icon: Image,
      title: "Media Sharing",
      description: "Share images, videos, and text posts with customizable privacy settings for each piece of content."
    },
    {
      icon: Lock,
      title: "Encrypted Comments",
      description: "Engage in discussions with end-to-end encrypted comments and nested replies to protect your conversations."
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description: "Granular privacy settings allow you to control who sees your content and how you interact with the platform."
    },
    {
      icon: MessageCircle,
      title: "Interaction System",
      description: "Express your opinion with likes, dislikes, and custom reactions while maintaining your anonymity."
    }
  ];

  return (
    <div className='w-full min-h-screen flex flex-col relative overflow-x-hidden bg-black'>
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#ddff00] mix-blend-overlay blur-[100px] opacity-5 animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-500 mix-blend-overlay blur-[150px] opacity-5 animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-400 mix-blend-overlay blur-[120px] opacity-5 animate-float-fast"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      </div>

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full px-4 sm:px-8 py-4 flex justify-between items-center fixed top-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800'
      >
        <motion.h1 
          whilehover={{ scale: 1.05 }}
          className='text-[#ddff00] text-lg sm:text-2xl font-bold cursor-pointer'
        >
          Threadly
        </motion.h1>
        <div className='flex gap-2 sm:gap-4'>
          {!myuser &&  (
  <motion.div whilehover={{ scale: 1.05 }} whiletap={{ scale: 0.95 }}>
    <Button variant="ghost" className='text-white hover:bg-gray-800' onClick={() => navigate('/auth')}>Login</Button>
  </motion.div>
)}
{!myuser && (
  <motion.div whilehover={{ scale: 1.05 }} whiletap={{ scale: 0.95 }}>
    <Button className='bg-[#ddff00] text-black hover:bg-[#c2e600]' onClick={() => navigate('/auth')}>Sign Up</Button>
  </motion.div>
)}

        </div>
      </motion.header>

      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
        className='flex flex-col sm:flex-row px-4 sm:px-8 relative justify-center items-center min-h-screen gap-8 sm:gap-16 pt-16 pb-8'
      >
        <motion.div 
          variants={slideUp}
          className='textcontent flex flex-col max-w-2xl z-10'
        >
          <motion.h1 
            className='text-[#ddff00] text-4xl sm:text-6xl font-bold mb-2'
            animate={{
              textShadow: ["0 0 8px rgba(221,255,0,0)", "0 0 8px rgba(221,255,0,0.5)", "0 0 8px rgba(221,255,0,0)"]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            Express Yourself
          </motion.h1>
          <motion.h1 
            className='font-bold text-white text-4xl sm:text-6xl mb-4'
            variants={slideUp}
          >
            Stay Anonymous
          </motion.h1>
          <motion.p 
            className='text-lg text-gray-300 mb-8'
            variants={slideUp}
          >
            Share your thoughts, images, and videos without revealing your identity. 
            Connect with like-minded individuals in a safe, private space.
          </motion.p>
          <motion.div 
            className='flex flex-col sm:flex-row gap-4'
            variants={slideUp}
          >
            <motion.div whilehover={{ scale: 1.05 }} whiletap={{ scale: 0.95 }}>
              <Button className='bg-[#ddff00] text-black hover:bg-[#c2e600] px-6 sm:px-8 py-6 text-lg' onClick={()=>{
                myuser?navigate('/home'):navigate('/login')
              }}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whilehover={{ scale: 1.05 }} whiletap={{ scale: 0.95 }}>
              <Button variant="outline" className='text-white border-white hover:bg-gray-800 px-6 sm:px-8 py-6 text-lg'>
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          whilehover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className='w-full sm:w-[500px] flex flex-col bg-[#1d1c1c] border-gray-800 shadow-lg shadow-[#ddff00]/10 z-10'>
            <CardHeader className='flex gap-2 items-center justify-end flex-row'>
              <div className='rounded-full w-3 h-3 bg-green-400'></div>
              <div className='rounded-full w-3 h-3 bg-yellow-400'></div>
              <div className='rounded-full w-3 h-3 bg-red-400'></div>
            </CardHeader>
            <CardContent>
              <motion.img 
                className='object-cover rounded-lg w-full h-64 sm:h-80'
                src="https://plus.unsplash.com/premium_photo-1682308447000-c0f53c7fbb90?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Post example" 
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
            </CardContent>
            <CardFooter className='flex flex-col items-start gap-2'>
              <div className='flex gap-3 items-center'>
                <motion.div 
                  className='w-8 h-8 rounded-full overflow-hidden'
                  whilehover={{ scale: 1.1 }}
                >
                  <img 
                    className='object-cover w-full h-full'
                    src="https://api.dicebear.com/9.x/lorelei/svg?seed=Jameson"
                    alt="Anonymous avatar" 
                    loading="lazy"
                  />
                </motion.div>
                <div>
                  <p className='username font-bold text-white'>Anon_user</p>
                  <p className='text-xs text-gray-500'>2 hours ago</p>
                </div>
              </div>
              <p className='text-white mt-2 text-sm sm:text-base'>
                Just shared my thoughts without fear of judgment. This platform is amazing!
              </p>
              <div className='flex gap-4 mt-4 w-full justify-start'>
                <motion.div 
                  whilehover={{ scale: 1.1 }}
                  whiletap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="sm" className='flex gap-1 items-center text-gray-400 hover:text-[#ddff00]'>
                    <ThumbsUp className="w-4 h-4" />
                    <span className='text-sm'>25</span>
                  </Button>
                </motion.div>
                <motion.div 
                  whilehover={{ scale: 1.1 }}
                  whiletap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="sm" className='flex gap-1 items-center text-gray-400 hover:text-[#ddff00]'>
                    <ThumbsDown className="w-4 h-4" />
                    <span className='text-sm'>3</span>
                  </Button>
                </motion.div>
                <motion.div 
                  whilehover={{ scale: 1.1 }}
                  whiletap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="sm" className='flex gap-1 items-center text-gray-400 hover:text-[#ddff00]'>
                    <MessageSquare className="w-4 h-4" />
                    <span className='text-sm'>4</span>
                  </Button>
                </motion.div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section 
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={containerVariants}
        className='flex flex-col px-4 sm:px-8 relative justify-center items-center min-h-screen gap-8 sm:gap-16 py-16'
      >
        <motion.div 
          variants={slideUp}
          className='text-center max-w-4xl z-10'
        >
          <h1 className='text-[#ddff00] text-4xl sm:text-6xl font-bold mb-4'>Features</h1>
          <p className='text-lg sm:text-xl text-gray-300'>
            Express yourself freely with comprehensive privacy features designed to keep your identity secure while connecting with like-minded individuals.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10'
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>
      </motion.section>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className='w-full px-4 sm:px-8 py-8 z-10 relative border-t border-gray-800'
      >
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4'>
          <motion.h2 
            whilehover={{ scale: 1.05 }}
            className='text-[#ddff00] text-lg font-bold cursor-pointer'
          >
            Threadly
          </motion.h2>
          <p className='text-gray-400 text-sm text-center sm:text-right'>
            © {new Date().getFullYear()} Threadly. All rights reserved.<br />
            Your privacy is our priority.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;

import React from 'react';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader } from "../Components/ui/card";
import { Users, Shield, Lock, MessageSquare, EyeOff, Heart, Code, Globe } from 'lucide-react';
import { Button } from "../Components/ui/button";
import { useNavigate } from 'react-router-dom';

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

const About = () => {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "100%", label: "Encrypted", icon: Lock },
    { value: "24/7", label: "Privacy Protection", icon: Shield },
    { value: "∞", label: "Freedom of Expression", icon: MessageSquare }
  ];

  const principles = [
    {
      icon: EyeOff,
      title: "Anonymity First",
      description: "We never require personal information and provide tools to protect your identity at all times."
    },
    {
      icon: Heart,
      title: "Safe Space",
      description: "Our community guidelines ensure respectful interactions while maintaining freedom of expression."
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Our core technology is open for inspection to prove our commitment to privacy."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Available worldwide with localized content moderation to respect cultural differences."
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
          whileHover={{ scale: 1.05 }}
          className='text-[#ddff00] text-lg sm:text-2xl font-bold cursor-pointer'
          onClick={() => navigate('/')}
        >
          Threadly
        </motion.h1>
        <div className='flex gap-2 sm:gap-4'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" className='text-white hover:bg-gray-800' onClick={() => navigate('/')}>Home</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className='bg-[#ddff00] text-black hover:bg-[#c2e600]' onClick={() => navigate('/auth')}>Join Now</Button>
          </motion.div>
        </div>
      </motion.header>

      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
        className='flex flex-col px-4 sm:px-8 relative justify-center items-center min-h-screen gap-8 py-16'
      >
        <motion.div 
          variants={slideUp}
          className='text-center max-w-4xl z-10'
        >
          <motion.h1 
            className='text-[#ddff00] text-4xl sm:text-6xl font-bold mb-4'
            animate={{
              textShadow: ["0 0 8px rgba(221,255,0,0)", "0 0 8px rgba(221,255,0,0.5)", "0 0 8px rgba(221,255,0,0)"]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            About Threadly
          </motion.h1>
          <motion.p 
            className='text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto'
            variants={slideUp}
          >
            Threadly was born from a simple idea: everyone deserves a space to express themselves freely without fear of judgment or repercussions. In a world where digital footprints are permanent, we offer a sanctuary of anonymity and privacy.
          </motion.p>
          <motion.div variants={slideUp}>
            <Button 
              className='bg-[#ddff00] text-black hover:bg-[#c2e600] px-8 py-6 text-lg'
              onClick={() => navigate('/auth')}
            >
              Join Our Community <Globe className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className='w-full px-4 sm:px-8 py-16 relative bg-[#0f0f0f]'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.h2 
            className='text-[#ddff00] text-3xl sm:text-4xl font-bold mb-12 text-center'
            variants={slideUp}
          >
            Our Mission
          </motion.h2>
          
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className='bg-[#1d1c1c] border-gray-800 h-full'>
                <CardHeader className='text-xl font-bold text-white'>
                  The Problem
                </CardHeader>
                <CardContent className='text-gray-300'>
                  <p className='mb-4'>
                    Social media today demands personal information, tracks your behavior, and creates permanent records of your digital life. This creates:
                  </p>
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>Fear of expressing controversial opinions</li>
                    <li>Permanent digital footprints that can be used against you</li>
                    <li>Algorithmic manipulation of your feed</li>
                    <li>Data collection by corporations and governments</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className='bg-[#1d1c1c] border-gray-800 h-full'>
                <CardHeader className='text-xl font-bold text-white'>
                  Our Solution
                </CardHeader>
                <CardContent className='text-gray-300'>
                  <p className='mb-4'>
                    Threadly provides a platform where you can:
                  </p>
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>Create an account without personal information</li>
                    <li>Post content with customizable privacy levels</li>
                    <li>Engage in discussions without fear of doxxing</li>
                    <li>Control exactly who sees your content</li>
                    <li>Delete your data permanently at any time</li>
                  </ul>
                  <p className='mt-4'>
                    We use cutting-edge encryption and privacy technologies to protect your identity and data.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className='w-full px-4 sm:px-8 py-16 relative'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.h2 
            className='text-[#ddff00] text-3xl sm:text-4xl font-bold mb-12 text-center'
            variants={slideUp}
          >
            By The Numbers
          </motion.h2>
          
          <motion.div 
            className='grid grid-cols-2 md:grid-cols-4 gap-6'
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card className='bg-[#1d1c1c] border-gray-800 text-center py-8'>
                  <CardContent className='flex flex-col items-center gap-4'>
                    <div className='p-3 rounded-full bg-[#ddff00]/10'>
                      <stat.icon className='text-[#ddff00]' />
                    </div>
                    <h3 className='text-3xl font-bold text-white'>{stat.value}</h3>
                    <p className='text-gray-300'>{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className='w-full px-4 sm:px-8 py-16 relative bg-[#0f0f0f]'
      >
        <div className='max-w-6xl mx-auto'>
          <motion.h2 
            className='text-[#ddff00] text-3xl sm:text-4xl font-bold mb-12 text-center'
            variants={slideUp}
          >
            Our Core Principles
          </motion.h2>
          
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
            variants={containerVariants}
          >
            {principles.map((principle, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <Card className='bg-[#1d1c1c] border-gray-800 h-full'>
                  <CardHeader className='flex flex-row items-center gap-4'>
                    <div className='p-3 rounded-full bg-[#ddff00]/10'>
                      <principle.icon className='text-[#ddff00]' />
                    </div>
                    <h3 className='font-bold text-xl'>{principle.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-300'>{principle.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className='w-full px-4 sm:px-8 py-16 relative'
      >
        <div className='max-w-4xl mx-auto text-center'>
          <motion.h2 
            className='text-[#ddff00] text-3xl sm:text-4xl font-bold mb-6'
            variants={slideUp}
          >
            Ready to Experience True Digital Freedom?
          </motion.h2>
          <motion.p 
            className='text-lg text-gray-300 mb-8'
            variants={slideUp}
          >
            Join thousands of users who have reclaimed their right to privacy and free expression.
          </motion.p>
          <motion.div variants={slideUp}>
            <Button 
              className='bg-[#ddff00] text-black hover:bg-[#c2e600] px-8 py-6 text-lg'
              onClick={() => navigate('/auth')}
            >
              Create Your Anonymous Account
            </Button>
          </motion.div>
        </div>
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
            whileHover={{ scale: 1.05 }}
            className='text-[#ddff00] text-lg font-bold cursor-pointer'
            onClick={() => navigate('/')}
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

export default About;
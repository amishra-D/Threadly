import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../Components/ui/card"
import { useSelector } from 'react-redux';

const BoardDescription = () => {
  const activeBoard = useSelector((state) => state.boards.activeBoard);

  return (
    <Card className='w-full max-w-[380px] h-auto lg:h-screen lg:fixed lg:top-0 overflow-y-auto mt-16'>
      <CardHeader className='p-0'>
        <div className='relative'>
          <img 
            className='w-full h-28 lg:h-32 object-cover rounded-t-lg'
            src={activeBoard?.img} 
            alt='banner'
          />
          <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent' />
        </div>
        <div className='px-4 pt-4'>
          <CardTitle className='text-2xl font-bold text-[#ddff00]'>{activeBoard?.name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className='px-4 py-4'>
        <p className='text-sm text-gray-300 whitespace-pre-line break-all overflow-hidden w-[80%]'>
         {activeBoard?.description}
        </p>
      </CardContent>
      
      <CardFooter className='px-4 py-4 border-t border-gray-800'>
        <p className='text-xs text-gray-400 flex items-center gap-2'>
          <span className='text-[#ddff00]'>Note:</span>
          Please try to be civil and respectful
        </p>
      </CardFooter>
    </Card>
  )
}

export default BoardDescription
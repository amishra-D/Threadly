import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveBoard, getallboards } from '@/features/boards/boardsSlice';
import { toast } from 'sonner';

const Boards = () => {
  const dispatch = useDispatch();
  const { boards, loading, error, activeBoard } = useSelector((state) => state.boards);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        await dispatch(getallboards()).unwrap();
      } catch (err) {
        toast.error(err.message || "Cannot fetch boards");
      }
    };
    fetchBoards();
  }, [dispatch]);

  const handleSelectChange = (val) => {
    if (val === 'All') {
      dispatch(setActiveBoard({
        name: 'All',
        description: 'This is the general page for all the posts. Each post of all pages appear here.'
      }));
    } else {
      const selected = boards.find(board => board.name === val);
      dispatch(setActiveBoard(selected || activeBoard));
    }
  };

  if (loading) return <div>Loading boards...</div>;
  if (error) return <div>Error loading boards: {error}</div>;

  return (
    <Card className='w-full max-w-2xl mx-auto mb-4 bg-black border p-3 border-gray-800 transition-colors z-40 overflow-x-hidden'>
      <CardContent className='flex items-center justify-between'>
        <div>
          <p className="font-bold text-2xl">{activeBoard?.name}</p>
        </div>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Boards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {boards.map((board, index) => (
              <SelectItem key={index} value={board.name}>
                {board.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default Boards;

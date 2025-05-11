import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/features/posts/postsSlice";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

const sortOptions = [
  { label: "New", value: "new" },
  { label: "Hot", value: "hot" },
  { label: "Top", value: "top" },
];

export default function SortCombobox() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("new");

  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const boardId = activeBoard?._id;
  const boardName = activeBoard?.name;

  const handleSortChange = async (value) => {
    setSelectedSort(value);
    setOpen(false);

    try {
      const params = {
        sort: value,
        ...(boardName !== "All" && boardId ? { boardId } : {}),
      };
      await dispatch(getAllPosts(params)).unwrap();
    } catch (error) {
      console.error("Error fetching sorted posts", error);
    }
  };

  return (
    <div className="w-[200px] mt-4 mb-2 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            Sort by: {sortOptions.find((opt) => opt.value === selectedSort)?.label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandEmpty>No sort found.</CommandEmpty>
            <CommandGroup>
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSortChange(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSort === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

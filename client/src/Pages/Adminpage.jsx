import React, { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { getallusers, deleteuser } from "../features/user/usersSlice";
import { getAllPosts, getAllReports, deletePost, deleteReport } from "../features/posts/postsSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import WithSidebarLayout from "@/reusables/WithSidebarLayout";
import { useNavigate } from "react-router-dom";

const DataTable = ({ data, columns, onRowClick, onDelete }) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <div
                      className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-2" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                ))}
                {onDelete && <TableHead>Actions</TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      onClick={() => onRowClick && onRowClick(row.original)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {onDelete && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row.original);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (onDelete ? 1 : 0)} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts.items);
  const { reports } = useSelector((state) => state.posts);
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    dispatch(getallusers());
    dispatch(getAllPosts());
    dispatch(getAllReports());
  }, [dispatch]);

  const stats = useMemo(() => {
  const totalUsers = user?.length || 0;
  const totalPosts = posts?.length || 0;
  const activeReports = reports?.filter(r => !r.resolved)?.length || 0;

  return [
    { title: "Total Users", value: totalUsers, change: "+12%", trend: "up" },
    { title: "Total Posts", value: totalPosts, change: "+5%", trend: "up" },
    { title: "Active Reports", value: activeReports, change: "-3%", trend: "down" },
    {
      title: "Resolved Reports",
      value: (reports?.length || 0) - activeReports,
      change: "+8%",
      trend: "up"
    },
  ];
}, [user, posts, reports]);


  const handleDelete = async () => {
    try {
      if (activeTab === "users") {
        await dispatch(deleteuser(itemToDelete._id)).unwrap();
        toast("User deleted successfully");
      } else if (activeTab === "posts") {
        await dispatch(deletePost(itemToDelete._id)).unwrap();
        toast("Post deleted successfully");
      } else if (activeTab === "reports") {
        await dispatch(deleteReport({contentId:itemToDelete._id})).unwrap();
        toast("Report deleted successfully");
      }
      setItemToDelete(null);
    } catch (error) {
      toast( "Error deleting item");
    }
  };

  const userColumns = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
     {
  accessorKey: "role",
  header: "Role",
  cell: ({ row }) => {
    const role = row.original.isAdmin ? "admin" : "user";
    return (
      <Badge variant={role === "admin" ? "destructive" : "outline"}>
        {role}
      </Badge>
    );
  },
},
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
  ];

  const postColumns = [
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <div className="line-clamp-1 max-w-xs">{row.getValue("content")}</div>
      ),
    },
    {
      accessorKey: "author.username",
      header: "Author",
      cell: ({ row }) => (
        <div className="line-clamp-1 max-w-xs">{row.original.userId.username}</div>
      ),
    },
    {
      accessorKey: "likesCount",
      header: "Likes",
      cell: ({ row }) => row.original.likes?.length || 0,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
  ];

 const reportColumns = [
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "reportedBy.username",
    header: "Reported By",
    cell: ({ row }) => {
      // Check if reportedBy is a string (just the username) or an object
      const reportedBy = row.original.reportedBy;
      const username = typeof reportedBy === 'string' 
        ? reportedBy 
        : reportedBy?.username || 'Unknown';
      return (
        <div className="line-clamp-1 max-w-xs">{username}</div>
      );
    },
  },
  {
    accessorKey: "post.content",
    header: "Post Content",
    cell: ({ row }) => {
      const content = row.original.contentId?.content || 'Deleted post';
      return (
        <div className="line-clamp-1 max-w-xs">{content}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || 'pending';
      return (
        <Badge variant={status === "resolved" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
];
  const handleRowClick = (rowData) => {
    console.log("Row clicked:", rowData);
  };

  return (
    <div className="p-6 space-y-6 relative">
      <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className=" absolute flex items-center top-2 left-2 gap-1 w-fit px-0 hover:bg-transparent"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </Button>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#ddff00]">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage users, content, and reports from this dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Badge variant={stat.trend === "up" ? "default" : "destructive"}>
                {stat.change}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs 
        defaultValue="users" 
        className="space-y-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="users">Users ({user?.length || 0})</TabsTrigger>
          <TabsTrigger value="posts">Posts ({posts?.length || 0})</TabsTrigger>
          <TabsTrigger value="reports">
            Reports ({reports?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <DataTable 
            data={user || []} 
            columns={userColumns} 
            onRowClick={handleRowClick}
            onDelete={(user) => setItemToDelete(user)}
          />
        </TabsContent>
        <TabsContent value="posts">
          <DataTable 
            data={posts || []} 
            columns={postColumns} 
            onRowClick={handleRowClick}
            onDelete={(post) => setItemToDelete(post)}
          />
        </TabsContent>
        <TabsContent value="reports">
          <DataTable 
            data={reports || []} 
            columns={reportColumns} 
            onRowClick={handleRowClick}
            onDelete={(report) => setItemToDelete(report)}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {activeTab.slice(0, -1)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
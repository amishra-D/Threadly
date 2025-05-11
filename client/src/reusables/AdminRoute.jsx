import { useSelector,useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getYourUser } from "@/features/user/usersSlice";
import { useEffect } from "react";
const AdminRoute = ({ children }) => {
  const myuser = useSelector((state) => state.user.myuser);
const dispatch=useDispatch();
  useEffect(() => {
    dispatch(getYourUser());
  }, [dispatch]);

  if (!myuser?.isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;

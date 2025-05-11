import Mysideb from './Mysideb';

const WithSidebarLayout = ({ children, user }) => {
  return (
    <div className="relative">
      <Mysideb user={user} />
      <div className="max-w-4xl px-4 py-6 mx-auto">
        {children}
      </div>
    </div>
  );
};

export default WithSidebarLayout;

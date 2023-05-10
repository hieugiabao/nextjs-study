import Header from "./Header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

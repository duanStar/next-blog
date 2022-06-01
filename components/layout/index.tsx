import type { NextPage } from 'next';
import { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface LayoutProps {
  children?: ReactNode
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <main>{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default Layout

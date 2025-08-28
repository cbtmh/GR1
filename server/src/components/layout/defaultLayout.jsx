import React from "react";
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const DefaultLayout = ({ children }) => {
    return (
      <>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </>
    );
  };
  
  export default DefaultLayout;
import React from "react";  
import { Outlet } from 'react-router-dom';
import Header from "./header";
import styles from "@/app/page.module.css";

import './styles/section_body.css';
import './styles/section_header.css';
import './styles/section_input.css';
import './styles/section_table.css';

const Layout = () => {
  return (
    <>  <div className={`${styles.assistantInteraction} bg-[#e1e1e1] text-[#171717] overflow-y-scroll m-0`}>
          <Header />
          <Outlet />
        </div>
    </>
  );
};

export default Layout;


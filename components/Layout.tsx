// components/Layout.js
import React, { ReactNode } from 'react';
import NavBar from './NavBar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const [open, setOpen] = React.useState(false); // State management for NavBar

    return (
        <>
            <NavBar open={open} setOpen={setOpen} />
            <main style={{ marginBottom: "100px", marginTop: "100px" }} >{children}</main>
        </>
    );
};

export default Layout;

"use client";
import { useState } from "react";
import { Menu, MenuItem, ProductItem, HoveredLink } from "@/components/ui/navbar-menu";

export default function Navbar() {
  const [active, setActive] = useState(null);
  
  return (
    <div className="flex justify-center pt-6">
      <div className="flex items-center gap-8">
        <Menu setActive={setActive} className="max-w-2xl">
          <MenuItem setActive={setActive} active={active} item="Logo">
            <div className="flex flex-col space-y-4">
              <HoveredLink href="/">Logo</HoveredLink>
            </div>
          </MenuItem>

          <div className="w-24" /> 

          <MenuItem setActive={setActive} active={active} item="Home">
            <div className="flex flex-col space-y-4">
              <HoveredLink href="/">Home Page</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-4">
              <HoveredLink href="/about">About Us</HoveredLink>
            </div>
          </MenuItem>
          
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4">
              <HoveredLink href="/services">Our Services</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Portfolio">
            <div className="flex flex-col space-y-4">
              <HoveredLink href="/portfolio">Portfolio</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Contact">
            <div className="flex flex-col space-y-4">
              <HoveredLink href="/contact">Contact Us</HoveredLink>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
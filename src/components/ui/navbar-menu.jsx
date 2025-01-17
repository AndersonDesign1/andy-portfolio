import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Hamburger button component
const HamburgerButton = ({ isOpen, onClick }) => (
  <button 
    onClick={onClick}
    className="lg:hidden p-2 text-black dark:text-white"
    aria-label="Toggle menu"
  >
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <span className={`w-full h-0.5 bg-current transform transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`w-full h-0.5 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
      <span className={`w-full h-0.5 bg-current transform transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
    </div>
  </button>
);

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  isMobile
}) => {
  if (isMobile) {
    return (
      <div className="w-full">
        <p className="cursor-pointer text-black dark:text-white py-2">
          {item}
        </p>
        <div className="pl-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white">
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}>
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl">
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({ setActive, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <nav className="relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-between items-center px-8 py-6">
        <div 
          onMouseLeave={() => setActive(null)}
          className="hidden lg:flex justify-center space-x-4"
        >
          {children}
        </div>
        <HamburgerButton 
          isOpen={isOpen} 
          onClick={() => setIsOpen(!isOpen)} 
        />
      </nav>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black rounded-2xl border border-black/[0.2] dark:border-white/[0.2] shadow-xl p-4"
        >
          {React.Children.map(children, child =>
            React.cloneElement(child, { isMobile: true })
          )}
        </motion.div>
      )}
    </div>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
  isMobile
}) => {
  const sharedClasses = "flex space-x-2" + (isMobile ? " py-2" : "");
  
  return (
    <Link href={href} className={sharedClasses}>
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </Link>
  );
};

export default Menu;
import type React from "react"

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {}

const SvgIcon: React.FC<SvgIconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" {...props}>
    {/* Ahrefs logo SVG content */}
    <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z" />
    <path d="M65 35H35v30h10V55h20V35zm-10 10H45v-5h10v5z" />
    <path d="M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 40c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" />
  </svg>
)

export default SvgIcon


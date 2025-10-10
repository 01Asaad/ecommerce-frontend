import { useState, useEffect } from 'react';
const breakpoints = {
  "2xl": 1536,
  "xl": 1280,
  "lg": 1024,
  "md": 768,
  "sm": 640,
  "xs": 0
}
function doesWidthReach(breakpoint) {
  return window.innerWidth >= breakpoints[breakpoint]
} //has to be used alongside the hook and not independently to make sure compononts re-evaluate on breakpoint change, therefore not exported
const useTWBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState('xs')

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
  
      // const sortedBreakpoints = Object.entries(breakpoints).sort((a, b) => b[1] - a[1])
      
      const matchedBreakpoint = Object.entries(breakpoints).find(([bp, bpValue]) => width >= bpValue)
      
      const newBreakpoint = matchedBreakpoint ? matchedBreakpoint[0] : 'xs'
      
      setBreakpoint(prev => {
        console.log(prev !== newBreakpoint ? `changing bp from ${prev} to ${newBreakpoint}` : "keeping bp as "+newBreakpoint);
        return prev !== newBreakpoint ? newBreakpoint : prev})
        
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return [breakpoint, doesWidthReach];
};

export default useTWBreakpoints
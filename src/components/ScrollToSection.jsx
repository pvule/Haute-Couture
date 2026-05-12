import { useEffect } from 'react';
import Home from '../pages/home';

function ScrollToSection({ sectionId }) {
  useEffect(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sectionId]);

  return <Home />;
}

export default ScrollToSection;

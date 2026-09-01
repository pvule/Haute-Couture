import { lazy, Suspense, useEffect } from 'react';

const Home = lazy(() => import('../pages/home'));

function ScrollToSection({ sectionId }) {
  useEffect(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sectionId]);

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Chargement...</div>}>
      <Home />
    </Suspense>
  );
}

export default ScrollToSection;

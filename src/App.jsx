import { useEffect, useState } from 'react';
import { useRoute, scrollToSection } from './hooks/useRoute.js';
import { APP_CONFIG } from './config/app.js';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ApplyPage from './pages/ApplyPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const { path, params } = useRoute();
  // The receipt is kept for this browser tab so a refresh on the
  // confirmation page still shows the reference number.
  const [receipt, setReceiptState] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('jfc-receipt') || 'null'); } catch { return null; }
  });
  const setReceipt = (r) => {
    setReceiptState(r);
    try { sessionStorage.setItem('jfc-receipt', JSON.stringify(r)); } catch { /* ignore */ }
  };
  const isAdmin = path === `/${APP_CONFIG.adminRoute}`;

  // Page changes: scroll to the requested section, or to the top.
  useEffect(() => {
    const section = params.get('s');
    const id = requestAnimationFrame(() => {
      if (!(section && scrollToSection(section))) window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [path, params]);

  useEffect(() => {
    document.title = isAdmin
      ? 'Electoral desk | JKUAT French Club'
      : 'Executive Leadership Application 2026/2027 | JKUAT French Club';
    // Keep the private electoral desk out of search results.
    document.querySelector('meta[name="robots"]')?.setAttribute('content', isAdmin ? 'noindex, nofollow' : 'index, follow');
  }, [isAdmin]);

  let page;
  if (path === '/') page = <HomePage />;
  else if (path === '/apply') page = <ApplyPage onSubmitted={setReceipt} />;
  else if (path === '/submitted') page = <ConfirmationPage receipt={receipt} />;
  else if (isAdmin) page = <AdminPage />;
  else page = <NotFoundPage />;

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to main content
      </a>
      <Header variant={isAdmin ? 'admin' : 'public'} />
      <main id="main" tabIndex={-1}>{page}</main>
      {!isAdmin && <Footer />}
    </>
  );
}

import { useNavigate } from '../hooks/useRoute.js';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="confirm-page">
      <div className="container container--narrow confirm-card">
        <h1 className="confirm-title">Page not found</h1>
        <p className="confirm-text">The page you followed does not exist. Go back to the portal home page to continue.</p>
        <a className="btn btn--primary" href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Return to home</a>
      </div>
    </section>
  );
}

import Logo from '../common/Logo.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={72} decorative />
          <div>
            <p className="footer-name">JKUAT French Club</p>
            <p className="footer-motto" lang="fr">L'Équipe Gagnante</p>
          </div>
        </div>
        <p className="footer-note">
          Jomo Kenyatta University of Agriculture and Technology. Executive leadership applications for the
          2026/2027 academic year. All elections are conducted subject to the JKUAT French Club constitution and
          applicable election guidelines.
        </p>
      </div>
      <div className="container footer-base">
        <span>&copy; 2026 JKUAT French Club</span>
        <span>Executive Leadership Application Portal</span>
      </div>
    </footer>
  );
}

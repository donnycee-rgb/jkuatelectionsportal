import ApplicationForm from '../components/form/ApplicationForm.jsx';
import { useRoute } from '../hooks/useRoute.js';
import { POSITIONS } from '../config/positions.js';
import { IS_PREVIEW_MODE } from '../config/app.js';

export default function ApplyPage({ onSubmitted }) {
  const { params } = useRoute();
  const preselect = POSITIONS.find((p) => p.id === params.get('position'))?.title;

  const handleSubmitted = (receipt) => {
    onSubmitted(receipt);
    window.location.hash = '#/submitted';
  };

  return (
    <section className="apply-page" aria-labelledby="apply-title">
      <div className="container container--narrow">
        <header className="apply-head">
          <span className="duo-rule" aria-hidden="true"><i /><i /></span>
          <h1 id="apply-title" className="apply-title">Executive leadership application</h1>
          <p className="apply-sub">
            JKUAT French Club, 2026/2027. Fields marked <span aria-hidden="true">*</span>
            <span className="visually-hidden">with an asterisk</span> are required.
          </p>
          {IS_PREVIEW_MODE && (
            <p className="notice notice--warn" role="note">
              Preview mode: no Apps Script URL is configured, so submissions are stored in this browser only.
            </p>
          )}
        </header>
        <ApplicationForm initialPosition={preselect} onSubmitted={handleSubmitted} />
      </div>
    </section>
  );
}

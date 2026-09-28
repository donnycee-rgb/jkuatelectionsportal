import ApplicationForm from '../components/form/ApplicationForm.jsx';
import Photo from '../components/common/Photo.jsx';
import { useRoute } from '../hooks/useRoute.js';
import { POSITIONS } from '../config/positions.js';
import { PHOTOS } from '../config/photos.js';
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
      <div className={`container apply-layout ${PHOTOS.apply ? '' : 'apply-layout--solo'}`}>
        <div className="apply-main">
          <header className="apply-head">
            <p className="eyebrow">JKUAT French Club &middot; 2026/2027</p>
            <h1 id="apply-title" className="apply-title">Executive leadership application</h1>
            <p className="apply-sub">
              Fields marked <span aria-hidden="true">*</span>
              <span className="visually-hidden">with an asterisk</span> are required. Your progress is saved on this
              device while you work.
            </p>
            {IS_PREVIEW_MODE && (
              <p className="notice notice--warn" role="note">
                Preview mode: no Apps Script URL is configured, so submissions are stored in this browser only.
              </p>
            )}
          </header>
          <ApplicationForm initialPosition={preselect} onSubmitted={handleSubmitted} />
        </div>

        {/* Decorative on wide screens only; hidden on mobile so the form comes first. */}
        {PHOTOS.apply && (
          <aside className="apply-aside" aria-hidden="true">
            <Photo photo={PHOTOS.apply} className="apply-aside-photo" sizes="300px" />
            <p className="apply-aside-motto" lang="fr">L'Équipe Gagnante</p>
            <span className="duo-rule"><i /><i /></span>
          </aside>
        )}
      </div>
    </section>
  );
}

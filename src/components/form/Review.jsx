// Short summary shown before the declaration so candidates can check key details.
export default function Review({ values, onEdit }) {
  const rows = [
    { label: 'Full name', value: values.fullName, step: 0 },
    { label: 'Registration number', value: values.registrationNumber, step: 0 },
    { label: 'Course / programme', value: values.course, step: 0 },
    { label: 'Year of study', value: values.year, step: 0 },
    { label: 'Email address', value: values.email, step: 0 },
    { label: 'Phone number', value: values.phone, step: 0 },
    { label: 'Club membership', value: `${values.membership}, ${values.membershipDuration}`, step: 1 },
    { label: 'Position applied for', value: values.position, step: 2, strong: true },
    { label: 'French proficiency', value: values.frenchProficiency, step: 6 },
  ];
  return (
    <div className="review">
      <h3 className="review-title">Check your details</h3>
      <dl className="review-list">
        {rows.map((r) => (
          <div key={r.label} className={`review-row ${r.strong ? 'is-strong' : ''}`}>
            <dt>{r.label}</dt>
            <dd>{r.value || 'Not provided'}</dd>
            <button type="button" className="link-btn" onClick={() => onEdit(r.step)}>
              Edit<span className="visually-hidden"> {r.label}</span>
            </button>
          </div>
        ))}
      </dl>
    </div>
  );
}

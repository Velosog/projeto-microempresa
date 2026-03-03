import clinic from '../../data/clinic.json'

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p
        className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
        style={{ color: clinic.primaryColor }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-bold text-gray-900 mb-5 leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-base leading-relaxed max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

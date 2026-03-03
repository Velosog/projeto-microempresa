import clinic from '../../data/clinic.json'
import useScrollReveal from '../../hooks/useScrollReveal'
import SectionHeader from '../ui/SectionHeader'
import { CameraIcon } from '../icons'

export default function GallerySection() {
  const revealRef = useScrollReveal()
  const gridRef = useScrollReveal(0.1)

  const gallery = [
    { label: 'Recepção', aspect: 'aspect-[4/3]', desc: 'Ambiente moderno e acolhedor' },
    { label: 'Consultório', aspect: 'aspect-[3/4]', desc: 'Tecnologia de última geração' },
    { label: 'Equipe', aspect: 'aspect-[4/3]', desc: 'Profissionais especializados' },
    { label: 'Equipamentos', aspect: 'aspect-[4/3]', desc: 'Scanner digital e laser' },
    { label: 'Sala de espera', aspect: 'aspect-[3/4]', desc: 'Conforto para pacientes' },
    { label: 'Resultado', aspect: 'aspect-[4/3]', desc: 'Sorrisos transformados' },
  ]

  return (
    <section id="galeria" className="py-24 md:py-32 px-5 bg-gray-50/70">
      <div className="max-w-7xl mx-auto">
        <div ref={revealRef} className="scroll-reveal">
          <SectionHeader
            eyebrow="Nossa estrutura"
            title="Conheça o espaço"
            subtitle="Um ambiente projetado para oferecer conforto, tecnologia e segurança em cada atendimento."
          />
        </div>

        <div ref={gridRef} className="scroll-reveal scroll-reveal-children grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mt-16">
          {gallery.map((item, i) => (
            <div
              key={item.label}
              className={`group relative ${item.aspect} rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 hover:scale-[1.02]`}
            >
              {/* Placeholder gradient */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  background: `linear-gradient(${135 + i * 30}deg, ${clinic.primaryColor}12 0%, ${clinic.primaryColor}25 50%, ${clinic.primaryColorDark}20 100%)`,
                }}
              />

              {/* Placeholder icon & text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: clinic.primaryColor + '15' }}
                >
                  <CameraIcon className="w-6 h-6" style={{ color: clinic.primaryColor }} />
                </div>
                <p className="text-xs font-medium text-gray-500 text-center">{item.desc}</p>
                <p className="text-[10px] text-gray-300 mt-1">Inserir foto real</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Label on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-white/70 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

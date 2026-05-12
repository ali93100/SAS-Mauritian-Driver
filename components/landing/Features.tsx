'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Ponctualité garantie',
    description: 'Ahmad arrive toujours à l\'heure. Suivi de votre course en temps réel.',
  },
  {
    title: 'Discrétion absolue',
    description: 'Confidentialité et discrétion professionnelle pour chacun de vos déplacements.',
  },
  {
    title: 'Confort premium',
    description: 'Véhicule haut de gamme, impeccable, pour une expérience de voyage supérieure.',
  },
  {
    title: 'Réservation instantanée',
    description: 'Réservez en quelques secondes. Confirmation rapide et personnelle.',
  },
  {
    title: 'Particuliers & Entreprises',
    description: 'Solutions sur mesure pour vos besoins personnels et professionnels.',
  },
  {
    title: 'Carte VTC certifiée',
    description: 'Chauffeur professionnel certifié, assuré et expérimenté. 10 ans de métier.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Features() {
  return (
    <section className="py-24 bg-black-rich">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            Pourquoi me choisir
          </p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-stone-100 mb-6">
            L&apos;excellence à votre service
          </h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            Chaque détail est pensé pour vous offrir une expérience de transport premium inoubliable.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group bg-black-card border border-anthracite rounded-2xl p-8
                         hover:border-gold/30 hover:shadow-gold transition-all duration-300 cursor-default"
            >
              <h3 className="text-stone-100 font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

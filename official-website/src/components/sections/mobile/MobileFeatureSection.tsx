import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MobileFeatureSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgClass?: string;
}

const MobileFeatureSection = ({ icon, title, description, bgClass = '' }: MobileFeatureSectionProps) => {
  return (
    <section className={`scroll-section relative overflow-hidden flex items-center justify-center ${bgClass}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center px-8 max-w-sm"
      >
        <div className="w-16 h-16 mx-auto mb-5 bg-[var(--brand)]/10 text-[var(--brand)] rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-[var(--text-1)]">{title}</h3>
        <p className="text-[var(--text-2)] leading-relaxed text-sm">{description}</p>
      </motion.div>
    </section>
  );
};

export default MobileFeatureSection;

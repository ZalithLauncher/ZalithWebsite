import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MobileStatsSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgClass?: string;
}

const MobileStatsSection = ({ icon, title, description, bgClass = '' }: MobileStatsSectionProps) => {
  return (
    <section className={`scroll-section relative overflow-hidden flex items-center justify-center ${bgClass}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center px-8 max-w-sm"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-[var(--brand)]/10 text-[var(--brand)] rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-[var(--text-1)]">{title}</h3>
        <p className="text-[var(--text-2)] leading-relaxed">{description}</p>
      </motion.div>
    </section>
  );
};

export default MobileStatsSection;

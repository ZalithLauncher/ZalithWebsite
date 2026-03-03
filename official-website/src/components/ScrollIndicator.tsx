import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

const ScrollIndicator = ({ total, current, onSelect }: ScrollIndicatorProps) => {
  return (
    <div className="scroll-indicator">
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          className={`scroll-indicator-dot ${index === current ? 'active' : ''}`}
          onClick={() => onSelect(index)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ScrollIndicator;

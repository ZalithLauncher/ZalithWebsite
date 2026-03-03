import { useRef, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import ScrollIndicator from './ScrollIndicator';

interface ScrollContainerProps {
  children: ReactNode;
}

const ScrollContainer = ({ children }: ScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const sections = containerRef.current.querySelectorAll('.scroll-section');
      setTotalSections(sections.length);
    }
  }, [children]);

  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections) return;
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('.scroll-section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
  }, [totalSections]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / sectionHeight);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, scrollToSection]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="scroll-container"
      >
        {children}
      </div>
      {totalSections > 1 && (
        <ScrollIndicator
          total={totalSections}
          current={currentIndex}
          onSelect={scrollToSection}
        />
      )}
    </div>
  );
};

export default ScrollContainer;

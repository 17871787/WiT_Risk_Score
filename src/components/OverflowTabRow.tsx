import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface TabDef {
  id: string;
  label: string;
  alert?: boolean;   // red dot
  emoji?: string;    // optional emoji
}

interface Props {
  tabs: TabDef[];
  active: string;
  onSelect: (id: string) => void;
}

export const OverflowTabRow: React.FC<Props> = ({ tabs, active, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleTabs, setVisibleTabs]   = useState<TabDef[]>(tabs);
  const [overflowTabs, setOverflowTabs] = useState<TabDef[]>([]);
  const [menuOpen, setMenuOpen]         = useState(false);

  // Lay out whenever size or tab set changes
  useEffect(() => {
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;

      const total   = el.clientWidth - 60; // reserve for More btn
      let used      = 0;
      const vis: TabDef[] = [];
      const over: TabDef[] = [];

      tabs.forEach(t => {
        // approx width: padding + char count + emoji + alert
        const est = 24 + t.label.length * 8 + (t.alert ? 16 : 0) + (t.emoji ? 20 : 0);
        if (used + est <= total) {
          vis.push(t); 
          used += est;
        } else {
          over.push(t);
        }
      });

      setVisibleTabs(vis);
      setOverflowTabs(over);
    };

    compute();

    // Observe resize
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [tabs]);

  // Close pop-over on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <div
      ref={containerRef}
      className="relative flex space-x-1 mb-4 border-b"
    >
      {visibleTabs.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`
            flex-shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors
            ${active === t.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'}
          `}
        >
          {t.label}
          {t.emoji && <span className="text-xs ml-1">{t.emoji}</span>}
          {t.alert && <span className="ml-1 text-red-500">●</span>}
        </button>
      ))}

      {/* More button shows when there is overflow */}
      {overflowTabs.length > 0 && (
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className={`
              flex items-center px-2 py-2 text-sm font-medium
              border-b-2 transition-colors focus:outline-none
              ${overflowTabs.some(t => t.id === active)
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}
            `}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            More <ChevronDown size={14} className="ml-1"/>
          </button>

          {menuOpen && (
            <ul
              className="absolute right-0 z-10 mt-1 w-48 bg-white shadow-lg
                         rounded-md border text-sm"
              onClick={e => e.stopPropagation()}
              role="menu"
            >
              {overflowTabs.map(t => (
                <li key={t.id} role="none">
                  <button
                    onClick={() => { onSelect(t.id); setMenuOpen(false); }}
                    className={`
                      w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between
                      ${active === t.id ? 'font-semibold text-blue-600 bg-blue-50' : ''}
                    `}
                    role="menuitem"
                  >
                    <span>
                      {t.label}
                      {t.emoji && <span className="text-xs ml-1">{t.emoji}</span>}
                    </span>
                    {t.alert && <span className="text-red-500">●</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Sprout } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100/90 border-t border-emerald-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-lg font-bold font-display text-white">Farmers Hub</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-4">
              Growing Together, Feeding the Future. Connecting East Africa's agricultural producers, wholesale buyers, agrovet suppliers, and agronomy experts.
            </p>
            <div className="text-[11px] text-emerald-400">
              Nakuru · Eldoret · Nairobi · Meru · Kitale
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Cereal Grains & Maize
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Export Hass Avocados
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Highland Dairy Produce
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Horticulture & Tubers
                </button>
              </li>
            </ul>
          </div>

          {/* Management & Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Agri-Tools
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <button onClick={() => onNavigate('farm-manager')} className="hover:text-white transition-colors">
                  Field Crop Cycles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('farm-manager')} className="hover:text-white transition-colors">
                  Livestock Herd Logs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-white transition-colors">
                  Open-Meteo Weather Station
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-white transition-colors">
                  Agronomy Research Library
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Compliance & Payments
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Safaricom M-Pesa Setup
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Wholesale Trade Terms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Farm Data Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('messages')} className="hover:text-white transition-colors">
                  Producer Inquiries
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-4">
          <p>© {new Date().getFullYear()} Farmers Hub Kenya. All agricultural rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Direct Producer Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>Zero Broker Surcharges</span>
            <span aria-hidden="true">·</span>
            <span>M-Pesa Express Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

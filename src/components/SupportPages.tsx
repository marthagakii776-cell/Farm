import React, { useState } from 'react';
import { HelpCircle, Shield, FileText, ChevronDown, Send, CheckCircle2 } from 'lucide-react';

export const SupportPages: React.FC = () => {
  const [tab, setTab] = useState<'faq' | 'privacy' | 'terms' | 'daraja' | 'contact'>('faq');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does produce purchasing and delivery work on Farmers Hub?',
      a: 'Produce buyers can browse verified crop listings directly from farmers. When you place an order, you can pay via Safaricom M-Pesa Express, Credit/Debit card, or choose Pay on Delivery. Once confirmed, the farmer receives an immediate dispatch notice with your destination coordinates.',
    },
    {
      q: 'How do farmers receive payment for their harvests?',
      a: 'Funds are transferred directly into the farmer’s registered M-Pesa business till or bank account. Farmers Hub does not extract broker commission cuts, ensuring growers receive fair farm-gate prices.',
    },
    {
      q: 'Where does the weather data originate?',
      a: 'The Weather Station integrates directly with Open-Meteo, utilizing open satellite and atmospheric telemetry without invented data. Our agronomy engine analyzes live wind, humidity, and precipitation probability to deliver daily spraying and blight advisories.',
    },
    {
      q: 'Can agricultural experts and extension officers publish guides?',
      a: 'Yes. Users with the "Agricultural Expert" or "Administrator" role have publication privileges to author peer-reviewed field guides, pest management bulletins, and soil nutrition manuals.',
    },
    {
      q: 'How does live M-Pesa Daraja integration function in production?',
      a: 'In test/sandbox mode, the simulated Daraja endpoint demonstrates the USSD prompt and receipt flow. To deploy live with Safaricom Daraja in production, simply supply your Business Shortcode (Paybill/Till), Consumer Key, Consumer Secret, and Passkey as server environment variables.',
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
          Help, Compliance & Merchant Integration
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Frequently asked questions, terms of trade, and live Safaricom Daraja M-Pesa integration guide.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1 p-1 bg-stone-100 rounded-lg max-w-lg mx-auto mb-8 text-xs overflow-x-auto">
        <button
          onClick={() => setTab('faq')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            tab === 'faq' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-stone-600'
          }`}
        >
          Frequently Asked Questions
        </button>
        <button
          onClick={() => setTab('daraja')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            tab === 'daraja' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-stone-600'
          }`}
        >
          M-Pesa Setup Guide
        </button>
        <button
          onClick={() => setTab('terms')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            tab === 'terms' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-stone-600'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setTab('privacy')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
            tab === 'privacy' ? 'bg-white text-emerald-950 font-bold shadow-xs' : 'text-stone-600'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      {/* FAQ Tab */}
      {tab === 'faq' && (
        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-xs text-stone-900 flex items-center justify-between gap-4"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-800' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* M-Pesa Setup Guide Tab */}
      {tab === 'daraja' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 max-w-3xl mx-auto shadow-xs text-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <span>Safaricom Daraja 2.0 API Integration Architecture</span>
          </div>

          <p className="text-stone-600 leading-relaxed">
            Farmers Hub is architected for direct integration with Safaricom’s official Daraja STK Push (Lipa na M-Pesa Online) API. Sensitive credentials are kept strictly on the backend proxy server and never exposed to client-side code.
          </p>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 font-mono text-[11px]">
            <div className="font-bold text-stone-800">Required Environment Variables:</div>
            <div className="text-stone-600">MPESA_ENVIRONMENT="sandbox" # or "production"</div>
            <div className="text-stone-600">MPESA_CONSUMER_KEY="Your_Consumer_Key"</div>
            <div className="text-stone-600">MPESA_CONSUMER_SECRET="Your_Consumer_Secret"</div>
            <div className="text-stone-600">MPESA_SHORTCODE="174379" # Paybill or BuyGoods Till</div>
            <div className="text-stone-600">MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"</div>
          </div>

          <h4 className="font-bold text-stone-900 pt-2">Step-by-Step Production Activation:</h4>
          <ol className="list-decimal pl-5 space-y-1.5 text-stone-600">
            <li>Register for an account on the Safaricom Developer Portal (developer.safaricom.co.ke).</li>
            <li>Create an App to obtain your Consumer Key and Consumer Secret.</li>
            <li>Apply for Go-Live with your registered business certificate and active Till / Paybill number.</li>
            <li>Configure your server environment with the keys provided in the M-Pesa Merchant portal.</li>
          </ol>
        </div>
      )}

      {/* Terms Tab */}
      {tab === 'terms' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 max-w-3xl mx-auto shadow-xs text-xs text-stone-700 leading-relaxed space-y-3">
          <h3 className="font-bold text-sm text-stone-900">Farmers Hub Terms of Agricultural Trade</h3>
          <p>
            1. <strong>Direct Trading:</strong> Farmers Hub serves as a direct agricultural technology platform connecting independent farmers with commercial buyers. Quality verification remains the joint responsibility of both transacting parties upon delivery inspection.
          </p>
          <p>
            2. <strong>Listing Accuracy:</strong> Produce listings must specify truthful quantities, varieties, and moisture levels (for grains).
          </p>
          <p>
            3. <strong>Payment Protection:</strong> Digital orders processed via M-Pesa Express are held in escrow status until buyer receipt confirmation.
          </p>
        </div>
      )}

      {/* Privacy Tab */}
      {tab === 'privacy' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 max-w-3xl mx-auto shadow-xs text-xs text-stone-700 leading-relaxed space-y-3">
          <h3 className="font-bold text-sm text-stone-900">Privacy & Farm Data Governance</h3>
          <p>
            We strictly safeguard our growers’ personal contacts and farm coordinates. Location data is utilized solely for weather microclimate forecasting and wholesale consignment logistics. We do not sell farmer or buyer contact records to third-party marketing brokers.
          </p>
        </div>
      )}
    </section>
  );
};

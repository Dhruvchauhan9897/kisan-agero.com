import React from 'react';
import {
  ArrowRight,
  Phone,
  MessageSquare,
  MapPin,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  WifiOff,
  RefreshCw,
  SearchX,
  LocateOff,
  Sprout,
} from 'lucide-react';
import { LanguageCode } from '../types/kisan';

interface ScreenMockupsGalleryProps {
  language: LanguageCode;
  isOfflineSimulated: boolean;
  onToggleOfflineSim: () => void;
  onTriggerStateDemo: (
    state: 'loading' | 'no_results' | 'error' | 'location_denied' | 'normal'
  ) => void;
  onJumpToLiveScreen: (screen: 'home' | 'compare' | 'map' | 'buyer' | 'ledger') => void;
}

export const ScreenMockupsGallery: React.FC<ScreenMockupsGalleryProps> = ({
  isOfflineSimulated,
  onToggleOfflineSim,
  onTriggerStateDemo,
  onJumpToLiveScreen,
}) => {
  return (
    <div className="space-y-8">
      {/* Header & Interactive Interface State Tester */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142019]">
              Mobile Screen Mockups & Interface States
            </h1>
            <p className="text-sm text-[#4A5951] mt-1">
              Clear 375px mobile views of Home, Results Comparison, Buyer Details, Mandi Map, and
              Cost Breakdown. All values below are labeled <strong>Sample Data</strong>.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0F766E] shrink-0">
            Sample Data Showcase
          </span>
        </div>

        {/* Interactive State Triggers for Live Testing */}
        <div className="pt-4 border-t border-stone-200 space-y-2.5">
          <div className="text-xs font-semibold text-[#142019]">
            Test Live Interface States in the App:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTriggerStateDemo('loading')}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#166534]" />
              <span>Preview Loading State</span>
            </button>
            <button
              type="button"
              onClick={() => onTriggerStateDemo('no_results')}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5"
            >
              <SearchX className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Preview No-Results State</span>
            </button>
            <button
              type="button"
              onClick={() => onTriggerStateDemo('error')}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Preview Error State</span>
            </button>
            <button
              type="button"
              onClick={onToggleOfflineSim}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 ${
                isOfflineSimulated
                  ? 'border-[#B45309] bg-amber-50 text-amber-950'
                  : 'border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 text-[#142019]'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5 text-[#B45309]" />
              <span>
                {isOfflineSimulated ? 'Exit Offline Preview' : 'Preview Offline Mode'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onTriggerStateDemo('location_denied')}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-300 bg-[#F7F8F5] hover:bg-stone-100 text-xs font-semibold text-[#142019] inline-flex items-center gap-1.5"
            >
              <LocateOff className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Preview Location Denied</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5 Mobile Mockup Frames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
        {/* MOCKUP 1: HOME SCREEN */}
        <article className="w-full max-w-[375px] bg-[#F7F8F5] border border-stone-300 rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[#142019]">KisanMargin</span>
            <span className="text-[11px] font-medium text-[#4A5951]">Sample Data · Mockup 1</span>
          </div>
          <div className="p-4 space-y-3.5 flex-1">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5">
              <div className="text-[11px] text-[#0F766E] font-medium">
                Sehore / Bhopal Belt · Sample Data
              </div>
              <h2 className="font-display text-lg font-bold text-[#142019] leading-snug">
                Compare what you actually take home, not just the mandi rate
              </h2>
              <button
                type="button"
                onClick={() => onJumpToLiveScreen('home')}
                className="w-full min-h-[44px] rounded-xl bg-[#166534] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <span>Compare selling options</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2">
              <div className="text-xs font-bold text-[#142019]">Select Crop (Sample Rates)</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-[#166534] bg-[#166534]/8">
                  <div className="font-semibold text-[#142019] flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-[#166534]" />
                    Wheat
                  </div>
                  <div className="font-mono text-[#166534] font-bold mt-0.5">₹2,465/qtl</div>
                </div>
                <div className="p-2.5 rounded-xl border border-stone-200 bg-[#F7F8F5]">
                  <div className="font-semibold text-[#142019]">Soybean</div>
                  <div className="font-mono text-[#4A5951] mt-0.5">₹4,680/qtl</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <div className="font-bold text-[#142019]">Recent Search · Sample Data</div>
              <div className="flex items-center justify-between text-[#142019]">
                <span>Wheat · 35 qtl · Sehore</span>
                <span className="font-mono font-bold text-[#166534]">₹81,420 net</span>
              </div>
              <div className="text-[11px] text-[#4A5951]">
                Local Snapshot: Sehore Modal ₹2,465/qtl · MSP ₹2,425/qtl
              </div>
            </div>
          </div>
        </article>

        {/* MOCKUP 2: RESULTS COMPARISON */}
        <article className="w-full max-w-[375px] bg-[#F7F8F5] border border-stone-300 rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[#142019]">Results Comparison</span>
            <span className="text-[11px] font-medium text-[#4A5951]">Sample Data · Mockup 2</span>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <div className="bg-white border border-[#166534] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#166534]">#1 Best Net Proceeds</span>
                <span className="text-[#0F766E]">Verified Sample</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display font-bold text-base text-[#142019]">
                    Sehore APMC Mandi
                  </div>
                  <div className="text-xs text-[#4A5951]">14 km · RTGS in 24–48 hrs</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-[#166534]">₹81,420</div>
                  <div className="text-[11px] font-mono text-[#4A5951]">₹2,326/qtl net</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                <div>
                  <div className="text-[#4A5951]">Listed</div>
                  <div className="font-mono font-semibold text-[#142019]">₹2,465/qtl</div>
                </div>
                <div>
                  <div className="text-[#4A5951]">Est. Costs</div>
                  <div className="font-mono font-semibold text-[#B45309]">-₹4,855</div>
                </div>
                <div>
                  <div className="text-[#4A5951]">Net Take-Home</div>
                  <div className="font-mono font-bold text-[#166534]">₹81,420</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#4A5951]">#2 Long Haul Mandi</span>
                <span className="text-[#B45309]">Top Listed Rate</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display font-bold text-sm text-[#142019]">
                    Indore Regional Mandi
                  </div>
                  <div className="text-xs text-[#4A5951]">158 km · Listed ₹2,550/qtl</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-[#142019]">₹78,105</div>
                  <div className="text-[11px] font-mono text-[#B45309]">-₹11,145 costs</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onJumpToLiveScreen('compare')}
              className="w-full min-h-[42px] rounded-xl border border-stone-300 bg-white text-xs font-semibold text-[#142019]"
            >
              Open Live Comparison Screen
            </button>
          </div>
        </article>

        {/* MOCKUP 3: BUYER DETAILS */}
        <article className="w-full max-w-[375px] bg-[#F7F8F5] border border-stone-300 rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[#142019]">Buyer Details</span>
            <span className="text-[11px] font-medium text-[#4A5951]">Sample Data · Mockup 3</span>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F766E]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Contact (Sample)</span>
              </div>
              <div>
                <div className="font-display font-bold text-base text-[#142019]">
                  Narmada Kisan FPO Center
                </div>
                <div className="text-xs text-[#4A5951]">
                  Mahesh Verma · FPO Manager (Sample)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F8F5] border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[#4A5951]">Listed Rate</div>
                  <div className="font-mono font-bold text-[#142019]">₹2,445/qtl</div>
                </div>
                <div className="text-right">
                  <div className="text-[#4A5951]">Est. Net Proceeds</div>
                  <div className="font-mono font-bold text-[#166534]">₹81,120</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="min-h-[42px] rounded-xl bg-[#166534] text-white text-xs font-semibold flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Buyer</span>
                </div>
                <div className="min-h-[42px] rounded-xl border border-stone-300 bg-white text-[#142019] text-xs font-semibold flex items-center justify-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#166534]" />
                  <span>Message</span>
                </div>
              </div>

              <div className="text-[11px] text-[#4A5951] space-y-1 pt-2 border-t border-stone-100">
                <div>
                  <strong className="text-[#142019]">Phone:</strong> +91 98260 41205
                </div>
                <div>
                  <strong className="text-[#142019]">Accepted Crops:</strong> Wheat, Soybean, Chana
                </div>
                <div>
                  <strong className="text-[#142019]">Business:</strong> Reg FPO · Digital moisture
                  meter · Zero mandi fee
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onJumpToLiveScreen('buyer')}
              className="w-full min-h-[42px] rounded-xl border border-stone-300 bg-white text-xs font-semibold text-[#142019]"
            >
              Open Live Buyer Details Sheet
            </button>
          </div>
        </article>

        {/* MOCKUP 4: MANDI MAP & LOCATION */}
        <article className="w-full max-w-[375px] bg-[#F7F8F5] border border-stone-300 rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[#142019]">Mandi Map & Route</span>
            <span className="text-[11px] font-medium text-[#4A5951]">Sample Data · Mockup 4</span>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <div className="bg-white border border-stone-200 rounded-2xl p-3 space-y-2.5">
              <div className="rounded-xl bg-[#F4F6F1] border border-stone-200 p-2">
                <svg viewBox="0 0 300 140" className="w-full h-auto block">
                  <circle cx="95" cy="85" r="45" fill="none" stroke="#CBD5C0" strokeDasharray="3 3" />
                  <line
                    x1="95"
                    y1="85"
                    x2="210"
                    y2="45"
                    stroke="#166534"
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                  />
                  <circle cx="95" cy="85" r="7" fill="#142019" stroke="#fff" strokeWidth="2" />
                  <text x="95" y="104" textAnchor="middle" className="fill-[#142019] text-[10px] font-semibold">
                    Your Farm (Sehore)
                  </text>
                  <circle cx="210" cy="45" r="9" fill="#166534" stroke="#fff" strokeWidth="2" />
                  <text x="210" y="30" textAnchor="middle" className="fill-[#142019] text-[10px] font-bold">
                    Sehore APMC (14 km)
                  </text>
                </svg>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-display font-bold text-[#142019]">Sehore APMC Mandi</div>
                <p className="text-[11px] text-[#4A5951] flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                  <span>Krishi Upaj Mandi Yard, Bhopal-Indore Rd, Sehore, MP 466001</span>
                </p>
                <div className="text-[11px] text-[#4A5951]">
                  14 km (~28 min) · Via SH-18
                </div>
              </div>

              <div className="min-h-[42px] rounded-xl bg-[#166534] text-white text-xs font-semibold flex items-center justify-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onJumpToLiveScreen('map')}
              className="w-full min-h-[42px] rounded-xl border border-stone-300 bg-white text-xs font-semibold text-[#142019]"
            >
              Open Live Mandi Map Screen
            </button>
          </div>
        </article>

        {/* MOCKUP 5: COST BREAKDOWN */}
        <article className="w-full max-w-[375px] bg-[#F7F8F5] border border-stone-300 rounded-3xl overflow-hidden flex flex-col">
          <div className="bg-white px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-[#142019]">Cost Breakdown</span>
            <span className="text-[11px] font-medium text-[#4A5951]">Sample Data · Mockup 5</span>
          </div>
          <div className="p-4 space-y-3 flex-1">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="font-display font-bold text-sm text-[#142019]">
                Sehore APMC · 35 qtl Wheat
              </div>
              <div className="divide-y divide-stone-100">
                <div className="py-1.5 flex justify-between">
                  <span>Listed × Qty (₹2,465 × 35)</span>
                  <span className="font-mono font-semibold">₹86,275</span>
                </div>
                <div className="py-1.5 flex justify-between text-[#B45309]">
                  <span>Transport (14 km tractor)</span>
                  <span className="font-mono">-₹898</span>
                </div>
                <div className="py-1.5 flex justify-between text-[#B45309]">
                  <span>Commission (0.5%)</span>
                  <span className="font-mono">-₹431</span>
                </div>
                <div className="py-1.5 flex justify-between text-[#B45309]">
                  <span>Quality Cut (13.5% moisture)</span>
                  <span className="font-mono">-₹1,618</span>
                </div>
                <div className="py-1.5 flex justify-between text-[#B45309]">
                  <span>Other Fees (Mandi 1.5%, Hammali)</span>
                  <span className="font-mono">-₹1,908</span>
                </div>
              </div>
              <div className="pt-2 border-t-2 border-stone-300 flex justify-between items-baseline">
                <span className="font-bold text-[#142019]">Estimated Net Proceeds</span>
                <span className="font-mono text-base font-bold text-[#166534]">₹81,420</span>
              </div>
              <div className="text-[10px] text-[#4A5951]">
                Source: Agmarknet Sample · Estimate only, not guaranteed.
              </div>
            </div>

            <button
              type="button"
              onClick={() => onJumpToLiveScreen('ledger')}
              className="w-full min-h-[42px] rounded-xl border border-stone-300 bg-white text-xs font-semibold text-[#142019]"
            >
              Open Live Cost Ledger
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

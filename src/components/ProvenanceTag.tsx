import React from 'react';
import { ShieldCheck, Calculator, UserCheck } from 'lucide-react';
import { DataProvenance } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';

interface ProvenanceTagProps {
  provenance: DataProvenance;
  t: TranslationStrings;
  detail?: string;
}

/**
 * Unboxed inline provenance marker (no pill boxes or capsule badges).
 * Uses clear text + icon to distinguish Verified Benchmark vs Estimate vs User Input.
 */
export const ProvenanceTag: React.FC<ProvenanceTagProps> = ({ provenance, t, detail }) => {
  if (provenance === 'verified') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F766E]">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{t.provenanceVerified}</span>
        {detail && (
          <>
            <span aria-hidden="true" className="text-stone-400">
              ·
            </span>
            <span className="text-[#4A5951] font-normal">{detail}</span>
          </>
        )}
      </span>
    );
  }

  if (provenance === 'user_input') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#142019]">
        <UserCheck className="w-3.5 h-3.5 shrink-0 text-[#166534]" aria-hidden="true" />
        <span>{t.provenanceUser}</span>
        {detail && (
          <>
            <span aria-hidden="true" className="text-stone-400">
              ·
            </span>
            <span className="text-[#4A5951] font-normal">{detail}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B45309]">
      <Calculator className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{t.provenanceEstimate}</span>
      {detail && (
        <>
          <span aria-hidden="true" className="text-stone-400">
            ·
          </span>
          <span className="text-[#4A5951] font-normal">{detail}</span>
        </>
      )}
    </span>
  );
};

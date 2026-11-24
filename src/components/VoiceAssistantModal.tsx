import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { CropGrade, LanguageCode, VoiceParseResult } from '../types/kisan';
import { TranslationStrings } from '../i18n/translations';
import { CROPS, REGIONS } from '../data/cropsAndMarkets';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  t: TranslationStrings;
  isOffline: boolean;
  onApplyParsed: (parsed: VoiceParseResult) => void;
}

const SAMPLE_PHRASES: { lang: string; text: string }[] = [
  {
    lang: 'हिन्दी',
    text: 'मेरे पास 40 क्विंटल गेहूं है, सीहोर मंडी के पास, नमी 14 प्रतिशत है',
  },
  {
    lang: 'मराठी',
    text: 'माझ्याकडे नाशिक जिल्ह्यात 30 क्विंटल कांदा आहे, प्रत A आणि ओलावा 11 टक्के',
  },
  {
    lang: 'ਪੰਜਾਬੀ',
    text: 'ਮੇਰੇ ਕੋਲ ਖੰਨਾ ਮੰਡੀ ਕੋਲ 50 ਕੁਇੰਟਲ ਝੋਨਾ ਹੈ, ਨਮੀ 18.5 ਪ੍ਰਤੀਸ਼ਤ ਹੈ',
  },
  {
    lang: 'తెలుగు',
    text: 'నా దగ్గర నిజామాబాద్‌లో 35 క్వింటాళ్ల మొక్కజొన్న ఉంది, తేమ 16 శాతం',
  },
];

// Local deterministic parser fallback so voice/phrase extraction + review works even offline or without API key
function parseCropPhraseLocally(phrase: string): VoiceParseResult {
  const lower = phrase.toLowerCase();

  let cropId: string | undefined;
  const cropKeywords: Record<string, string[]> = {
    wheat: ['wheat', 'गेहूं', 'गहू', 'ਕਣਕ', 'గోధుమ'],
    soybean: ['soybean', 'soya', 'सोयाबीन', 'ਸੋਇਆਬੀਨ', 'సోయాబీన్'],
    paddy: ['paddy', 'rice', 'dhan', 'धान', 'भात', 'ਝੋਨਾ', 'వరి'],
    mustard: ['mustard', 'सरसों', 'मोहरी', 'ਸਰ੍ਹੋਂ', 'ఆవాలు'],
    chana: ['chana', 'gram', 'चना', 'हरभरा', 'ਛੋਲੇ', 'శనగ'],
    cotton: ['cotton', 'kapas', 'कपास', 'कापूस', 'ਨਰਮਾ', 'పత్తి'],
    onion: ['onion', 'प्याज', 'कांदा', 'ਪਿਆਜ਼', 'ఉల్లి'],
    maize: ['maize', 'corn', 'मक्का', 'मका', 'ਮੱਕੀ', 'మొక్కజొన్న'],
  };
  for (const [id, kws] of Object.entries(cropKeywords)) {
    if (kws.some((kw) => lower.includes(kw))) {
      cropId = id;
      break;
    }
  }

  let regionId: string | undefined;
  const regionKeywords: Record<string, string[]> = {
    sehore_mp: ['sehore', 'bhopal', 'सीहोर', 'भोपाल'],
    indore_mp: ['indore', 'ujjain', 'dewas', 'malwa', 'इंदौर', 'उज्जैन'],
    nashik_mh: ['nashik', 'niphad', 'lasalgaon', 'नाशिक', 'नासिक'],
    latur_mh: ['latur', 'solapur', 'marathwada', 'लातूर'],
    ludhiana_pb: ['ludhiana', 'khanna', 'samrala', 'punjab', 'ਖੰਨਾ', 'ਲੁਧਿਆਣਾ'],
    nizamabad_tg: ['nizamabad', 'armoor', 'karimnagar', 'నిజామాబాద్', 'ఆర్మూర్'],
  };
  for (const [id, kws] of Object.entries(regionKeywords)) {
    if (kws.some((kw) => lower.includes(kw))) {
      regionId = id;
      break;
    }
  }

  let quantityQuintals: number | undefined;
  const qtyMatch = phrase.match(/(\d+(?:\.\d+)?)\s*(?:qtl|quintal|quintals|क्विंटल|क्विंटल|ਕੁਇੰਟਲ|క్వింటాళ్ల|క్వింటాల్|ton|tonnes|kg)/i);
  if (qtyMatch) {
    const num = Number(qtyMatch[1]);
    if (num > 0) {
      if (/ton/i.test(qtyMatch[0])) {
        quantityQuintals = Math.round(num * 10);
      } else if (/kg/i.test(qtyMatch[0])) {
        quantityQuintals = Math.max(1, Math.round(num / 100));
      } else {
        quantityQuintals = num;
      }
    }
  }

  let moisturePct: number | undefined;
  const moistMatch = phrase.match(/(?:moisture|नमी|ओलावा|ਨਮੀ|తేమ)[^\d]{0,12}(\d+(?:\.\d+)?)/i) ??
    phrase.match(/(\d+(?:\.\d+)?)\s*(?:%|percent|प्रतिशत|टक्के|ਪ੍ਰਤੀਸ਼ਤ|శాతం)/i);
  if (moistMatch) {
    const val = Number(moistMatch[1]);
    if (val >= 5 && val <= 35) moisturePct = val;
  }

  let grade: CropGrade | undefined;
  if (/(?:grade\s*a|प्रत\s*a|ग्रेड\s*a|ਗ੍ਰੇਡ\s*a)/i.test(phrase)) grade = 'A';
  else if (/(?:grade\s*b|प्रत\s*b|ग्रेड\s*b|ਗ੍ਰੇਡ\s*b)/i.test(phrase)) grade = 'B';
  else if (/faq/i.test(phrase)) grade = 'FAQ';

  return {
    transcript: phrase,
    detectedLanguage: 'Auto-detected',
    cropId,
    regionId,
    quantityQuintals,
    moisturePct,
    grade,
    confidenceNote: 'Extracted locally — please review and correct any detail below before submitting.',
  };
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  t,
  isOffline,
  onApplyParsed,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<VoiceParseResult | null>(null);

  // Editable review state so farmer can fix misheard fields before submitting
  const [reviewCropId, setReviewCropId] = useState<string>('wheat');
  const [reviewRegionId, setReviewRegionId] = useState<string>('sehore_mp');
  const [reviewQty, setReviewQty] = useState<number>(35);
  const [reviewGrade, setReviewGrade] = useState<CropGrade>('FAQ');
  const [reviewMoisture, setReviewMoisture] = useState<number>(13.5);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setErrorMsg(null);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
  }, [isOpen]);

  const hydrateReviewFields = (res: VoiceParseResult) => {
    setParsedResult(res);
    if (res.cropId) setReviewCropId(res.cropId);
    if (res.regionId) setReviewRegionId(res.regionId);
    if (res.quantityQuintals) setReviewQty(res.quantityQuintals);
    if (res.grade) setReviewGrade(res.grade);
    if (res.moisturePct) setReviewMoisture(res.moisturePct);
  };

  if (!isOpen) return null;

  const startMicRecording = async () => {
    setErrorMsg(null);
    setParsedResult(null);

    if (isOffline) {
      setErrorMsg(
        'Voice transcription requires an internet connection. You can type or tap a sample phrase below offline.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          chunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await submitAudioBlob(blob, mimeType);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setErrorMsg(
        'Microphone access unavailable or blocked in browser. You can type or tap a sample phrase below.'
      );
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const submitAudioBlob = async (blob: Blob, mimeType: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1] || '');
        };
        reader.onerror = () => reject(new Error('Failed to read audio buffer'));
        reader.readAsDataURL(blob);
      });

      const resp = await fetch('/api/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType,
          uiLanguage: language,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErrorMsg(data.error || 'Could not process voice audio.');
      } else {
        hydrateReviewFields(data as VoiceParseResult);
        setTextInput(data.transcript || '');
      }
    } catch {
      setErrorMsg('Network error while contacting voice transcription service.');
    } finally {
      setIsProcessing(false);
    }
  };

  const submitTextParse = async (phrase: string) => {
    if (!phrase.trim()) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setParsedResult(null);

    if (isOffline) {
      hydrateReviewFields(parseCropPhraseLocally(phrase));
      setIsProcessing(false);
      return;
    }

    try {
      const resp = await fetch('/api/text-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: phrase,
          uiLanguage: language,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        // Fall back gracefully to local multilingual parser so farmer can still review & submit
        hydrateReviewFields(parseCropPhraseLocally(phrase));
      } else {
        hydrateReviewFields(data as VoiceParseResult);
      }
    } catch {
      hydrateReviewFields(parseCropPhraseLocally(phrase));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReview = () => {
    if (!parsedResult) return;
    onApplyParsed({
      ...parsedResult,
      cropId: reviewCropId,
      regionId: reviewRegionId,
      quantityQuintals: reviewQty,
      grade: reviewGrade,
      moisturePct: reviewMoisture,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-stone-200 p-5 sm:p-6 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="voice-modal-title"
              className="font-display text-lg font-bold text-[#142019]"
            >
              {t.voiceModalTitle}
            </h2>
            <p className="text-xs text-[#4A5951] mt-1">{t.voiceModalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeLabel}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-[#4A5951]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Microphone Action */}
        <div className="flex flex-col items-center justify-center py-4 bg-[#F7F8F5] border border-stone-200 rounded-2xl gap-3">
          {!isRecording ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={startMicRecording}
              className="min-h-[52px] px-6 py-3 rounded-xl bg-[#166534] hover:bg-[#14532D] disabled:opacity-60 text-white font-semibold text-sm flex items-center gap-2.5 transition-colors"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
              <span>{isProcessing ? t.processingAudio : t.startRecording}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopMicRecording}
              className="min-h-[52px] px-6 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold text-sm flex items-center gap-2.5 transition-colors"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{t.stopRecording}</span>
            </button>
          )}
        </div>

        {/* Text Input Fallback / Edit */}
        <div className="space-y-2">
          <label
            htmlFor="voice-text-input"
            className="block text-xs font-medium text-[#4A5951]"
          >
            {t.orTypePhrase}
          </label>
          <div className="flex gap-2">
            <input
              id="voice-text-input"
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. 35 quintal wheat near Sehore, moisture 14%"
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-stone-300 text-sm text-[#142019]"
            />
            <button
              type="button"
              disabled={isProcessing || !textInput.trim()}
              onClick={() => submitTextParse(textInput)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#142019] hover:bg-stone-800 disabled:opacity-50 text-white text-sm font-medium whitespace-nowrap shrink-0"
            >
              {t.parseTextBtn}
            </button>
          </div>
        </div>

        {/* Multilingual Sample Phrases */}
        <div className="space-y-2">
          <span className="block text-xs font-medium text-[#4A5951]">
            {t.trySamplePhrases}
          </span>
          <div className="space-y-1.5">
            {SAMPLE_PHRASES.map((sample) => (
              <button
                key={sample.lang}
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setTextInput(sample.text);
                  submitTextParse(sample.text);
                }}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-stone-200 bg-[#F7F8F5] hover:bg-stone-100 text-left text-xs text-[#142019] transition-colors"
              >
                <span className="font-semibold text-[#166534] mr-2">{sample.lang}:</span>
                <span>{sample.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Box */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B45309]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Editable Review Step Before Submitting */}
        {parsedResult && (
          <div className="p-4 rounded-xl border border-[#166534]/40 bg-[#166534]/5 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-[#4A5951]">
              <span className="font-bold text-[#142019]">{t.reviewBeforeApply}</span>
              <span>{parsedResult.detectedLanguage}</span>
            </div>

            <p className="text-xs text-[#4A5951]">{parsedResult.confidenceNote}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#4A5951] mb-1">
                  {t.selectCropLabel}
                </label>
                <select
                  value={reviewCropId}
                  onChange={(e) => setReviewCropId(e.target.value)}
                  className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-sm text-[#142019]"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.names[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#4A5951] mb-1">
                  {t.quantityLabel} ({t.quintalsUnit})
                </label>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={reviewQty}
                  onChange={(e) => setReviewQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-sm font-mono tabular-nums text-[#142019]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-[#4A5951] mb-1">
                  {t.regionLabel}
                </label>
                <select
                  value={reviewRegionId}
                  onChange={(e) => setReviewRegionId(e.target.value)}
                  className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-sm text-[#142019]"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.localizedName[language]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#4A5951] mb-1">
                  {t.gradeLabel}
                </label>
                <select
                  value={reviewGrade}
                  onChange={(e) => setReviewGrade(e.target.value as CropGrade)}
                  className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-sm text-[#142019]"
                >
                  <option value="A">{t.gradeA}</option>
                  <option value="FAQ">{t.gradeFAQ}</option>
                  <option value="B">{t.gradeB}</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#4A5951] mb-1">
                  {t.moistureLabel}
                </label>
                <input
                  type="number"
                  min={5}
                  max={35}
                  step={0.5}
                  value={reviewMoisture}
                  onChange={(e) =>
                    setReviewMoisture(Math.min(35, Math.max(5, Number(e.target.value) || 12)))
                  }
                  className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-sm font-mono tabular-nums text-[#142019]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmReview}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{t.confirmAndApplyBtn}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

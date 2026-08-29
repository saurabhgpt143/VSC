import React, { useState, useMemo } from 'react';
import { SymptomItem, BodyRegion } from '../types';
import { SYMPTOMS_DATABASE, BODY_REGIONS_CONFIG } from '../data/symptomsData';
import { Search, AlertTriangle, Plus, Check, X, Sparkles, MapPin, Filter } from 'lucide-react';

interface SymptomSelectorProps {
  selectedRegion: BodyRegion | null;
  onSelectRegion: (region: BodyRegion | null) => void;
  selectedSymptoms: SymptomItem[];
  onToggleSymptom: (symptom: SymptomItem) => void;
  language: 'en' | 'hi';
}

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedRegion,
  onSelectRegion,
  selectedSymptoms,
  onToggleSymptom,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRedFlagsOnly, setFilterRedFlagsOnly] = useState(false);
  const [filterVrindavanCommonOnly, setFilterVrindavanCommonOnly] = useState(false);

  const isHindi = language === 'hi';

  const selectedSymptomIds = useMemo(
    () => new Set(selectedSymptoms.map((s) => s.id)),
    [selectedSymptoms]
  );

  const currentRegionConfig = useMemo(
    () => (selectedRegion ? BODY_REGIONS_CONFIG.find((r) => r.id === selectedRegion) : null),
    [selectedRegion]
  );

  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS_DATABASE.filter((symptom) => {
      // Body region filter
      if (selectedRegion && symptom.bodyRegion !== selectedRegion) {
        return false;
      }

      // Red flag filter
      if (filterRedFlagsOnly && !symptom.isRedFlag) {
        return false;
      }

      // Vrindavan common filter
      if (filterVrindavanCommonOnly && !symptom.commonInVrindavanRegion) {
        return false;
      }

      // Search query filter (matches English name, Hindi name, description, or category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = symptom.name.toLowerCase().includes(q);
        const matchesHindi = symptom.hindiName.toLowerCase().includes(q);
        const matchesDesc = symptom.description.toLowerCase().includes(q);
        const matchesCategory = symptom.category.toLowerCase().includes(q);
        return matchesName || matchesHindi || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [selectedRegion, filterRedFlagsOnly, filterVrindavanCommonOnly, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col h-full">
      {/* Header & Active Region Bar */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isHindi ? 'लक्षण चुनें' : 'Select Symptoms'}
            </h3>
            {selectedSymptoms.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedSymptoms.length} {isHindi ? 'चयनित' : 'selected'}
              </span>
            )}
          </div>

          {selectedRegion && (
            <button
              type="button"
              onClick={() => onSelectRegion(null)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
            >
              <span>{isHindi ? 'सभी अंग देखें' : 'View all body regions'}</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Active Region Pill indicator if filtered */}
        {currentRegionConfig ? (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold text-slate-800">
                {isHindi ? currentRegionConfig.hindiLabel : currentRegionConfig.label}
              </span>
            </div>
            <span className="text-slate-500">
              {filteredSymptoms.length} {isHindi ? 'लक्षण उपलब्ध' : 'symptoms available'}
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-500">
            {isHindi
              ? 'शरीर मानचित्र से कोई अंग चुनें या नीचे दिए गए लक्षणों को खोजें'
              : 'Click any body part on the left map or search below'}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'लक्षण खोजें (उदा: सिरदर्द, बुखार, छाती में दर्द, उल्टी)...'
                : 'Search symptoms (e.g., headache, chest tightness, fever)...'
            }
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Quick Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setFilterRedFlagsOnly(!filterRedFlagsOnly)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filterRedFlagsOnly
                ? 'bg-red-100 text-red-800 border border-red-200 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>{isHindi ? 'आपातकालीन खतरे (Red Flags)' : 'Emergency Red Flags'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterVrindavanCommonOnly(!filterVrindavanCommonOnly)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              filterVrindavanCommonOnly
                ? 'bg-amber-100 text-amber-900 border border-amber-200 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent'
            }`}
          >
            <MapPin className="w-3 h-3 text-amber-600" />
            <span>{isHindi ? 'वर्तमान स्थान में आम लक्षण' : 'Common in Current Location'}</span>
          </button>
        </div>
      </div>

      {/* Selected Symptoms Chips Shelf */}
      {selectedSymptoms.length > 0 && (
        <div className="py-2.5 border-b border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            {isHindi ? 'चयनित लक्षण सूची' : 'Selected Symptoms List'} ({selectedSymptoms.length})
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shadow-xs transition-all ${
                  symptom.isRedFlag
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                {symptom.isRedFlag && <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />}
                <span className="truncate max-w-[180px] sm:max-w-[220px]">
                  {isHindi ? symptom.hindiName : symptom.name}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleSymptom(symptom)}
                  className="p-0.5 text-slate-400 hover:text-slate-700 rounded-sm hover:bg-black/5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Symptoms List Stream */}
      <div className="flex-1 overflow-y-auto pr-1 mt-2 space-y-2 min-h-[260px] max-h-[460px]">
        {filteredSymptoms.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 text-slate-500">
            <Filter className="w-8 h-8 text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-slate-700">
              {isHindi ? 'कोई लक्षण नहीं मिला' : 'No matching symptoms found'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {isHindi
                ? 'कृपया खोज शब्द बदलें या दूसरा शारीरिक अंग चुनें।'
                : 'Try adjusting your search terms or clearing region filters.'}
            </p>
          </div>
        ) : (
          filteredSymptoms.map((symptom) => {
            const isSelected = selectedSymptomIds.has(symptom.id);
            return (
              <div
                key={symptom.id}
                onClick={() => onToggleSymptom(symptom)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900">
                        {isHindi ? symptom.hindiName : symptom.name}
                      </span>
                      {symptom.isRedFlag && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-md border border-red-200">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {isHindi ? 'गंभीर / रेड फ्लैग' : 'Red Flag'}
                        </span>
                      )}
                      {symptom.commonInVrindavanRegion && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-medium rounded-md">
                          <MapPin className="w-2.5 h-2.5 text-amber-700" />
                          {isHindi ? 'क्षेत्रीय' : 'Regional'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isHindi && symptom.hindiDescription
                        ? symptom.hindiDescription
                        : symptom.description}
                    </p>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

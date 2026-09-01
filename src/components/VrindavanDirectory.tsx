import React, { useState, useEffect } from 'react';
import { VRINDAVAN_FACILITIES, VRINDAVAN_EMERGENCY_HOTLINES, VRINDAVAN_LOCATION_ZONES } from '../data/vrindavanFacilities';
import { LocationHealthZone, PrevalentConditionItem } from '../types';
import {
  Building2,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  HeartHandshake,
  Activity,
  X,
  AlertTriangle,
  Flame,
  Bug,
  Utensils,
  Stethoscope,
  ShieldAlert,
  Compass,
  CheckCircle2,
  HelpCircle,
  Eye,
  Info,
  Navigation,
  Loader2
} from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';

interface VrindavanDirectoryProps {
  language: 'en' | 'hi';
  onClose?: () => void;
  onSelectSymptomTopic?: (symptomName: string) => void;
}

export const VrindavanDirectory: React.FC<VrindavanDirectoryProps> = ({
  language,
  onClose,
  onSelectSymptomTopic,
}) => {
  const isHindi = language === 'hi';
  const [mainTab, setMainTab] = useState<'locations_prevalent' | 'facilities' | 'hotlines'>('locations_prevalent');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('jabalpur_narmada_valley');
  const [facilityTypeTab, setFacilityTypeTab] = useState<'all' | 'hospital' | 'emergency' | 'pharmacy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [detectedZoneName, setDetectedZoneName] = useState<string | null>('Jabalpur & Narmada River Basin');

  // Haversine distance calculator (km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMessage(
        isHindi
          ? 'आपके ब्राउज़र में जीपीएस लोकेशन सेवा समर्थित नहीं है।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsLocating(true);
    setLocationStatusMessage(
      isHindi ? 'वर्तमान लोकेशन प्राप्त की जा रही है...' : 'Retrieving current GPS location...'
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setUserCoordinates({ lat: userLat, lng: userLng, accuracy });

        // Calculate nearest regional zone
        let nearestZone = VRINDAVAN_LOCATION_ZONES[0];
        let minDistance = Infinity;

        VRINDAVAN_LOCATION_ZONES.forEach((zone) => {
          if (zone.latitude && zone.longitude) {
            const dist = calculateDistance(userLat, userLng, zone.latitude, zone.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              nearestZone = zone;
            }
          }
        });

        setIsLocating(false);
        setSelectedZoneId(nearestZone.id);
        setMainTab('locations_prevalent');
        setDetectedZoneName(isHindi ? nearestZone.hindiName : nearestZone.name);

        const distStr = minDistance.toFixed(1);
        setLocationStatusMessage(
          isHindi
            ? `सफलतापूर्वक लोकेशन खोजी गई! आप '${isHindi ? nearestZone.hindiName : nearestZone.name}' क्षेत्र (अनुमानित दूरी: ${distStr} किमी) के सबसे निकट हैं।`
            : `Current location resolved! Closest profile is ${nearestZone.name} (~${distStr} km away).`
        );
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = isHindi ? 'लोकेशन प्राप्त करने में असमर्थ।' : 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = isHindi
            ? 'लोकेशन अनुमति अस्वीकृत कर दी गई है। कृपया ब्राउज़र में जीपीएस अनुमति दें या नीचे दी गई सूची से अपना क्षेत्र चुनें।'
            : 'Location permission was denied. Please allow location access or select your area manually below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = isHindi
            ? 'लोकेशन की जानकारी अनुपलब्ध है। कृपया मैन्युअल रूप से क्षेत्र चुनें।'
            : 'Location information is unavailable. Please select your area manually below.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = isHindi
            ? 'लोकेशन अनुरोध का समय समाप्त हो गया। कृपया पुनः प्रयास करें।'
            : 'Location request timed out. Please try again.';
        }
        setLocationStatusMessage(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Filtered zones
  const activeZones = selectedZoneId === 'all'
    ? VRINDAVAN_LOCATION_ZONES
    : VRINDAVAN_LOCATION_ZONES.filter((z) => z.id === selectedZoneId);

  // Filtered facilities
  const filteredFacilities = VRINDAVAN_FACILITIES.filter((facility) => {
    if (facilityTypeTab === 'hospital' && facility.type !== 'Hospital' && facility.type !== 'Charitable Mission' && facility.type !== 'Medical College') {
      return false;
    }
    if (facilityTypeTab === 'emergency' && !facility.hasEmergency24x7) {
      return false;
    }
    if (facilityTypeTab === 'pharmacy' && facility.type !== '24x7 Pharmacy') {
      return false;
    }
    if (selectedZoneId !== 'all') {
      const currentZone = VRINDAVAN_LOCATION_ZONES.find((z) => z.id === selectedZoneId);
      if (currentZone && !currentZone.recommendedFacilityIds.includes(facility.id)) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = facility.name.toLowerCase().includes(q);
      const matchHindi = facility.hindiName.toLowerCase().includes(q);
      const matchAddr = facility.address.toLowerCase().includes(q);
      const matchServices = facility.services.some((s) => s.toLowerCase().includes(q));
      const matchZone = facility.zone ? facility.zone.toLowerCase().includes(q) : false;
      return matchName || matchHindi || matchAddr || matchServices || matchZone;
    }

    return true;
  });

  const getCategoryIcon = (category: PrevalentConditionItem['category']) => {
    switch (category) {
      case 'Gastrointestinal':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Vector-Borne / Fever':
        return <Bug className="w-4 h-4 text-purple-600" />;
      case 'Heat & Exertion':
        return <Flame className="w-4 h-4 text-orange-600" />;
      case 'Zoonotic / Bite':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'Respiratory / Allergy':
        return <Activity className="w-4 h-4 text-sky-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-600" />;
    }
  };

  const getPrevalenceBadge = (level: PrevalentConditionItem['prevalenceLevel']) => {
    switch (level) {
      case 'High':
        return (
          <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
            {isHindi ? 'उच्च व्यापकता (High Risk)' : 'High Prevalence'}
          </span>
        );
      case 'Seasonal Alert':
        return (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md animate-pulse">
            {isHindi ? 'मौसमी चेतावनी (Seasonal Alert)' : 'Seasonal Alert'}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
            {isHindi ? 'मध्यम प्रसार (Moderate)' : 'Moderate'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-sm">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isHindi ? 'लोकेशन एवं स्थानिक स्वास्थ्य निर्देशिका' : 'Location Health & Facility Directory'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                {isHindi
                  ? 'आपके वर्तमान स्थान (जबलपुर / चयनित क्षेत्र) में प्रचलित बीमारियां, स्वास्थ्य जोखिम, बचाव निर्देश व नजदीकी अस्पताल'
                  : 'Real-time prevalent conditions, environmental risks, prevention protocols, and verified medical facilities for your current location'}
              </p>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all shrink-0"
            title={isHindi ? 'बंद करें' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Emergency Hotlines Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {VRINDAVAN_EMERGENCY_HOTLINES.map((hotline, idx) => (
          <div
            key={idx}
            className="bg-red-50/70 border border-red-200/80 rounded-2xl p-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                  {hotline.type}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
              </div>
              <div className="text-lg font-black text-red-900 mt-0.5">{hotline.number}</div>
              <div className="text-[11px] font-bold text-slate-800 line-clamp-1">
                {isHindi ? hotline.hindiName : hotline.name}
              </div>
            </div>

            <a
              href={`tel:${hotline.number}`}
              className="mt-2 inline-flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-95"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{isHindi ? 'डायल' : 'Call'} {hotline.number}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Primary Section Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMainTab('locations_prevalent')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all ${
              mainTab === 'locations_prevalent'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📍 {isHindi ? 'क्षेत्रवार प्रचलित बीमारियां' : 'Prevalent Conditions by Location'}
          </button>
          <button
            type="button"
            onClick={() => setMainTab('facilities')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all ${
              mainTab === 'facilities'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏥 {isHindi ? 'अस्पताल व स्वास्थ्य केंद्र' : 'Medical Facilities & Hospitals'}
          </button>
        </div>

        {/* Location Zone Dropdown / Quick Filter + GPS button */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
            title={isHindi ? 'वर्तमान जीपीएस स्थान खोजें' : 'Auto-detect current location via GPS'}
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-blue-100" />
            )}
            <span>{isLocating ? (isHindi ? 'खोज रहे हैं...' : 'Locating...') : (isHindi ? 'वर्तमान स्थान (GPS)' : 'Auto-Detect Location')}</span>
          </button>

          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden md:inline">
              {isHindi ? 'या चुनें:' : 'Or:'}
            </span>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="all">{isHindi ? '📍 सभी क्षेत्र (All Monitored Regions)' : '📍 All Regions & Zones'}</option>
              {VRINDAVAN_LOCATION_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {isHindi ? zone.hindiName : zone.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GPS Location Status Alert if active */}
      {locationStatusMessage && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-xs text-blue-950 transition-all">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{locationStatusMessage}</p>
              {userCoordinates && (
                <p className="text-[11px] text-blue-700 mt-0.5">
                  GPS Coordinates: Lat {userCoordinates.lat.toFixed(5)}°, Lng {userCoordinates.lng.toFixed(5)}°
                  {userCoordinates.accuracy ? ` (Accuracy: ±${Math.round(userCoordinates.accuracy)}m)` : ''}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocationStatusMessage(null)}
            className="text-blue-500 hover:text-blue-800 p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* VIEW 1: PREVALENT CONDITIONS BY LOCATION */}
      {mainTab === 'locations_prevalent' && (
        <div className="space-y-8">
          {/* Quick Location Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedZoneId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedZoneId === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isHindi ? 'सभी क्षेत्र' : 'All Areas'}
            </button>
            {VRINDAVAN_LOCATION_ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedZoneId === zone.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isHindi ? zone.hindiName.split('(')[0] : zone.name}
              </button>
            ))}
          </div>

          {/* Zones Render */}
          <div className="space-y-6">
            {activeZones.map((zone) => {
              const zoneFacilities = VRINDAVAN_FACILITIES.filter((f) =>
                zone.recommendedFacilityIds.includes(f.id)
              );

              return (
                <div
                  key={zone.id}
                  className="bg-slate-50/70 border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-5"
                >
                  {/* Zone Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {zone.areaType}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          📍 {isHindi ? zone.hindiLandmark : zone.landmark}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                        {isHindi ? zone.hindiName : zone.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {isHindi ? zone.hindiDescription : zone.description}
                      </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 md:max-w-xs shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{isHindi ? 'स्थानिक पर्यावरणीय जोखिम' : 'Environmental Risk Alert'}</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        {isHindi ? zone.hindiEnvironmentalRiskNote : zone.environmentalRiskNote}
                      </p>
                    </div>
                  </div>

                  {/* Conditions List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isHindi ? 'इस क्षेत्र में वर्तमान में प्रचलित रोग व लक्षण' : 'Currently Prevalent Health Conditions in this Area'}</span>
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {zone.currentPrevalentConditions.map((condition, cIdx) => {
                        const conditionKey = `${zone.id}-${cIdx}`;
                        const isExpanded = expandedCondition === conditionKey;

                        return (
                          <div
                            key={cIdx}
                            className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between space-y-3"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="p-1.5 bg-slate-100 rounded-lg">
                                    {getCategoryIcon(condition.category)}
                                  </span>
                                  <div>
                                    <span className="text-[10px] font-semibold text-slate-500 block">
                                      {condition.category}
                                    </span>
                                    <h5 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                                      {isHindi ? condition.hindiName : condition.name}
                                    </h5>
                                  </div>
                                </div>
                                {getPrevalenceBadge(condition.prevalenceLevel)}
                              </div>

                              {/* Trigger factor */}
                              <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100 mt-2">
                                <span className="font-bold text-slate-800">
                                  {isHindi ? 'कारण / ट्रिगर: ' : 'Local Trigger: '}
                                </span>
                                {isHindi ? condition.hindiTriggerFactor : condition.triggerFactor}
                              </div>

                              {/* Symptoms Badges */}
                              <div className="mt-3">
                                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                                  {isHindi ? 'प्रमुख लक्षण (Key Signs):' : 'Key Symptoms:'}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {condition.keySymptoms.map((sym, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="text-[11px] bg-blue-50/70 border border-blue-100 text-blue-900 font-medium px-2 py-0.5 rounded-lg"
                                    >
                                      {sym}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Prevention Tips */}
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <span className="text-[11px] font-bold text-emerald-800 block mb-1.5 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isHindi ? 'बचाव व सावधानी (Prevention):' : 'Prevention Protocol:'}</span>
                                </span>
                                <ul className="space-y-1">
                                  {(isHindi ? condition.hindiPreventionTips : condition.preventionTips).map((tip, tIdx) => (
                                    <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Immediate Action Alert */}
                            <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 text-xs text-rose-900">
                              <strong className="font-bold">{isHindi ? 'तुरंत क्या करें: ' : 'Immediate Action: '}</strong>
                              {condition.immediateAction}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Closest Recommended Facilities in this Zone */}
                  {zoneFacilities.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isHindi ? 'इस क्षेत्र के लिए निकटतम प्रमाणित चिकित्सा केंद्र' : 'Closest Verified Facilities for this Zone'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {zoneFacilities.map((fac) => (
                          <div
                            key={fac.id}
                            className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2 shadow-2xs"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-700 uppercase">{fac.type}</span>
                                {fac.hasEmergency24x7 && (
                                  <span className="text-[9px] font-black text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                    24x7 ER
                                  </span>
                                )}
                              </div>
                              <div className="font-bold text-xs sm:text-sm text-slate-900 mt-1">
                                {isHindi ? fac.hindiName : fac.name}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                {isHindi && fac.hindiAddress ? fac.hindiAddress : fac.address}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-slate-800">{fac.phone}</span>
                              <a
                                href={`tel:${fac.emergencyPhone || fac.phone}`}
                                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2.5 rounded-lg text-xs transition-all"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>{isHindi ? 'कॉल' : 'Call'}</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ALL MEDICAL FACILITIES */}
      {mainTab === 'facilities' && (
        <div className="space-y-6">
          {/* Filter tabs & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium w-full sm:w-auto">
              {[
                { id: 'all', label: isHindi ? 'सभी केंद्र' : 'All Facilities' },
                { id: 'hospital', label: isHindi ? 'अस्पताल व कॉलेज' : 'Hospitals' },
                { id: 'emergency', label: isHindi ? '24x7 इमरजेंसी' : '24x7 Emergency' },
                { id: 'pharmacy', label: isHindi ? 'फार्मेसी / दवा' : 'Pharmacies' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFacilityTypeTab(tab.id as any)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all ${
                    facilityTypeTab === tab.id
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-80">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'अस्पताल, सेवा या क्षेत्र खोजें...' : 'Search facility, service, or area...'}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
              <VoiceInputButton
                language={language}
                onTranscript={(text) => setSearchQuery(text)}
                tooltipText={isHindi ? 'माइक दबाकर अस्पताल या सेवा खोजें' : 'Speak to search facilities'}
              />
            </div>
          </div>

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                          {facility.type}
                        </span>
                        {facility.hasEmergency24x7 && (
                          <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200/60">
                            24x7 ER
                          </span>
                        )}
                        {facility.hasICU && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                            ICU Available
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1.5">
                        {isHindi ? facility.hindiName : facility.name}
                      </h3>
                      {facility.zone && (
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          📍 {facility.zone}
                        </div>
                      )}
                    </div>

                    {facility.verifiedGovtOrTrust && (
                      <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg shrink-0" title="Verified Govt/Trust">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Address & Distance note */}
                  <div className="text-xs text-slate-600 space-y-1 mt-2">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{isHindi && facility.hindiAddress ? facility.hindiAddress : facility.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pl-5">
                      <span>📍 {facility.distanceNote}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pl-5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{facility.timing}</span>
                    </div>
                  </div>

                  {/* Services Badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {facility.services.map((svc, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Phone & Dial Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Phone Contact</div>
                    <div className="font-bold text-slate-800">{facility.phone}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {facility.emergencyPhone && (
                      <a
                        href={`tel:${facility.emergencyPhone}`}
                        className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition-all active:scale-95"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{isHindi ? 'इमरजेंसी' : 'ER Line'}</span>
                      </a>
                    )}
                    <a
                      href={`tel:${facility.phone}`}
                      className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold py-2 px-3 rounded-xl text-xs border border-blue-200 transition-all active:scale-95"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{isHindi ? 'कॉल' : 'Call'}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


import { CropType, FieldZone, SampleLeafImage, SensorTelemetry, OutbreakPrediction } from '../types';

export const FIELD_ZONES: FieldZone[] = [
  {
    id: 'zone-alpha',
    name: 'Zone Alpha - High Density Greenhouse A',
    crop: 'Tomato',
    areaHectares: 2.4,
    sensorNodeId: 'node-iot-101',
    status: 'Critical',
    soilType: 'Loamy Peat Mix',
    irrigationType: 'Drip Line'
  },
  {
    id: 'zone-bravo',
    name: 'Zone Bravo - Open Field Pivot East',
    crop: 'Corn (Maize)',
    areaHectares: 14.8,
    sensorNodeId: 'node-iot-102',
    status: 'Warning',
    soilType: 'Silt Loam',
    irrigationType: 'Center Pivot'
  },
  {
    id: 'zone-charlie',
    name: 'Zone Charlie - Terrace Block Orchard',
    crop: 'Apple',
    areaHectares: 6.2,
    sensorNodeId: 'node-iot-103',
    status: 'Normal',
    soilType: 'Clay Loam',
    irrigationType: 'Micro-Sprinkler'
  },
  {
    id: 'zone-delta',
    name: 'Zone Delta - Basin Rice Paddies',
    crop: 'Rice',
    areaHectares: 18.0,
    sensorNodeId: 'node-iot-104',
    status: 'Warning',
    soilType: 'Heavy Clay Subsoil',
    irrigationType: 'Drip Line'
  }
];

export const SAMPLE_LEAVES: SampleLeafImage[] = [
  {
    id: 'sample-tomato-early-blight',
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    diseaseName: 'Early Blight',
    diseaseNameTa: 'ஆரம்ப இலைக்கருகல்',
    severity: 'Moderate',
    confidence: 0.94,
    pathogen: 'Fungal infection (Alternaria solani)',
    idealWeatherTrigger: 'High humidity (>85%), warm temps 24°C-29°C, wet leaves',
    description: 'Brown circular spots with concentric target rings and yellowing around affected areas.',
    symptoms: 'Brown circular spots and yellowing around affected areas.',
    symptomsTa: 'வட்ட வடிவ பழுப்பு புள்ளிகள் மற்றும் பாதிக்கப்பட்ட பகுதிகளை சுற்றி இலைகள் மஞ்சள் நிறமாக மாறுதல்.',
    cause: 'Fungal infection.',
    causeTa: 'பூஞ்சை தொற்று (அதிக ஈரப்பதம் மற்றும் சூடான காலநிலையில் பரவும் பூஞ்சை).',
    prevention: 'Remove infected leaves, maintain field hygiene and avoid prolonged leaf wetness.',
    preventionTa: 'பாதிக்கப்பட்ட இலைகளை அகற்றவும், வயலை சுத்தமாக வைத்திருக்கவும், இலைகளில் அதிக நேரம் தண்ணீர் தேங்குவதை தவிர்க்கவும்.',
    recommendedNextAction: 'Pluck lower diseased leaves and burn them outside the field. Spray organic Trichoderma viride or Mancozeb 75% WP (2g/L) today.',
    recommendedNextActionTa: 'கீழ் பகுதி பாதிக்கப்பட்ட இலைகளை கிள்ளி எரிக்கவும். இன்று டிரைக்கோடெர்மா விரிடி அல்லது மேன்கோசெப் தெளிக்கவும்.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gradTomato" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="70%" stop-color="#16a34a" />
          <stop offset="100%" stop-color="#14532d" />
        </radialGradient>
      </defs>
      <!-- Leaf outline -->
      <path d="M60 10 C 95 30 105 75 75 105 C 50 115 30 95 20 70 C 12 45 35 18 60 10 Z" fill="url(#gradTomato)" stroke="#15803d" stroke-width="2"/>
      <!-- Main veins -->
      <path d="M60 18 Q 55 60 48 102" stroke="#22c55e" stroke-width="2" fill="none" opacity="0.6"/>
      <path d="M57 45 Q 75 40 88 44" stroke="#22c55e" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M55 65 Q 32 60 25 68" stroke="#22c55e" stroke-width="1.5" fill="none" opacity="0.6"/>
      <!-- Necrotic Target Blight Lesions (Concentric Bullseye Spots) -->
      <circle cx="72" cy="50" r="14" fill="#facc15" opacity="0.4"/>
      <circle cx="72" cy="50" r="11" fill="#78350f" stroke="#b45309" stroke-width="2"/>
      <circle cx="72" cy="50" r="6" fill="#451a03" stroke="#d97706" stroke-width="1"/>
      <circle cx="72" cy="50" r="2" fill="#1c1917"/>
      <!-- Secondary spot -->
      <circle cx="38" cy="70" r="12" fill="#facc15" opacity="0.4"/>
      <circle cx="38" cy="70" r="9" fill="#78350f" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="38" cy="70" r="4" fill="#451a03"/>
      <ellipse cx="60" cy="85" rx="7" ry="10" fill="#78350f" opacity="0.85"/>
    </svg>`
  },
  {
    id: 'sample-rice-blast',
    crop: 'Rice',
    cropTa: 'நெல்',
    diseaseName: 'Leaf Blast',
    diseaseNameTa: 'இலைக் குலைநோய்',
    severity: 'High',
    confidence: 0.96,
    pathogen: 'Fungal infection (Magnaporthe oryzae)',
    idealWeatherTrigger: 'High relative humidity >90%, dew, 25°C-28°C',
    description: 'Spindle-shaped diamond spots with grey center and dark brown border that dry out the leaf blades.',
    symptoms: 'Spindle-shaped diamond spots with grey ash center and reddish-brown borders on leaves.',
    symptomsTa: 'இலைகளில் சாம்பல் நிற மையமும் பழுப்பு விளிம்பும் கொண்ட கண் வடிவப் புள்ளிகள்.',
    cause: 'Fungal infection.',
    causeTa: 'பூஞ்சை தொற்று (அதிக தழைச்சத்து மற்றும் பனிப்பொழிவால் பரவும் பூஞ்சை).',
    prevention: 'Avoid excessive nitrogen urea, maintain field drainage, and spray bio-agents or Tricyclazole.',
    preventionTa: 'அதிக யூரியா இடுவதை தவிர்க்கவும், வயலில் சீரான வடிகால் அமைக்கவும், ட்ரைசைக்ளசோல் தெளிக்கவும்.',
    recommendedNextAction: 'Drain excess standing water and spray Tricyclazole 75% WP (0.6g/L) or Pseudomonas fluorescens.',
    recommendedNextActionTa: 'வயல் நீரை வடித்துவிட்டு ட்ரைசைக்ளசோல் (0.6 கிராம்/லி) அல்லது சூடோமோனாஸ் தெளிக்கவும்.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 115 Q 55 50 85 10 Q 75 60 45 118 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
      <polygon points="58,35 66,45 58,55 50,45" fill="#e2e8f0" stroke="#991b1b" stroke-width="2"/>
      <polygon points="46,65 54,75 46,85 38,75" fill="#cbd5e1" stroke="#b91c1c" stroke-width="2"/>
      <polygon points="68,52 74,60 68,68 62,60" fill="#f1f5f9" stroke="#7f1d1d" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'sample-cotton-blight',
    crop: 'Cotton',
    cropTa: 'பருத்தி',
    diseaseName: 'Bacterial Blight',
    diseaseNameTa: 'பாக்டீரியா கருகல் நோய்',
    severity: 'Moderate',
    confidence: 0.92,
    pathogen: 'Bacterial infection (Xanthomonas citri pv. malvacearum)',
    idealWeatherTrigger: 'Warm rainy weather, high canopy humidity, 28°C-32°C',
    description: 'Angular water-soaked leaf spots restricted by leaf veins turning reddish-brown.',
    symptoms: 'Angular dark brown water-soaked spots bounded by leaf veins.',
    symptomsTa: 'இலை நரம்புகளுக்கு இடைப்பட்ட கோண வடிவ நீர் ஊறிய பழுப்பு புள்ளிகள்.',
    cause: 'Bacterial infection.',
    causeTa: 'பாக்டீரியா தொற்று (காற்று மற்றும் மழைத்துளிகள் மூலம் பரவுகிறது).',
    prevention: 'Use disease-free certified seeds, destroy infected crop residue, avoid overhead flood splashing.',
    preventionTa: 'சான்றளிக்கப்பட்ட விதைகளை பயன்படுத்தவும், பாதிக்கப்பட்ட இலைகளை அகற்றவும்.',
    recommendedNextAction: 'Spray Copper Oxychloride 50% WP (2.5g/L) mixed with Streptocycline (1g/10L water).',
    recommendedNextActionTa: 'காப்பர் ஆக்ஸிகுளோரைடு (2.5 கிராம்/லி) உடன் ஸ்ட்ரெப்டோமைசின் கலந்து தெளிக்கவும்.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gradCotton" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="70%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </radialGradient>
      </defs>
      <!-- Lobed cotton leaf -->
      <path d="M60 18 Q 78 28 85 45 Q 98 50 102 70 Q 88 80 75 92 Q 60 108 50 92 Q 35 80 20 68 Q 25 50 36 44 Q 45 28 60 18 Z" fill="url(#gradCotton)" stroke="#166534" stroke-width="2"/>
      <path d="M60 22 L 58 98" stroke="#bbf7d0" stroke-width="1.5" opacity="0.6"/>
      <!-- Angular vein-bound spots -->
      <polygon points="50,45 62,42 60,52 48,50" fill="#78350f" stroke="#b45309" stroke-width="1"/>
      <polygon points="70,55 82,58 78,68 68,64" fill="#78350f" stroke="#b45309" stroke-width="1"/>
      <polygon points="38,62 48,60 45,70 35,68" fill="#451a03" stroke="#92400e" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'sample-corn-blight',
    crop: 'Corn (Maize)',
    cropTa: 'மக்காச்சோளம்',
    diseaseName: 'Northern Corn Leaf Blight',
    diseaseNameTa: 'வடக்கு மக்காச்சோள இலைக்கருகல்',
    severity: 'Moderate',
    confidence: 0.91,
    pathogen: 'Fungal infection (Exserohilum turcicum)',
    idealWeatherTrigger: 'Moderate temp (18-27°C), heavy morning dew, high humidity',
    description: 'Distinct cigar-shaped, grayish-green to tan necrotic lesions parallel to leaf veins.',
    symptoms: 'Long cigar-shaped grayish-green to tan dry lesions along the leaf.',
    symptomsTa: 'இலையின் நரம்புகளுக்கு இணையாக சுருட்டு போன்ற நீள்வட்ட பழுப்பு காய்ந்த புள்ளிகள்.',
    cause: 'Fungal infection.',
    causeTa: 'பூஞ்சை தொற்று (காலை பனிப்பொழிவு மற்றும் ஈரப்பதத்தால் பரவுகிறது).',
    prevention: 'Rotate crops with non-grasses, deep ploughing of plant residues, and balanced potash application.',
    preventionTa: 'பயிர் சுழற்சி முறை பின்பற்றவும், நிலத்தை ஆழ உழவு செய்து பழைய தாள்களை அழிக்கவும்.',
    recommendedNextAction: 'Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin @ 1ml/L before lesion spreads to ear leaves.',
    recommendedNextActionTa: 'மேன்கோசெப் (2.5 கிராம்/லி) தெளித்து குருத்து இலைகளை பாதுகாக்கவும்.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradCorn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="60%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
      </defs>
      <path d="M20 105 Q 40 40 100 15 Q 85 65 35 112 Z" fill="url(#gradCorn)" stroke="#166534" stroke-width="2"/>
      <path d="M28 108 Q 50 55 95 20" stroke="#bbf7d0" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M42 65 Q 52 48 65 42 Q 58 55 48 70 Z" fill="#78350f" stroke="#d97706" stroke-width="1.5"/>
      <path d="M60 48 Q 72 32 82 28 Q 75 40 66 52 Z" fill="#92400e" stroke="#f59e0b" stroke-width="1"/>
      <path d="M30 85 Q 38 75 44 72 Q 39 82 33 89 Z" fill="#78350f" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'sample-potato-early-blight',
    crop: 'Potato',
    cropTa: 'உருளைக்கிழங்கு',
    diseaseName: 'Early Blight',
    diseaseNameTa: 'ஆரம்ப இலைக்கருகல்',
    severity: 'Moderate',
    confidence: 0.89,
    pathogen: 'Fungal infection (Alternaria solani)',
    idealWeatherTrigger: 'Alternating dry and wet periods, warm temps 24°C-29°C',
    description: 'Concentric ring target-like spots (bullseye pattern) surrounded by chlorotic yellow halo on older lower foliage.',
    symptoms: 'Target-board concentric brown rings with yellow halo on lower leaves.',
    symptomsTa: 'கீழ் இலைகளில் இலக்கு பலகை போன்ற வளைய பழுப்பு புள்ளிகள் மற்றும் மஞ்சள் விளிம்புகள்.',
    cause: 'Fungal infection.',
    causeTa: 'பூஞ்சை தொற்று (சூடான வறண்ட மற்றும் ஈரப்பதம் மாறி மாறி வரும் சூழலில் பரவும்).',
    prevention: 'Avoid sprinkler irrigation, space plants adequately, and harvest mature tubers properly.',
    preventionTa: 'தெளிப்பு பாசனத்தை தவிர்க்கவும், செடிகளுக்கு இடையே போதிய இடைவெளி விடவும்.',
    recommendedNextAction: 'Apply Chlorothalonil or Mancozeb 75% WP @ 2g/L. Keep soil moisture steady.',
    recommendedNextActionTa: 'மேன்கோசெப் (2 கிராம்/லி) தெளிக்கவும். நிலத்தில் சீரான ஈரப்பதம் பேணவும்.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gradPotato" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="85%" stop-color="#15803d" />
          <stop offset="100%" stop-color="#14532d" />
        </radialGradient>
      </defs>
      <path d="M60 15 C 90 20 105 50 95 85 C 80 110 40 112 25 85 C 15 55 30 20 60 15 Z" fill="url(#gradPotato)" stroke="#166534" stroke-width="2"/>
      <path d="M60 20 L 60 105" stroke="#86efac" stroke-width="2" opacity="0.5"/>
      <!-- Bullseye concentric lesions -->
      <circle cx="50" cy="50" r="16" fill="#facc15" opacity="0.3"/>
      <circle cx="50" cy="50" r="12" fill="#78350f" stroke="#b45309" stroke-width="2"/>
      <circle cx="50" cy="50" r="7" fill="#451a03" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="3" fill="#1c1917"/>
      <!-- Secondary spot -->
      <circle cx="78" cy="75" r="9" fill="#78350f" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="78" cy="75" r="5" fill="#451a03"/>
    </svg>`
  },
  {
    id: 'sample-apple-scab',
    crop: 'Apple',
    diseaseName: 'Apple Scab (Venturia inaequalis)',
    severity: 'Moderate',
    confidence: 0.923,
    pathogen: 'Ascomycete Fungus',
    idealWeatherTrigger: 'Frequent spring rainfall, cool damp foliage (15°C-20°C)',
    description: 'Olive-green to velvety dark brown lesions on adaxial leaf surface with puckered, distorted leaf margins.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="60" rx="42" ry="50" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <path d="M60 15 Q 58 60 55 108" stroke="#86efac" stroke-width="2"/>
      <ellipse cx="48" cy="45" rx="14" ry="9" fill="#365314" opacity="0.9"/>
      <ellipse cx="72" cy="65" rx="16" ry="11" fill="#365314" opacity="0.85"/>
      <ellipse cx="44" cy="78" rx="10" ry="7" fill="#1c1917" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'sample-rice-blast',
    crop: 'Rice',
    diseaseName: 'Rice Leaf Blast (Magnaporthe oryzae)',
    severity: 'Critical',
    confidence: 0.958,
    pathogen: 'Filamentous Ascomycete',
    idealWeatherTrigger: 'High nitrogen fertilization, ambient RH >92%, 25°C-28°C',
    description: 'Spindle-shaped diamond lesions with ash-grey center and dark reddish-brown margins that coalesce into blighting.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <!-- Elongated blade -->
      <path d="M30 115 Q 55 50 85 10 Q 75 60 45 118 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
      <!-- Diamond spindle lesions -->
      <polygon points="58,35 66,45 58,55 50,45" fill="#e2e8f0" stroke="#991b1b" stroke-width="2"/>
      <polygon points="46,65 54,75 46,85 38,75" fill="#cbd5e1" stroke="#b91c1c" stroke-width="2"/>
      <polygon points="68,52 74,60 68,68 62,60" fill="#f1f5f9" stroke="#7f1d1d" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: 'sample-healthy-corn',
    crop: 'Corn (Maize)',
    diseaseName: 'Healthy Vigorous Leaf (No Pathogen Detected)',
    severity: 'Low',
    confidence: 0.985,
    pathogen: 'Healthy',
    idealWeatherTrigger: 'Normal balanced transpiration, VPD 1.1 kPa',
    description: 'Uniform deep green chlorophyll distribution, clear venation, intact cuticle with zero necrotic lesions or fungal hyphae.',
    thumbnailSvg: `<svg viewBox="0 0 120 120" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradHealthy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="50%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
      </defs>
      <path d="M25 105 Q 45 40 95 18 Q 80 65 38 112 Z" fill="url(#gradHealthy)" stroke="#166534" stroke-width="2"/>
      <path d="M32 108 Q 52 55 90 22" stroke="#dcfce7" stroke-width="2.5" fill="none" opacity="0.8"/>
      <path d="M42 80 Q 56 68 70 65" stroke="#bbf7d0" stroke-width="1.2" fill="none" opacity="0.6"/>
      <path d="M55 58 Q 68 48 82 45" stroke="#bbf7d0" stroke-width="1.2" fill="none" opacity="0.6"/>
    </svg>`
  }
];

export const SENSOR_PRESETS: { name: string; description: string; values: Partial<SensorTelemetry> }[] = [
  {
    name: 'High Spore Risk (Warm & Saturated)',
    description: 'High humidity (>90%) with cool-warm temperatures creating optimal spore germination conditions.',
    values: {
      soilMoisturePercent: 78,
      ambientTempC: 19.5,
      canopyTempC: 18.2,
      relativeHumidityPercent: 93,
      vaporPressureDeficitKPa: 0.18, // very low VPD = leaf wetness doesn't evaporate
      leafWetnessDurationHours: 9.5,
      soilEc: 1.8,
      soilPh: 6.4
    }
  },
  {
    name: 'Heat Stress & Drought (Low Moisture)',
    description: 'High ambient temperature with dry air and deficient soil moisture, stressing plant defenses against spider mites.',
    values: {
      soilMoisturePercent: 24,
      ambientTempC: 34.8,
      canopyTempC: 36.2,
      relativeHumidityPercent: 32,
      vaporPressureDeficitKPa: 2.85,
      leafWetnessDurationHours: 0.5,
      soilEc: 2.6,
      soilPh: 7.2
    }
  },
  {
    name: 'Optimal Vegetative Window',
    description: 'Ideal transpiration conditions with balanced root zone moisture and safe VPD index.',
    values: {
      soilMoisturePercent: 55,
      ambientTempC: 23.0,
      canopyTempC: 22.4,
      relativeHumidityPercent: 62,
      vaporPressureDeficitKPa: 1.15,
      leafWetnessDurationHours: 1.2,
      soilEc: 1.5,
      soilPh: 6.6
    }
  },
  {
    name: 'Excessive Nitrogen / Lush Tissue Risk',
    description: 'Surplus nitrogen fertigation creating soft succulent tissue vulnerable to biotrophic rusts and blasts.',
    values: {
      soilMoisturePercent: 68,
      ambientTempC: 24.2,
      canopyTempC: 23.8,
      relativeHumidityPercent: 82,
      vaporPressureDeficitKPa: 0.58,
      leafWetnessDurationHours: 6.0,
      nitrogenPpm: 240,
      soilEc: 2.4,
      soilPh: 6.2
    }
  }
];

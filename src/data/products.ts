export interface Product {
  id: number;
  slug?: string;
  name: string;
  category: string;
  description: string;
  dosage: string;
  dosageType?: string;
  price?: number;
  availability?: string;
  features: string[];
  images: string[];
  detailedDescription?: string;
  composition?: string;
  indications?: string;
  dosageInstructions?: string;
  sideEffects?: string;
  precautions?: string;
  isQualityAssured?: boolean;
  isGmpCertified?: boolean;
  isWhoApproved?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Aster AD Vitamin Baby Massage Oil 170ml",
    category: "Pediatric Care",
    description: "Baby massage oil for growth and vigour of babies containing Vitamin A, D, E & Olive Oil",
    dosage: "170ml bottle",
    features: ["Vitamin Enriched", "Baby Safe Formula", "Natural Ingredients"],
    images: [
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127441/aster-medicines/products/ASTER_AD_170_ML_1.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127442/aster-medicines/products/ASTER_AD_170_ML_2.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127443/aster-medicines/products/ASTER_AD_170_ML_3.webp"
    ],
    detailedDescription: "Aster AD Vitamin is a specially formulated baby massage oil enriched with essential vitamins A, D, E and natural olive oil. This nourishing blend supports healthy growth and development in infants and young children.",
    composition: "Vitamin A, Vitamin D3, Vitamin E, Olive Oil, Light Liquid Paraffin",
    indications: "Daily massage for babies to promote healthy growth, bone development, and skin nourishment",
    dosageInstructions: "Apply adequate amount on baby's body and massage gently. Use daily after bath or as directed by physician.",
    precautions: "For external use only. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dry place."
  },
  {
    id: 2,
    name: "Sodium Bicarbonate Injection I.P.",
    category: "Emergency Medicine",
    description: "7.5% W/V Sodium Bicarbonate injection for medical emergency use",
    dosage: "25ml x 25 Ampoules",
    features: ["Emergency Use", "Sterile Solution", "Hospital Grade"],
    images: [
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127469/aster-medicines/products/Sodium_Bicarbonate_Injection_IP_7.5_1.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127470/aster-medicines/products/Sodium_Bicarbonate_Injection_IP_7.5_2.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127471/aster-medicines/products/Sodium_Bicarbonate_Injection_IP_7.5_3.webp"
    ],
    detailedDescription: "Sodium Bicarbonate Injection is used in emergency medicine for the treatment of metabolic acidosis and as an alkalinizing agent.",
    composition: "Sodium Bicarbonate 7.5% W/V in sterile water for injection",
    indications: "Treatment of metabolic acidosis, cardiac arrest protocols, hyperkalemia management",
    dosageInstructions: "As directed by physician. Administered intravenously under medical supervision.",
    sideEffects: "Hypernatremia, metabolic alkalosis, edema, hypocalcemia",
    precautions: "Use with caution in patients with renal impairment, heart failure, or hypertension. Monitor serum electrolytes."
  },
  {
    id: 3,
    name: "Dextrose Injection I.P.",
    category: "IV Solutions",
    description: "25% W/V Dextrose injection for intravenous administration",
    dosage: "25ml x 25 Ampoules",
    features: ["IV Administration", "Energy Source", "Sterile Preparation"],
    images: [
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127450/aster-medicines/products/DEXTROSE_INJECTION_IP_25pct_1.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127451/aster-medicines/products/DEXTROSE_INJECTION_IP_25pct_2.webp"
    ],
    detailedDescription: "Dextrose Injection provides a source of calories and fluid for patients requiring parenteral nutrition or fluid replacement.",
    composition: "Dextrose Monohydrate 25% W/V in sterile water for injection",
    indications: "Hypoglycemia treatment, fluid and calorie supplementation, vehicle for drug administration",
    dosageInstructions: "As prescribed by physician. Administered intravenously under medical supervision.",
    sideEffects: "Hyperglycemia, fluid overload, electrolyte imbalance",
    precautions: "Monitor blood glucose levels. Use with caution in diabetic patients."
  },
  {
    id: 4,
    name: "Frusemide Injection I.P. (UTRIX)",
    category: "Cardiovascular",
    description: "Utrix injection for diuretic therapy and fluid management",
    dosage: "2ml x 50 Ampoules",
    features: ["Diuretic Action", "Prescription Only", "Hospital Use"],
    images: [
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127456/aster-medicines/products/FRUSEMIDE_INJECTION_IP_1.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127457/aster-medicines/products/FRUSEMIDE_INJECTION_IP_2.webp"
    ],
    detailedDescription: "Frusemide is a potent loop diuretic used in the treatment of edema and hypertension.",
    composition: "Frusemide 20mg in 2ml sterile aqueous solution",
    indications: "Edema associated with heart failure, renal disease, hepatic disease; hypertension",
    dosageInstructions: "As prescribed by physician. Usual dose: 20-40mg by slow IV or IM injection.",
    sideEffects: "Electrolyte imbalance, dehydration, hypotension, ototoxicity",
    precautions: "Monitor electrolytes and renal function. Use with caution in patients with hepatic impairment."
  },
  {
    id: 5,
    name: "B-Codex Syrup",
    category: "Nutrition",
    description: "Vitamin B-Complex with Vitamin B12 & L-Lysine Syrup for prophylactic use",
    dosage: "200ml bottle",
    features: ["Vitamin B Complex", "L-Lysine Added", "Prophylactic Use"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127445/aster-medicines/products/B-CODEX_SYRUP.webp"],
    detailedDescription: "B-Codex Syrup is a comprehensive vitamin B complex supplement with added L-Lysine to support overall health and wellness.",
    composition: "Vitamin B1, B2, B6, B12, Nicotinamide, L-Lysine HCl",
    indications: "Vitamin B deficiency, nutritional supplementation, loss of appetite, convalescence",
    dosageInstructions: "Adults: 10-15ml twice daily. Children: 5-10ml twice daily or as directed by physician.",
    precautions: "Store in a cool, dry place. Shake well before use."
  },
  {
    id: 6,
    name: "Lu-Zyme Syrup",
    category: "Digestive Health",
    description: "Fungal Diastase & Pepsin Syrup - Mixed fruit flavoured digestive enzyme",
    dosage: "200ml bottle",
    features: ["Digestive Enzymes", "Mixed Fruit Flavor", "Digestive Aid"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127458/aster-medicines/products/LU-ZYME_SYRUP.webp"],
    detailedDescription: "Lu-Zyme Syrup is a digestive enzyme supplement that aids in the breakdown of proteins and carbohydrates for better digestion.",
    composition: "Fungal Diastase 50mg, Pepsin 10mg per 5ml",
    indications: "Indigestion, flatulence, loss of appetite, digestive disturbances",
    dosageInstructions: "Adults: 10ml three times daily after meals. Children: 5ml three times daily or as directed.",
    precautions: "Shake well before use. Keep out of reach of children."
  },
  {
    id: 7,
    name: "Ondansetron Injection I.P. (ON-2)",
    category: "Antiemetic",
    description: "ON-2 injection for prevention and treatment of nausea and vomiting",
    dosage: "2ml x 50 Ampoules",
    features: ["Antiemetic", "Hospital Grade", "Sterile Solution"],
    images: [
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127462/aster-medicines/products/ONDANSETRON_INJECTION_IP_1.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127464/aster-medicines/products/ONDANSETRON_INJECTION_IP_2.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127465/aster-medicines/products/ONDANSETRON_INJECTION_IP_3.webp"
    ],
    detailedDescription: "Ondansetron is a selective 5-HT3 receptor antagonist used to prevent nausea and vomiting caused by chemotherapy, radiation therapy, and surgery.",
    composition: "Ondansetron 4mg in 2ml sterile solution",
    indications: "Prevention of chemotherapy-induced nausea and vomiting, postoperative nausea and vomiting",
    dosageInstructions: "As prescribed by physician. Usual dose: 4-8mg by slow IV or IM injection.",
    sideEffects: "Headache, constipation, dizziness, fatigue",
    precautions: "Use with caution in patients with hepatic impairment or prolonged QT interval."
  },
  {
    id: 8,
    name: "Dextrose Injection I.P. 50%",
    category: "IV Solutions",
    description: "50% W/V Dextrose injection for intravenous administration",
    dosage: "25ml x 25 Ampoules",
    features: ["IV Administration", "Concentrated Energy Source", "Sterile Preparation"],
    images: [
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127452/aster-medicines/products/DEXTROSE_INJECTION_IP_50pct_1.webp",
      "https://res.cloudinary.com/diszdorz0/image/upload/v1770127453/aster-medicines/products/DEXTROSE_INJECTION_IP_50pct_2.webp"
    ],
    detailedDescription: "High concentration Dextrose Injection provides rapid glucose supplementation for severe hypoglycemia and concentrated caloric support.",
    composition: "Dextrose Monohydrate 50% W/V in sterile water for injection",
    indications: "Severe hypoglycemia, parenteral nutrition, insulin shock therapy",
    dosageInstructions: "As prescribed by physician. Administered by slow IV injection under medical supervision.",
    sideEffects: "Hyperglycemia, thrombophlebitis, fluid overload",
    precautions: "Use with caution in diabetic patients. Administer slowly to avoid venous irritation. Monitor blood glucose."
  },
  {
    id: 9,
    name: "Aster AD Vitamin Baby Massage Oil 340ml",
    category: "Pediatric Care",
    description: "Baby massage oil for growth and vigour of babies containing Vitamin A, D, E & Olive Oil",
    dosage: "340ml bottle",
    features: ["Vitamin A, D, E Enriched", "Contains Olive Oil", "Baby Safe Formula", "Growth Support"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127432/aster-medicines/products/AD_OIL_340_ML.webp"],
    detailedDescription: "Aster AD Vitamin Baby Massage Oil is specially formulated for the growth and vigour of babies. This nourishing blend contains essential vitamins A, D, E and natural olive oil to support healthy development in infants and young children.",
    composition: "Vitamin A, Vitamin D, Vitamin E, Olive Oil, Light Liquid Paraffin",
    indications: "Daily massage for babies to promote healthy growth, bone development, skin nourishment, and overall vigour",
    dosageInstructions: "Apply adequate amount on baby's body and massage gently. Use daily after bath or as directed by physician.",
    precautions: "For external use only. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dry place."
  },
  {
    id: 10,
    name: "Aster AD Vitamin Baby Massage Oil 100ml",
    category: "Pediatric Care",
    description: "Baby massage oil for growth and vigour of babies containing Vitamin A, D, E & Olive Oil",
    dosage: "100ml bottle",
    features: ["Vitamin A, D, E Enriched", "Contains Olive Oil", "Baby Safe Formula", "Convenient Size"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127430/aster-medicines/products/AD_OIL_100_ML.webp"],
    detailedDescription: "Aster AD Vitamin Baby Massage Oil is specially formulated for the growth and vigour of babies. This nourishing blend contains essential vitamins A, D, E and natural olive oil to support healthy development in infants and young children.",
    composition: "Vitamin A, Vitamin D, Vitamin E, Olive Oil, Light Liquid Paraffin",
    indications: "Daily massage for babies to promote healthy growth, bone development, skin nourishment, and overall vigour",
    dosageInstructions: "Apply adequate amount on baby's body and massage gently. Use daily after bath or as directed by physician.",
    precautions: "For external use only. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dry place."
  },
  {
    id: 11,
    name: "Meropenem Injection I.P. (NEXOMER 1g)",
    category: "Antibiotics",
    description: "Broad-spectrum carbapenem antibiotic for intravenous injection, single use vial",
    dosage: "1g injection vial",
    features: ["Broad-Spectrum Antibiotic", "IV Use Only", "Single Use Vial", "Hospital Grade"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127459/aster-medicines/products/MEROPENEM_INJECTION.webp"],
    detailedDescription: "Meropenem is a broad-spectrum carbapenem antibiotic effective against both Gram-positive and Gram-negative bacteria. It is used for treating serious bacterial infections in hospitalized patients.",
    composition: "Meropenem Trihydrate equivalent to Meropenem 1g",
    indications: "Severe nosocomial infections, complicated skin and soft tissue infections, bacterial meningitis, intra-abdominal infections, febrile neutropenia",
    dosageInstructions: "As prescribed by physician. Administered by intravenous infusion under medical supervision. Typical dose: 0.5-2g every 8 hours.",
    sideEffects: "Diarrhea, nausea, vomiting, headache, rash, injection site reactions, thrombocytosis",
    precautions: "Use with caution in patients with CNS disorders, renal impairment, or history of hypersensitivity to beta-lactam antibiotics. Monitor renal function."
  },
  {
    id: 12,
    name: "Amoxicillin And Potassium Clavulanate Injection I.P. (A-CLAV 1.2g)",
    category: "Antibiotics",
    description: "Combination antibiotic injection for intravenous use, single use vial",
    dosage: "1.2g injection vial",
    features: ["Combination Antibiotic", "Beta-Lactamase Inhibitor", "IV Use Only", "Broad Coverage"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127440/aster-medicines/products/AMOXICILINE_INJECTION.webp"],
    detailedDescription: "A-CLAV is a combination of amoxicillin and potassium clavulanate, providing enhanced antibacterial coverage. Clavulanate inhibits beta-lactamase enzymes, protecting amoxicillin from bacterial resistance mechanisms.",
    composition: "Amoxicillin Sodium 1g and Potassium Clavulanate 200mg (equivalent to Clavulanic Acid)",
    indications: "Respiratory tract infections, urinary tract infections, skin and soft tissue infections, bone and joint infections, intra-abdominal infections",
    dosageInstructions: "As prescribed by physician. Administered by slow intravenous injection or infusion. Typical dose: 1.2g every 8 hours.",
    sideEffects: "Diarrhea, nausea, vomiting, skin rash, candidiasis, hepatic dysfunction",
    precautions: "Use with caution in patients with hepatic impairment, history of penicillin allergy, or infectious mononucleosis. Monitor liver function."
  },
  {
    id: 13,
    name: "Lignocaine Hydrochloride Injection I.P. (ALCAINE)",
    category: "Anesthetics",
    description: "Local anesthetic injection for regional anesthesia and pain management",
    dosage: "30ml vial",
    features: ["Local Anesthetic", "Regional Anesthesia", "Pain Management", "Hospital Grade"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127435/aster-medicines/products/ALCAINE_INJ.webp"],
    detailedDescription: "Lignocaine is a local anesthetic used for regional anesthesia, infiltration anesthesia, and management of ventricular arrhythmias.",
    composition: "Lignocaine Hydrochloride I.P.",
    indications: "Local and regional anesthesia, dental procedures, minor surgical procedures, ventricular arrhythmias",
    dosageInstructions: "As prescribed by physician. Dosage varies based on procedure and site of administration.",
    sideEffects: "CNS effects, cardiovascular effects, allergic reactions, methemoglobinemia",
    precautions: "Use with caution in patients with cardiac disease, hepatic impairment, or epilepsy. Monitor vital signs during administration."
  },
  {
    id: 14,
    name: "Adrenaline Injection I.P. (ALINE)",
    category: "Emergency Medicine",
    description: "Adrenaline injection for emergency treatment of anaphylaxis and cardiac arrest",
    dosage: "1ml ampoule",
    features: ["Emergency Use", "Anaphylaxis Treatment", "Cardiac Resuscitation", "Life-Saving"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127437/aster-medicines/products/ALINE_INJECTION.webp"],
    detailedDescription: "Adrenaline (Epinephrine) is a life-saving medication used in emergency situations including anaphylaxis, cardiac arrest, and severe bronchospasm.",
    composition: "Adrenaline (Epinephrine) I.P.",
    indications: "Anaphylactic shock, cardiac arrest, severe bronchospasm, acute hypotension",
    dosageInstructions: "As prescribed by physician. Emergency dose: 0.5-1mg IM/IV depending on indication. Must be administered by trained healthcare professionals.",
    sideEffects: "Tachycardia, hypertension, anxiety, tremor, palpitations, arrhythmias",
    precautions: "Use with extreme caution in patients with cardiovascular disease, hyperthyroidism, or diabetes. Monitor vital signs closely."
  },
  {
    id: 15,
    name: "Aminophylline Injection I.P.",
    category: "Respiratory",
    description: "Bronchodilator injection for treatment of respiratory conditions",
    dosage: "10ml ampoule",
    features: ["Bronchodilator", "Respiratory Support", "Hospital Grade", "IV Administration"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127438/aster-medicines/products/AMINOPHYLLINE_INJECTION_I.P.webp"],
    detailedDescription: "Aminophylline is a bronchodilator used in the treatment of asthma, chronic obstructive pulmonary disease (COPD), and other respiratory conditions.",
    composition: "Aminophylline I.P. (theophylline ethylenediamine)",
    indications: "Acute bronchial asthma, COPD exacerbations, apnea of prematurity",
    dosageInstructions: "As prescribed by physician. Administered by slow IV injection or infusion. Dosage varies based on age, weight, and condition.",
    sideEffects: "Nausea, vomiting, headache, insomnia, tachycardia, arrhythmias",
    precautions: "Monitor serum theophylline levels. Use with caution in patients with cardiac disease, peptic ulcer, or seizure disorders."
  },
  {
    id: 16,
    name: "Atropine Sulphate Injection I.P.",
    category: "Emergency Medicine",
    description: "Anticholinergic injection for emergency and surgical use",
    dosage: "1ml ampoule",
    features: ["Anticholinergic", "Emergency Use", "Preoperative Medication", "Hospital Grade"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127444/aster-medicines/products/ATROPINE.webp"],
    detailedDescription: "Atropine is an anticholinergic agent used in emergency medicine, as a preoperative medication, and for treatment of bradycardia and organophosphate poisoning.",
    composition: "Atropine Sulphate I.P.",
    indications: "Bradycardia, preoperative antisialagogue, organophosphate poisoning, reversal of muscarinic effects",
    dosageInstructions: "As prescribed by physician. Dosage varies based on indication. Typical dose: 0.3-0.6mg IV/IM.",
    sideEffects: "Dry mouth, blurred vision, urinary retention, tachycardia, confusion",
    precautions: "Use with caution in elderly patients and those with glaucoma, prostatic hypertrophy, or cardiac disease."
  },
  {
    id: 17,
    name: "Calcium Gluconate Injection I.P. 10% W/V",
    category: "Supplements",
    description: "Calcium supplement injection for treatment of hypocalcemia",
    dosage: "10ml ampoule",
    features: ["Calcium Supplement", "Electrolyte Replacement", "IV Administration", "Hospital Grade"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127447/aster-medicines/products/CALCIUM_GLUCONATE_INJECTION_I.P._10_W_V.webp"],
    detailedDescription: "Calcium Gluconate is used for the treatment and prevention of calcium deficiency states, hypocalcemia, and as an adjunct in various medical conditions.",
    composition: "Calcium Gluconate 10% W/V in sterile aqueous solution",
    indications: "Hypocalcemia, hyperkalemia, hypermagnesemia, calcium channel blocker overdose, adjunct in cardiac resuscitation",
    dosageInstructions: "As prescribed by physician. Administered by slow IV injection. Typical dose: 10-20ml of 10% solution.",
    sideEffects: "Hypercalcemia, bradycardia, hypotension, tissue necrosis if extravasated",
    precautions: "Administer slowly to avoid cardiac arrhythmias. Monitor serum calcium levels. Incompatible with certain drugs."
  },
  {
    id: 18,
    name: "Dexamethasone Sodium Phosphate Injection I.P.",
    category: "Corticosteroids",
    description: "Corticosteroid injection for anti-inflammatory and immunosuppressive therapy",
    dosage: "1ml ampoule",
    features: ["Corticosteroid", "Anti-Inflammatory", "Immunosuppressive", "Hospital Grade"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127448/aster-medicines/products/DEXAMETHASONE.webp"],
    detailedDescription: "Dexamethasone is a potent corticosteroid with anti-inflammatory and immunosuppressive properties used in various medical conditions.",
    composition: "Dexamethasone Sodium Phosphate I.P.",
    indications: "Severe allergic reactions, cerebral edema, inflammatory conditions, certain cancers, adrenal insufficiency",
    dosageInstructions: "As prescribed by physician. Dosage varies based on condition and severity. Can be administered IV, IM, or by local injection.",
    sideEffects: "Hyperglycemia, hypertension, fluid retention, mood changes, immunosuppression",
    precautions: "Use with caution in diabetic patients, those with infections, or peptic ulcer disease. Avoid abrupt discontinuation."
  },
  {
    id: 19,
    name: "Ceftriaxone Injection (NOBICEF 1g)",
    category: "Antibiotics",
    description: "Third-generation cephalosporin antibiotic for broad-spectrum bacterial infections",
    dosage: "1g injection vial",
    features: ["Third-Generation Cephalosporin", "Broad-Spectrum", "Hospital Grade", "IV/IM Use"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127460/aster-medicines/products/NOBICEF_1MG.webp"],
    detailedDescription: "Ceftriaxone is a third-generation cephalosporin with enhanced activity against Gram-negative bacteria and good Gram-positive coverage for serious infections.",
    composition: "Ceftriaxone as Ceftriaxone Hydrochloride 1g",
    indications: "Pneumonia, complicated UTIs, skin and soft tissue infections, febrile neutropenia, intra-abdominal infections",
    dosageInstructions: "As prescribed by physician. Typical dose: 1-2g every 8-12 hours by IV infusion or IM injection.",
    sideEffects: "Diarrhea, rash, nausea, headache, thrombocytosis, elevated liver enzymes",
    precautions: "Adjust dose in renal impairment. Use with caution in patients with penicillin allergy. Monitor for C. difficile infection."
  },
  {
    id: 20,
    name: "Sodium Bicarbonate Injection I.P. 7.5% (Alternative Pack)",
    category: "Emergency Medicine",
    description: "7.5% W/V Sodium Bicarbonate injection for metabolic acidosis treatment",
    dosage: "10ml ampoule",
    features: ["Emergency Use", "Alkalinizing Agent", "Sterile Solution", "Hospital Grade"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127467/aster-medicines/products/Sodium_Bicarbonate_INJ_IP_7.5.webp"],
    detailedDescription: "Sodium Bicarbonate Injection is used in emergency medicine for the treatment of metabolic acidosis and as an alkalinizing agent in various clinical conditions.",
    composition: "Sodium Bicarbonate 7.5% W/V in sterile water for injection",
    indications: "Metabolic acidosis, cardiac arrest protocols, hyperkalemia, tricyclic antidepressant overdose",
    dosageInstructions: "As directed by physician. Administered intravenously under medical supervision. Dosage based on arterial blood gas analysis.",
    sideEffects: "Hypernatremia, metabolic alkalosis, edema, hypocalcemia, tissue necrosis at injection site",
    precautions: "Use with caution in patients with renal impairment, heart failure, or hypertension. Monitor serum electrolytes and acid-base status."
  },
  {
    id: 21,
    name: "Meropenem Injection (NEXOMER 1g - Hospital Pack)",
    category: "Antibiotics",
    description: "Broad-spectrum carbapenem antibiotic for severe infections - hospital packaging",
    dosage: "1g injection vial",
    features: ["Broad-Spectrum Antibiotic", "IV Use Only", "Hospital Pack", "Single Use Vial"],
    images: ["https://res.cloudinary.com/diszdorz0/image/upload/v1770127461/aster-medicines/products/Nexomer_1g.webp"],
    detailedDescription: "Meropenem is a broad-spectrum carbapenem antibiotic effective against both Gram-positive and Gram-negative bacteria, including many multi-drug resistant organisms.",
    composition: "Meropenem Trihydrate equivalent to Meropenem 1g",
    indications: "Severe nosocomial infections, complicated skin and soft tissue infections, bacterial meningitis, intra-abdominal infections, febrile neutropenia",
    dosageInstructions: "As prescribed by physician. Administered by intravenous infusion over 15-30 minutes. Typical dose: 0.5-2g every 8 hours.",
    sideEffects: "Diarrhea, nausea, vomiting, headache, rash, injection site reactions, thrombocytosis, elevated liver enzymes",
    precautions: "Use with caution in patients with CNS disorders, renal impairment, or history of hypersensitivity to beta-lactam antibiotics. Adjust dose in renal impairment."
  }
];

export const categories = ["All", "Pediatric Care", "Emergency Medicine", "IV Solutions", "Cardiovascular", "Nutrition", "Digestive Health", "Antiemetic", "Antibiotics", "Anesthetics", "Respiratory", "Supplements", "Corticosteroids"];

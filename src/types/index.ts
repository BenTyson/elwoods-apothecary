// El Woods Apothecary - TypeScript Types

// Metadata for data gathering workflow (staging files only)
export interface GatherMetadata {
  gatheredAt: string;                      // ISO date (YYYY-MM-DD)
  sources: string[];                       // Key source URLs/references
  confidence: 'high' | 'medium' | 'low';   // Research confidence level
  isUpdate: boolean;                       // True if updating existing entry
  notes?: string;                          // Uncertainty flags or comments
}

export interface Plant {
  id: string;
  commonName: string;
  otherNames?: string[];
  latinName: string;
  family: string;
  partsUsed: string[];
  taste: string;
  energy: string;
  actions: string[];
  bodySystems: BodySystem[];
  conditions: string[];
  preparations: PreparationType[];
  traditions: Tradition[];
  seasons: Season[];
  featured?: boolean;
  safety: SafetyInfo;
  dosage: Record<string, string>;
  content: PlantContent;
  constituents?: string[];
  combinations?: HerbCombination[];
}

export interface SafetyInfo {
  generalSafety: string;
  contraindications: string[];
  drugInteractions: string[];
  pregnancySafe: boolean;
  pregnancyNotes?: string;
  nursingNotes?: string;
  childrenNotes?: string;
}

export interface PlantContent {
  overview: string;
  traditionalUses: string;
  modernResearch: string;
  howToUse: string;
  harvesting?: string;
  cultivation?: string;
  // Botanical sections
  history?: string; // Historical background, etymology, cultural significance
  nativeRange?: string; // Geographic origins, habitats, naturalized regions
  taxonomy?: string; // Family tree, related species, botanical classification
  morphology?: string; // Physical characteristics, growth habit, identifying features
  // Practical/quality sections
  storage?: string; // Shelf life, storage conditions, signs of degradation
  quality?: string; // What to look for when buying/harvesting, quality indicators
  conservationStatus?: string; // Endangered status, ethical sourcing, sustainability
  lookalikes?: string; // Dangerous look-alike plants, identification warnings
}

export interface HerbCombination {
  herb: string;
  purpose: string;
}

// ============================================================================
// INGREDIENTS - Non-plant materials used in herbal preparations
// ============================================================================

export type IngredientCategory =
  | 'carrier-oil'
  | 'essential-oil'
  | 'wax'
  | 'butter'
  | 'solvent'
  | 'sweetener'
  | 'vinegar'
  | 'clay'
  | 'salt'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  otherNames?: string[];
  category: IngredientCategory;
  source: string; // Where it comes from (e.g., "bees", "olives", "grain alcohol")
  description: string;
  properties: IngredientProperties;
  uses: string[]; // What preparations it's used in
  substitutes?: IngredientSubstitute[];
  safety?: IngredientSafety;
  content: IngredientContent;
}

export interface IngredientProperties {
  texture?: string; // Solid, liquid, semi-solid
  color?: string;
  scent?: string;
  shelfLife: string;
  storageRequirements: string;
  solubility?: string; // What it dissolves in
  absorptionRate?: string; // For carrier oils - how quickly skin absorbs
  comedogenicRating?: number; // 0-5 scale for oils
}

export interface IngredientSubstitute {
  ingredient: string;
  notes: string; // When/why to use this substitute
}

export interface IngredientSafety {
  generalSafety: string;
  allergens?: string[];
  sensitivityNotes?: string;
  internalUse: boolean;
  internalNotes?: string;
  pregnancySafe?: boolean;
  pregnancyNotes?: string;
  childrenNotes?: string;
  petSafe?: boolean;
  petNotes?: string;
}

export interface IngredientContent {
  overview: string;
  history?: string; // Historical use, origin story
  production?: string; // How it's made/extracted
  quality?: string; // What to look for when buying
  usageGuidelines?: string; // How to use in preparations
  scienceNotes?: string; // Chemistry, why it works
}

// ============================================================================
// PREPARATIONS - Method guides for making herbal preparations
// ============================================================================

export interface Preparation {
  id: string;
  name: string;
  type: PreparationType;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string;
  activeTime?: string; // Hands-on time vs total time
  equipment: string[];
  ingredientTypes: string[]; // General categories needed (herbs, carrier oil, etc.)
  ratios: PreparationRatio[];
  process: PreparationStep[];
  troubleshooting?: TroubleshootingItem[];
  variations?: PreparationVariation[];
  storage: StorageInfo;
  content: PreparationContent;
}

export interface PreparationRatio {
  description: string; // e.g., "Standard tincture"
  ratio: string; // e.g., "1:5" or "1 oz herb : 5 oz menstruum"
  notes?: string;
}

export interface PreparationStep {
  step: number;
  instruction: string;
  duration?: string;
  tips?: string;
}

export interface TroubleshootingItem {
  problem: string;
  cause: string;
  solution: string;
}

export interface PreparationVariation {
  name: string;
  description: string;
  modifications: string;
}

export interface StorageInfo {
  container: string;
  conditions: string;
  shelfLife: string;
  signsOfSpoilage: string;
}

export interface PreparationContent {
  overview: string;
  history?: string; // Historical development of this method
  theory?: string; // Why this method works, what it extracts
  bestFor?: string; // What herbs/constituents this method is best for
  notRecommendedFor?: string; // What this method doesn't work well for
  safetyConsiderations?: string;
  advancedTechniques?: string;
}

// ============================================================================
// ACTIONS - Herbal actions and their effects
// ============================================================================

export interface Action {
  id: string;
  name: string;
  pronunciation?: string;
  definition: string; // Brief, one-sentence definition
  category: ActionCategory;
  mechanism: string; // How it works physiologically
  exampleHerbs: string[]; // 3-5 representative herbs
  conditions: string[]; // Conditions this action helps
  relatedActions?: string[]; // Similar or complementary actions
  oppositeActions?: string[]; // Contrasting actions
  traditions: ActionTradition[];
  content: ActionContent;
}

export type ActionCategory =
  | 'nervous-system'
  | 'digestive'
  | 'respiratory'
  | 'cardiovascular'
  | 'immune'
  | 'musculoskeletal'
  | 'reproductive'
  | 'skin-mucous-membrane'
  | 'metabolic'
  | 'general';

export interface ActionTradition {
  tradition: Tradition;
  term?: string; // What this tradition calls it (if different)
  notes?: string;
}

export interface ActionContent {
  overview: string;
  history?: string; // Etymology, who coined the term, historical use
  physiology?: string; // Detailed mechanism of action
  clinicalUse?: string; // How herbalists apply this action
  cautions?: string; // When this action might not be appropriate
  combining?: string; // How to combine with other actions
}

// ============================================================================
// GLOSSARY - Herbal terminology definitions
// ============================================================================

export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  definition: string;
  etymology?: string; // Word origin
  category: GlossaryCategory;
  usageExamples?: string[]; // Example sentences
  relatedTerms?: string[]; // Other glossary terms
  seeAlso?: GlossaryReference[]; // Links to plants, actions, etc.
  content?: GlossaryContent;
}

export type GlossaryCategory =
  | 'botanical'
  | 'preparation'
  | 'action'
  | 'traditional'
  | 'anatomy'
  | 'chemistry'
  | 'general';

export interface GlossaryReference {
  type: 'plant' | 'action' | 'preparation' | 'condition' | 'ingredient';
  id: string;
  label?: string;
}

export interface GlossaryContent {
  extendedDefinition?: string; // Longer explanation if needed
  history?: string; // Historical context
  modernUsage?: string; // How the term is used today
}

// ============================================================================
// TEA - Tea varieties from Camellia sinensis (processed products, not the plant)
// ============================================================================

export type TeaType =
  | 'white'
  | 'green'
  | 'yellow'
  | 'oolong'
  | 'black'
  | 'dark' // Includes pu-erh and other post-fermented teas
  | 'blend'; // For breakfast blends, chai bases, etc.

export interface Tea {
  id: string;
  name: string;
  otherNames?: string[];
  teaType: TeaType;
  origin: TeaOrigin;
  processing: TeaProcessing;
  profile: TeaProfile;
  brewing: BrewingParameters;
  caffeine: CaffeineProfile;
  health: TeaHealth;
  grading?: TeaGrading;
  content: TeaContent;
}

export interface TeaOrigin {
  country: string;
  region?: string; // Darjeeling, Yunnan, Fujian, Uji, etc.
  terroir?: string; // Elevation, climate, soil characteristics
  harvest?: string; // First flush, second flush, autumn, etc.
}

export interface TeaProcessing {
  oxidationLevel: string; // 0% (white/green) to 100% (black), or range for oolong
  steps: string[]; // Withering, rolling, oxidizing, firing, etc.
  roastLevel?: 'none' | 'light' | 'medium' | 'heavy';
  aged?: boolean;
  agingNotes?: string; // For pu-erh and aged oolongs
  fermented?: boolean; // True for dark/pu-erh teas (microbial fermentation)
}

export interface TeaProfile {
  appearance: string; // Dry leaf appearance
  liquorColor: string; // Brewed tea color
  aroma: string[];
  flavor: string[];
  mouthfeel?: string; // Body, astringency, smoothness
  finish?: string; // Aftertaste characteristics
}

export interface BrewingParameters {
  waterTemp: string; // In Fahrenheit and Celsius
  steepTime: string; // Range for first infusion
  leafRatio: string; // Grams per oz/ml
  resteeps?: number; // How many times leaves can be reused
  notes?: string; // Special brewing considerations
  gongfuStyle?: BrewingParameters; // Optional parameters for gongfu brewing
}

export interface CaffeineProfile {
  level: 'none' | 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  mgPerCup?: string; // Approximate range
  lTheanine?: string; // L-theanine content/ratio notes
  energyNotes?: string; // Character of the energy (calm alertness, etc.)
}

export interface TeaHealth {
  primaryBenefits: string[];
  antioxidants?: string; // EGCG, catechins, theaflavins, etc.
  traditionalUses?: string; // TCM or traditional applications
  modernResearch?: string; // Summary of scientific research
  cautions?: string; // Iron absorption, caffeine sensitivity, etc.
}

export interface TeaGrading {
  system?: string; // Orthodox, CTC, Japanese, Chinese, etc.
  grade?: string; // SFTGFOP, Gyokuro, etc.
  gradeExplanation?: string;
}

export interface TeaContent {
  overview: string;
  history?: string; // Origin story, cultural significance
  culture?: string; // Tea ceremony, regional traditions
  production?: string; // Detailed processing information
  selection?: string; // How to choose quality examples
  storage?: string; // How to store, shelf life
  pairings?: string; // Food pairings, time of day
  variations?: string; // Related teas, similar styles
}

export type BodySystem =
  | 'nervous'
  | 'digestive'
  | 'immune'
  | 'respiratory'
  | 'skin'
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'endocrine'
  | 'reproductive'
  | 'urinary';

export type PreparationType =
  | 'tea'
  | 'decoction'
  | 'tincture'
  | 'salve'
  | 'oil'
  | 'syrup'
  | 'poultice'
  | 'capsule'
  | 'compress'
  | 'bath';

export type Tradition =
  | 'western'
  | 'tcm'
  | 'ayurveda'
  | 'native-american'
  | 'folk';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface BodySystemInfo {
  id: BodySystem;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface PreparationInfo {
  id: PreparationType;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: string;
}

export interface ActionInfo {
  id: string;
  name: string;
  description: string;
}

export interface TraditionInfo {
  id: Tradition;
  name: string;
  description: string;
}

export interface SeasonInfo {
  id: Season;
  name: string;
  focus: string[];
  description: string;
}

export interface Categories {
  bodySystems: BodySystemInfo[];
  preparationTypes: PreparationInfo[];
  actions: ActionInfo[];
  traditions: TraditionInfo[];
  seasons: SeasonInfo[];
}

export interface Condition {
  id: string;
  name: string;
  category: BodySystem;
  description: string;
  symptoms: string[];
  herbs: string[];
  approaches: string[];
  lifestyle: string[];
  whenToSeek: string;
}

export interface RemedyIngredient {
  herb?: string;
  item?: string;
  amount: string;
  part?: string;
  note?: string;
}

export interface Remedy {
  id: string;
  name: string;
  type: PreparationType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prepTime: string;
  yield: string;
  description: string;
  herbs: string[];
  conditions: string[];
  bodySystems: BodySystem[];
  ingredients: RemedyIngredient[];
  instructions: string[];
  tips?: string[];
  variations?: string[];
  storage?: string;
  dosage?: Record<string, string>;
  safety?: string;
}

// Filter state for browse page
export interface FilterState {
  search: string;
  bodySystems: BodySystem[];
  preparations: PreparationType[];
  conditions: string[];
  actions: string[];
}

// Color mapping for body systems
export const bodySystemColors: Record<BodySystem, string> = {
  nervous: 'calming',
  digestive: 'digestive',
  immune: 'immune',
  respiratory: 'respiratory',
  skin: 'skin',
  cardiovascular: 'anti-inflammatory',
  musculoskeletal: 'anti-inflammatory',
  endocrine: 'adaptogen',
  reproductive: 'womens',
  urinary: 'respiratory',
};

// El Woods Apothecary - TypeScript Types

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
}

export interface HerbCombination {
  herb: string;
  purpose: string;
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

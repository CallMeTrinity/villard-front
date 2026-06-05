export type InvState = 'ok' | 'worn' | 'replace'
export type InvCategoryId = 'linge' | 'cuisine' | 'equip' | 'bain'

export type InvCategory = {
  id: InvCategoryId
  label: string
  icon: string
}

export type InvItem = {
  id: string
  cat: InvCategoryId
  name: string
  qty: number
  loc: string
  state: InvState
  note: string
}

export const INV_CATS: InvCategory[] = [
  { id: 'linge', label: 'Linge', icon: 'linen' },
  { id: 'cuisine', label: 'Vaisselle & cuisine', icon: 'dish' },
  { id: 'equip', label: 'Équipement', icon: 'gear' },
  { id: 'bain', label: 'Salle de bain', icon: 'bath' },
]

export const STATE_META: Record<InvState, { label: string; cls: InvState }> = {
  ok: { label: 'Bon état', cls: 'ok' },
  worn: { label: 'Usé', cls: 'worn' },
  replace: { label: 'À remplacer', cls: 'replace' },
}

export const STATE_CYCLE: Record<InvState, InvState> = {
  ok: 'worn',
  worn: 'replace',
  replace: 'ok',
}

export const INVENTORY_MOCK: InvItem[] = [
  // Linge
  { id: 'i01', cat: 'linge', name: 'Housses de couette 240×220', qty: 4, loc: 'Placard couloir', state: 'ok', note: '2 motifs sapin, 2 unies' },
  { id: 'i02', cat: 'linge', name: 'Draps housse 160', qty: 5, loc: 'Placard couloir', state: 'ok', note: '' },
  { id: 'i03', cat: 'linge', name: "Taies d'oreiller", qty: 10, loc: 'Placard couloir', state: 'worn', note: '3 à recoudre' },
  { id: 'i04', cat: 'linge', name: 'Serviettes de bain', qty: 8, loc: 'Placard SdB', state: 'ok', note: '' },
  { id: 'i05', cat: 'linge', name: 'Plaids laine', qty: 3, loc: 'Salon', state: 'ok', note: '' },
  { id: 'i06', cat: 'linge', name: "Couvertures d'appoint", qty: 2, loc: 'Cabane skis', state: 'replace', note: 'Mitées — à remplacer' },
  // Cuisine
  { id: 'i07', cat: 'cuisine', name: 'Assiettes plates', qty: 12, loc: 'Buffet', state: 'ok', note: '' },
  { id: 'i08', cat: 'cuisine', name: 'Assiettes creuses', qty: 9, loc: 'Buffet', state: 'worn', note: '1 ébréchée' },
  { id: 'i09', cat: 'cuisine', name: 'Verres à eau', qty: 8, loc: 'Buffet', state: 'replace', note: '6 dépareillés, 2 cassés cet hiver' },
  { id: 'i10', cat: 'cuisine', name: 'Couverts (sets)', qty: 12, loc: 'Tiroir', state: 'ok', note: '' },
  { id: 'i11', cat: 'cuisine', name: 'Casseroles', qty: 4, loc: "Sous l'évier", state: 'ok', note: '' },
  { id: 'i12', cat: 'cuisine', name: 'Cocotte fonte', qty: 1, loc: "Sous l'évier", state: 'ok', note: 'Le Creuset hérité' },
  { id: 'i13', cat: 'cuisine', name: 'Tasses / mugs', qty: 7, loc: 'Buffet', state: 'worn', note: '' },
  // Équipement
  { id: 'i14', cat: 'equip', name: 'Raclette électrique', qty: 1, loc: 'Cabane skis', state: 'ok', note: '8 personnes' },
  { id: 'i15', cat: 'equip', name: 'Fer + table à repasser', qty: 1, loc: 'Buanderie', state: 'ok', note: '' },
  { id: 'i16', cat: 'equip', name: 'Aspirateur', qty: 1, loc: 'Placard entrée', state: 'worn', note: 'Brosse fatiguée' },
  { id: 'i17', cat: 'equip', name: 'Luge / ESF débutant', qty: 3, loc: 'Cabane skis', state: 'ok', note: '' },
  { id: 'i18', cat: 'equip', name: 'Sèche-cheveux', qty: 2, loc: 'SdB', state: 'replace', note: '1 HS' },
  { id: 'i19', cat: 'equip', name: 'Kit premiers secours', qty: 1, loc: 'Entrée', state: 'worn', note: 'À recompléter' },
  // Salle de bain
  { id: 'i20', cat: 'bain', name: 'Tapis de bain', qty: 3, loc: 'SdB', state: 'ok', note: '' },
  { id: 'i21', cat: 'bain', name: 'Balai WC + brosse', qty: 2, loc: 'WC', state: 'ok', note: '' },
]

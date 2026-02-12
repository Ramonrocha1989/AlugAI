// Fabricantes principais (agrícola e construção)
export const MANUFACTURERS = {
  agricultural: [
    'John Deere',
    'Case IH',
    'New Holland',
    'Massey Ferguson',
    'Valtra',
    'Kubota',
    'LS Tractor',
    'Mahindra',
    'Agrale',
    'Yanmar',
  ],
  construction: [
    'Caterpillar',
    'Komatsu',
    'Volvo',
    'JCB',
    'Hyundai',
    'Doosan',
    'Liebherr',
    'Sany',
    'XCMG',
  ],
} as const;

// Lista completa de fabricantes
export const ALL_MANUFACTURERS = [
  ...MANUFACTURERS.agricultural,
  ...MANUFACTURERS.construction,
].sort();

// Categorias com labels (UPPERCASE)
export const CATEGORIES = {
  TRACTORS: 'Tratores',
  HARVESTERS: 'Colheitadeiras',
  PLANTING: 'Plantio e Semeadura',
  SPRAYING: 'Pulverização',
  HAYMAKING: 'Fenação e Silagem',
  IMPLEMENTS: 'Implementos e Acoplados',
  LIVESTOCK: 'Pecuária e Outros',
  CONSTRUCTION: 'Construção (Linha Amarela)',
} as const;

// Tipos de negócio com labels (UPPERCASE)
export const BUSINESS_TYPES = {
  SALE: 'Venda',
  RENTAL: 'Aluguel',
  EXCHANGE: 'Troca',
  SERVICE: 'Serviço',
} as const;

// Tags rápidas com labels (UPPERCASE)
export const QUICK_TAGS = {
  NEW_TIRES: 'Pneus Novos',
  ORIGINAL_CABIN: 'Cabine Original',
  AUTHORIZED_SERVICE: 'Revisado na Autorizada',
  GPS_INTEGRATED: 'GPS Integrado',
  AIR_CONDITIONING: 'Ar Condicionado',
  SINGLE_OWNER: 'Único Dono',
  COMPLETE_DOCS: 'Documentação Completa',
} as const;

// Estados do Sul (foco inicial)
export const STATES_SUL = [
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'PR', label: 'Paraná' },
] as const;

// Todos os estados (expansão futura)
export const STATES_BRAZIL = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const;

// Culturas (filtro diferencial do Sul)
export const CULTURES = [
  'Arroz',
  'Soja',
  'Milho',
  'Trigo',
  'Feijão',
  'Pecuária Leiteira',
  'Pecuária de Corte',
  'Horticultura',
] as const;

// Faixas de potência para tratores
export const POWER_RANGES = {
  small: { min: 0, max: 75, label: 'Pequeno (até 75cv)' },
  medium: { min: 76, max: 150, label: 'Médio (76-150cv)' },
  large: { min: 151, max: 999, label: 'Grande (acima de 150cv)' },
} as const;

// Cidades principais do Sul (para autocomplete)
export const CITIES_SUL = {
  RS: [
    'Porto Alegre',
    'Caxias do Sul',
    'Pelotas',
    'Canoas',
    'Santa Maria',
    'Gravataí',
    'Viamão',
    'Novo Hamburgo',
    'São Leopoldo',
    'Rio Grande',
    'Alvorada',
    'Passo Fundo',
    'Sapucaia do Sul',
    'Uruguaiana',
    'Santa Cruz do Sul',
    'Cachoeirinha',
    'Bagé',
    'Bento Gonçalves',
    'Erechim',
    'Guaíba',
  ],
  SC: [
    'Florianópolis',
    'Joinville',
    'Blumenau',
    'São José',
    'Criciúma',
    'Chapecó',
    'Itajaí',
    'Jaraguá do Sul',
    'Lages',
    'Palhoça',
    'Balneário Camboriú',
    'Brusque',
    'Tubarão',
    'São Bento do Sul',
    'Caçador',
    'Concórdia',
    'Camboriú',
    'Navegantes',
    'Rio do Sul',
    'Araranguá',
  ],
  PR: [
    'Curitiba',
    'Londrina',
    'Maringá',
    'Ponta Grossa',
    'Cascavel',
    'São José dos Pinhais',
    'Foz do Iguaçu',
    'Colombo',
    'Guarapuava',
    'Paranaguá',
    'Araucária',
    'Toledo',
    'Apucarana',
    'Pinhais',
    'Campo Largo',
    'Almirante Tamandaré',
    'Umuarama',
    'Piraquara',
    'Cambé',
    'Paranavaí',
  ],
} as const;

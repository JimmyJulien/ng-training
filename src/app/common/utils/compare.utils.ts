export function deepEqual<T>(a: T, b: T): boolean {
  // Cas de base : référence identique
  if (a === b) return true;

  // L'un des deux est null ou undefined → l'autre aussi doit l'être (déjà couvert par ===)
  if (a == null || b == null) return false;

  // Si l'un est primitif et pas l'autre → pas égal
  if (typeof a !== typeof b) return false;

  // Si les deux sont primitifs (mais pas égaux par référence) → pas égaux
  if (typeof a !== 'object') return false;

  // Vérifier si l'un est un tableau et pas l'autre
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Les deux sont des objets (ou tableaux)
  const keysA = Object.keys(a) as (keyof T)[];
  const keysB = Object.keys(b) as (keyof T)[];

  // Même nombre de clés ?
  if (keysA.length !== keysB.length) return false;

  // Vérifier chaque clé
  for (const key of keysA) {
    // La clé n'existe pas dans b
    if (!keysB.includes(key)) return false;

    // Comparaison récursive — TypeScript infère correctement le type de a[key] et b[key]
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

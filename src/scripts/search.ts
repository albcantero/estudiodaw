// Texto comparable para el buscador: minúsculas y sin tildes ("Diseño" casa con "diseno").
// Lo usan el servidor (texto de cada elemento) y el navegador (lo que se escribe).
export const normalizeSearch = (text: string) =>
  text.toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '');

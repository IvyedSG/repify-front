const universityMap: { [key: string]: string } = {
    "Universidad Nacional Mayor de San Marcos": "UNMSM",
    "Universidad Nacional de Ingeniería": "UNI",
    "Universidad Nacional Agraria La Molina": "UNALM",
    "Universidad Nacional Federico Villarreal": "UNFV",
    "Universidad Nacional Tecnológica de Lima Sur": "UNTELS",
    "Pontificia Universidad Católica del Perú": "PUCP",
    "Universidad Peruana Cayetano Heredia": "UPCH",
    "Universidad de Lima": "UL",
    "Universidad de San Martín de Porres": "USMP",
    "Universidad Ricardo Palma": "URP",
    "Universidad Peruana de Ciencias Aplicadas": "UPC",
    "Universidad Privada Norbert Wiener": "UPNW",
    "Universidad Privada San Juan Bautista": "UPSJB",
    "Universidad Tecnológica del Perú": "UTP",
    "Universidad Científica del Sur": "UCSUR",
    "Universidad Autónoma del Perú": "UA"
  };
  
  export function convertToUniversitySiglas(fullName: string): string {
    return universityMap[fullName] || fullName;
  }
  
  export function convertToFullUniversityName(siglas: string): string {
    const entry = Object.entries(universityMap).find(([_, value]) => value === siglas);
    return entry ? entry[0] : siglas;
  }
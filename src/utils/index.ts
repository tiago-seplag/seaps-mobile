export const getFirstAndLastName = (name?: string) => {
  if (!name) return "";

  const names = name.trim().split(/\s+/); // Remove espaços extras e divide por espaços
  if (names.length === 1) return names[0];

  const firstName = names[0];
  const lastName = names[names.length - 1];

  return `${firstName} ${lastName}`;
};

const formatPhone = (value: string) => {
  const str = value.replace(/\D/g, ""); // remove caracteres não numéricos

  return str.length <= 10
    ? str.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    : str
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{1})(\d{4})(\d)/, "$1 $2-$3")
        .slice(0, 16);
};

export const formatCEP = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/^(\d{5})(\d)/, "$1-$2");
};

export const states = [
  {
    acronym: "AC",
    name: "Acre",
  },
  {
    acronym: "AL",
    name: "Alagoas",
  },
  {
    acronym: "AP",
    name: "Amapá",
  },
  {
    acronym: "AM",
    name: "Amazonas",
  },
  {
    acronym: "BA",
    name: "Bahia",
  },
  {
    acronym: "CE",
    name: "Ceará",
  },
  {
    acronym: "DF",
    name: "Distrito Federal",
  },
  {
    acronym: "ES",
    name: "Espírito Santo",
  },
  {
    acronym: "GO",
    name: "Goiás",
  },
  {
    acronym: "MA",
    name: "Maranhão",
  },
  {
    acronym: "MT",
    name: "Mato Grosso",
  },
  {
    acronym: "MS",
    name: "Mato Grosso do Sul",
  },
  {
    acronym: "MG",
    name: "Minas Gerais",
  },
  {
    acronym: "PR",
    name: "Paraná",
  },
  {
    acronym: "PB",
    name: "Paraíba",
  },
  {
    acronym: "PA",
    name: "Pará",
  },
  {
    acronym: "PE",
    name: "Pernambuco",
  },
  {
    acronym: "PI",
    name: "Piauí",
  },
  {
    acronym: "RJ",
    name: "Rio de Janeiro",
  },
  {
    acronym: "RN",
    name: "Rio Grande do Norte",
  },
  {
    acronym: "RS",
    name: "Rio Grande do Sul",
  },
  {
    acronym: "RO",
    name: "Rondônia",
  },
  {
    acronym: "RR",
    name: "Roraima",
  },
  {
    acronym: "SC",
    name: "Santa Catarina",
  },
  {
    acronym: "SE",
    name: "Sergipe",
  },
  {
    acronym: "SP",
    name: "São Paulo",
  },
  {
    acronym: "TO",
    name: "Tocantins",
  },
];

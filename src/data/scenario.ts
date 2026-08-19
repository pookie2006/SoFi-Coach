export const scenario = {
  person: {
    firstName: "Luke",
    age: 29,
    cityLine: "Group chat · SoMa listing",
  },
  listing: {
    address: "234 1st St, Unit 4B",
    neighborhood: "SoMa, San Francisco",
    building: "Phillips Building",
    beds: 2,
    baths: 2,
    price: 1_850_000,
    demoOnly: true,
  },
  chat: {
    sender: "Asha",
    bubble: "is this even possible??",
    threadName: "SF hunt",
  },
  mortgage: {
    downPaymentPct: 0.2,
    downPayment: 370_000,
    loanAmount: 1_480_000,
    termMonths: 360,
    otherApr: 0.07125,
    sofiApr: 0.06,
    otherMonthly: 9_975,
    sofiMonthly: 8_873,
    monthlySave: 1_100,
    lifetimeSave: 397_000,
  },
  breadth: [
    {
      id: "auto",
      label: "Personal loan",
      number: "$24,000",
      caption: "SoFi originated it",
    },
    {
      id: "invest",
      label: "Clean energy · moderate",
      number: "$10,000",
      caption: "SoFi invested it",
    },
    {
      id: "401k",
      label: "Old 401(k)",
      number: "$48,200",
      caption: "SoFi rolled it",
    },
    {
      id: "student",
      label: "Student loan",
      number: "$186/mo",
      caption: "SoFi refinanced it",
    },
  ],
} as const;

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function dollars(n: number) {
  return usd0.format(n);
}

export const format = {
  price: () => dollars(scenario.listing.price),
  loanAmount: () => dollars(scenario.mortgage.loanAmount),
  downPayment: () => dollars(scenario.mortgage.downPayment),
  bedsBaths: () =>
    `${scenario.listing.beds} bd · ${scenario.listing.baths} ba`,
  otherApr: () => `${(scenario.mortgage.otherApr * 100).toFixed(3)}%`,
  sofiApr: () => `${(scenario.mortgage.sofiApr * 100).toFixed(2)}%`,
  otherMonthly: () => `~${dollars(scenario.mortgage.otherMonthly)}/mo`,
  sofiMonthly: () => `~${dollars(scenario.mortgage.sofiMonthly)}/mo`,
  otherMonthlyPlain: () => dollars(scenario.mortgage.otherMonthly),
  sofiMonthlyPlain: () => dollars(scenario.mortgage.sofiMonthly),
  monthlySave: () => dollars(scenario.mortgage.monthlySave),
  lifetimeSave: () => `~${dollars(scenario.mortgage.lifetimeSave)}`,
  lifetimeSavePlain: () => dollars(scenario.mortgage.lifetimeSave),
  address: () => scenario.listing.address,
  building: () => scenario.listing.building,
  neighborhood: () => scenario.listing.neighborhood,
  shortStreet: () => scenario.listing.address.split(",")[0],
  bedsBathsLoft: () => `${format.bedsBaths()} loft`,
  listingMeta: () =>
    `${scenario.listing.building} · ${scenario.listing.neighborhood}`,
  buildingCaption: () => `${scenario.listing.building} · SoMa`,
  term: () => "30-year fixed",
};

const users = [
  {
    id: 1,
    name: "Aarav Singh",
    dob: "20231201",
    sex: "male",
    pregnant: false,
    immunocompromised: false,
    conditions: [],
    vaccines: [
      {
        name: "DTaP-IPV-Hib",
        dosesReceived: 1,
        lastDoseDate: "2024-02-05",
      },
      {
        name: "Rotavirus",
        dosesReceived: 1,
        lastDoseDate: "2024-02-05",
      },
    ],
    phone: "12045905405",
    email: "felicitymalong@gmail.com",
  },
  {
    id: 2,
    name: "Maya Patel",
    dob: "2011-06-15",
    sex: "female",
    pregnant: false,
    immunocompromised: false,
    conditions: [],
    vaccines: [
      {
        name: "HPV",
        dosesReceived: 0,
        lastDoseDate: null,
      },
      {
        name: "Hepatitis B",
        dosesReceived: 2,
        lastDoseDate: "2023-03-01",
      },
    ],
  },
  {
    id: 3,
    name: "Daniel Chen",
    dob: "1995-09-20",
    sex: "male",
    pregnant: false,
    immunocompromised: false,
    conditions: [],
    vaccines: [
      {
        name: "Tdap",
        dosesReceived: 1,
        lastDoseDate: "2013-08-10",
      },
    ],
  },
  {
    id: 4,
    name: "Sofia Martinez",
    dob: "1998-04-12",
    sex: "female",
    pregnant: true,
    gestationWeeks: 28,
    immunocompromised: false,
    conditions: [],
    vaccines: [
      {
        name: "Tdap",
        dosesReceived: 1,
        lastDoseDate: "2018-05-01",
      },
    ],
  },
  {
    id: 5,
    name: "Robert Thompson",
    dob: "1955-02-10",
    sex: "male",
    pregnant: false,
    immunocompromised: true,
    conditions: ["chronic_kidney_disease"],
    vaccines: [
      {
        name: "Pneumococcal",
        dosesReceived: 0,
        lastDoseDate: null,
      },
    ],
  },
];

export default users;

const ROOTS = {
  TASK: '/task',
  REGISTER: '/register',
  CONTRACT_TYPE: '/contract-type',
  COUNTRY: '/country',
  MARITAL_STATUS: '/maritalStatus',
  EMPLOYEE: '/employee',
  REGION: '/region',
  JUSTIFICATION: '/justification',
  CITY: '/city',
  COMMUNE: '/commune',
  COMPANY: '/company',
  BRANCH: '/branch',
  JOB_TYPE: '/job-type',
  JUSTIFICATION_TYPE: '/justification-type'
}


export const paths = {
  home: '/',

  task: {
    root: `${ROOTS.TASK}/list`,
    list: `${ROOTS.TASK}/list`,
    add: `${ROOTS.TASK}/add`,
    edit: (id: string | number) => `${ROOTS.TASK}/add/${id}`
  },

  register: {
    root: `${ROOTS.REGISTER}/list`,
    list: `${ROOTS.REGISTER}/list`,
    add: `${ROOTS.REGISTER}/add`,
    edit: (id: string | number) => `${ROOTS.REGISTER}/add/${id}`
  },

  contractType: {
    root: `${ROOTS.CONTRACT_TYPE}/list`,
    list: `${ROOTS.CONTRACT_TYPE}/list`,
    add: `${ROOTS.CONTRACT_TYPE}/add`,
    edit: (id: string | number) =>
      `${ROOTS.CONTRACT_TYPE}/add/${id}`
  },

  country: {
    root: `${ROOTS.COUNTRY}/list`,
    list: `${ROOTS.COUNTRY}/list`,
    add: `${ROOTS.COUNTRY}/add`,
    edit: (id: string | number) => `${ROOTS.COUNTRY}/add/${id}`
  },
  
  maritalStatus: {
    root: `${ROOTS.MARITAL_STATUS}/list`,
    list: `${ROOTS.MARITAL_STATUS}/list`,
    add: `${ROOTS.MARITAL_STATUS}/add`,
    edit: (id: string | number) => `${ROOTS.MARITAL_STATUS}/add/${id}`
  },
  
  employee: {
    root: `${ROOTS.EMPLOYEE}/list`,
    list: `${ROOTS.EMPLOYEE}/list`,
    add: `${ROOTS.EMPLOYEE}/add`,
    edit: (id: string | number) => `${ROOTS.EMPLOYEE}/add/${id}`
  },

  branch: {
    root: `${ROOTS.BRANCH}/list`,
    list: `${ROOTS.BRANCH}/list`,
    add: `${ROOTS.BRANCH}/add`,
    edit: (id: string | number) => `${ROOTS.BRANCH}/add/${id}`
  },

  jobType: {
    root: `${ROOTS.JOB_TYPE}/list`,
    list: `${ROOTS.JOB_TYPE}/list`,
    add: `${ROOTS.JOB_TYPE}/add`,
    edit: (id: string | number) => `${ROOTS.JOB_TYPE}/add/${id}`
  },

  region: {
    root: `${ROOTS.REGION}/list`,
    list: `${ROOTS.REGION}/list`,
    add: `${ROOTS.REGION}/add`,
    edit: (id: string | number) => `${ROOTS.REGION}/add/${id}`
  },

  justification: {
    root: `${ROOTS.JUSTIFICATION}/list`,
    list: `${ROOTS.JUSTIFICATION}/list`,
    add: `${ROOTS.JUSTIFICATION}/add`,
    edit: (id: string | number) => `${ROOTS.JUSTIFICATION}/add/${id}`
  },
  
  city: {
    root: `${ROOTS.CITY}/list`,
    list: `${ROOTS.CITY}/list`,
    add: `${ROOTS.CITY}/add`,
    edit: (id: string | number) => `${ROOTS.CITY}/add/${id}`
  },

  justificationType: {
    root: `${ROOTS.JUSTIFICATION_TYPE}/list`,
    list: `${ROOTS.JUSTIFICATION_TYPE}/list`
  },

  commune: {
    root: `${ROOTS.COMMUNE}/list`,
    list: `${ROOTS.COMMUNE}/list`
  },

  company: {
    root: `${ROOTS.COMPANY}/list`,
    list: `${ROOTS.COMPANY}/list`,
    add: `${ROOTS.COMPANY}/add`,
    edit: (id: string | number) => `${ROOTS.COMPANY}/add/${id}`
  }
}

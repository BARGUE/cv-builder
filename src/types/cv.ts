import type {
  CVData,
  Experience,
  Education,
  Skill,
  Language,
} from "@/src/components/cv/types";

export type {
  CVData,
  CVListItem,
  Experience,
  Education,
  Skill,
  Language,
  CVTemplate,
} from "@/src/components/cv/types";

const defaultCVDataBase = {
  title: "Mon CV",
  template: "classic",
  accentColor: "#4F46E5",
  photoUrl: "",
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
} as const;

const emptyExperience: Experience = {
  id: "",
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};
const emptyEducation: Education = {
  id: "",
  school: "",
  degree: "",
  startDate: "",
  endDate: "",
};
const emptySkill: Skill = {
  id: "",
  name: "",
  level: 0,
};
const emptyLanguage: Language = {
  id: "",
  name: "",
  level: "Intermédiaire",
};

export const defaultCVData: CVData = {
  ...defaultCVDataBase,
  experiences: [emptyExperience],
  education: [emptyEducation],
  skills: [emptySkill],
  languages: [emptyLanguage],
  currentStep: 1,
  completed: false,
};

export const defaultImportCVData: CVData = {
  ...defaultCVDataBase,
  experiences: [emptyExperience],
  education: [emptyEducation],
  skills: [emptySkill],
  languages: [emptyLanguage],
  currentStep: 7,
  completed: true,
};

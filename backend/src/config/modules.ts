export const COURSE_MODULES = [
  'Communication Skills',
  'Leadership & Team Management',
  'Presentation Skills',
  'Time Management',
  'Emotional Intelligence',
  'Business Etiquette',
  'Interview Skills',
  'Problem Solving & Decision Making',
] as const;

export type CourseModule = (typeof COURSE_MODULES)[number];

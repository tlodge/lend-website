export interface Person {
  name: string;
  institution: string;
  profile: string;
  url?: string;
}

export type PeopleData = Person[];

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  excerpt: string;
  contentFile: string; // Path to markdown file
  tags: string[];
  featured: boolean;
  frontpage?: 1 | 2 | 3; // 1 = top, 2 = bottom left, 3 = bottom right
  image?: string; // Optional full-width image URL
  callout?: string; // Optional highlighted text for hero section
}

export type BlogData = BlogPost[];

export interface Experiment {
  id: string;
  title: string;
  location: string;
  date: string;
  duration: string;
  description: string;
  tags: string[];
  formId?: string; // Optional link to a form in forms.json
  formUrl?: string; // Optional external URL to a form
}

export type ExperimentData = Experiment[];

export interface LEAPSession {
  id: number;
  question: string;
  background: string;
  objectives: string[];
  questions: string[];
}

export type LEAPData = LEAPSession[];

export interface FormQuestion {
  id: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
}

export interface Form {
  id: string;
  title: string;
  introduction: string;
  sections: FormSection[];
}

export type FormsData = Record<string, Form>;

export interface Publication {
  title: string;
  authors: string;
  journal?: string;
  year: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  type: "poster" | "paper" | "journal" | "conference" | "workshop" | "report" | "book" | "other";
  link?: string;
  venue?: string;
}

export type PublicationData = Publication[];
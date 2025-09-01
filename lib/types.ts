export interface Person {
  name: string;
  institution: string;
  profile: string;
}

export type PeopleData = Person[];

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  featured: boolean;
  frontpage?: 1 | 2 | 3; // 1 = top, 2 = bottom left, 3 = bottom right
  image?: string; // Optional full-width image URL
  callout?: string; // Optional highlighted text for hero section
}

export type BlogData = BlogPost[];

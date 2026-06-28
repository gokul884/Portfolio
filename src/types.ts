export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'monitor' | 'smartphone' | 'layers' | 'layout';
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tag: string;
  link: string;
}

export interface SkillItem {
  id: string;
  title: string;
  experience: string;
  description: string;
  iconName: 'monitor' | 'smartphone' | 'layers' | 'layout';
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  rating: number;
  text: string;
  timeAgo: string;
  platform: 'twitter' | 'linkedin' | 'dribbble' | 'facebook' | 'instagram';
}

export interface BlogPostItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}


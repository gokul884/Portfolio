import { ServiceItem, WorkItem, SkillItem, TestimonialItem, BlogPostItem } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'poster-creation',
    title: 'Poster Creation',
    description: 'I design high-impact, visually compelling posters and marketing graphics. Combining creative typography with bold visual assets, I create flyers, banners, and digital graphics tailored to elevate your promotional campaigns.',
    iconName: 'layout',
  },
  {
    id: 'web-building',
    title: 'Website Building',
    description: 'I build fully functional, modern, responsive websites tailored to your unique requirements. Integrating clean code with modern design principles, I deliver fast, safe, and user-friendly digital experiences that scale.',
    iconName: 'monitor',
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'I optimize website structures and contents to improve search engine rankings and increase organic traffic. Through targeted keyword strategies and technical optimizations, I help your business gain maximum online visibility.',
    iconName: 'smartphone',
  },
  {
    id: 'blog-content-creation',
    title: 'Blog and Content Creation',
    description: 'I write engaging, informative, and SEO-friendly blog posts and articles. By crafting high-quality content that resonates with your target audience, I boost reader engagement and establish your brand as an industry authority.',
    iconName: 'layers',
  },
];

export const WORKS_DATA: WorkItem[] = [
  {
    id: 'digital-agency',
    title: 'Digital Agency Landing page',
    category: 'Digital Agency',
    description: "We're a design agency creating impactful solutions through strategy and design. Our designs connect, engage, and elevate your brand.",
    // Let's use a gorgeous screenshot from Unsplash for a creative agency
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    tag: 'Web Design',
    link: '#',
  },
  {
    id: 'banking-solution',
    title: 'Banking Solution Header',
    category: 'Fintech App',
    description: 'A clean, secure, and user-friendly design that highlights key banking services and makes navigation simple for users.',
    // Let's use an elegant dashboard / credit card image
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tag: 'UI/UX Design',
    link: '#',
  },
];

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'skill-web',
    title: 'Website Design',
    experience: '2+ Years Experience',
    description: 'With more than 2+ years of premium experience in this field, delivering modern, fast, and visually captivating websites that users love.',
    iconName: 'monitor',
  },
  {
    id: 'skill-resp',
    title: 'Responsive Design',
    experience: '1.5+ Years Experience',
    description: 'With more than 1.5+ years of experience in this field, refining layouts to ensure smooth operations across mobile, tablet, and desktop viewports.',
    iconName: 'smartphone',
  },
  {
    id: 'skill-sys',
    title: 'Poster Creation',
    experience: '3 months',
    description: 'With 3 months of focused experience crafting visually striking, high-impact marketing poster designs and graphic assets.',
    iconName: 'layout',
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Sarah M.',
    role: 'Marketing Director',
    company: 'Nexus Media',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'Working with this team was seamless. They understood our vision and delivered exactly what we needed—on time and beyond expectations.',
    timeAgo: '2 mins ago',
    platform: 'twitter',
  },
  {
    id: 'test-2',
    name: 'Jason R.',
    role: 'Marketing Director',
    company: 'Apex Growth',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'Their design work elevated our brand presence. Every detail was thoughtful, and the user experience was smooth and engaging.',
    timeAgo: '3 days ago',
    platform: 'linkedin',
  },
  {
    id: 'test-3',
    name: 'Fatima A.',
    role: 'Business Owner',
    company: 'Solstice Boutique',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'We saw a noticeable improvement in engagement after the new site launched. Their approach was strategic, creative, and highly professional.',
    timeAgo: '5 days ago',
    platform: 'linkedin',
  },
  {
    id: 'test-4',
    name: 'Samiul H.',
    role: 'Business Owner',
    company: 'EcomSphere',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 4,
    text: 'Thanks to their funnel strategy and clean design, our conversion rate doubled within weeks. Highly recommend for growth-focused companies.',
    timeAgo: '8 days ago',
    platform: 'dribbble',
  },
  {
    id: 'test-5',
    name: 'Anika S.',
    role: 'Brand Strategist',
    company: 'CoreBrand',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'This is our third project together, and they continue to impress. Reliable, skilled, and always pushing for better results every time.',
    timeAgo: '12 days ago',
    platform: 'facebook',
  },
  {
    id: 'test-6',
    name: 'Daniel K.',
    role: 'SaaS Startup',
    company: 'LaunchPad Co',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    text: 'As a startup, we needed speed, clarity, and impact. They delivered all three—and helped us launch with absolute confidence.',
    timeAgo: '16 days ago',
    platform: 'instagram',
  },
];

export const BLOGS_DATA: BlogPostItem[] = [
  {
    id: 'design-systems',
    title: 'The Anatomy of a Modern Minimalist Design System',
    summary: 'Discover how to build lightweight, scaleable, and highly consistent UI components that empower product design teams to ship fast.',
    content: `
      <p class="mb-4">Design systems are no longer a luxury; they are the fundamental backbone of modern digital product development. But when we talk about a <em>minimalist</em> design system, we focus strictly on removing friction, minimizing visual clutter, and maximizing efficiency.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">1. Establishing Token-Based Architecture</h3>
      <p class="mb-4">At the core of any functional design system lies design tokens. Design tokens are the absolute visual atoms of the interface: color variables, font weights, transition rates, and spacing scales. By utilizing tailwind classes or CSS custom properties, we ensure that changing the "primary-brand" token updates every single button, link, and accent across the whole product suite instantly.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">2. The Rule of Single Responsibility for Components</h3>
      <p class="mb-4">When designing components, always resist the temptation to build a "Swiss-army knife" component. A button should be a button; do not try to make it double as a dropdown container, a chip, or a navigation link. Keep properties clear, types rigid, and structure predictable.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">3. Documenting as You Build</h3>
      <p class="mb-4">A design system that isn't documented is essentially non-existent. Use tools like Storybook or native documentation pages inside your app to show real interactive states. Developers should never have to guess whether to use <code>py-3</code> or <code>py-4</code>; the system should dictate it clearly.</p>
    `,
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'June 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Gokul Krisnan',
      role: 'Digital Marketer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    },
  },
  {
    id: 'typography-ux',
    title: 'Why Typography is 90% of Your User Experience',
    summary: 'A deep dive into hierarchy, line-heights, tracking, and the psychology of reading online. Learn how to captivate visitors with typeface pairings.',
    content: `
      <p class="mb-4">It is often said in web design circles that "Web design is 95% typography." When you strip away the custom interactive animations, the bento grids, and the colored borders, what remains is your content. And your content is text.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">1. Choosing the Right Font Stack</h3>
      <p class="mb-4">The font selection defines the personality and mood of the interface. Geometric sans-serifs like <em>Plus Jakarta Sans</em> or <em>Space Grotesk</em> convey a forward-looking, highly technical, and pristine look, while elegant monospaces provide a functional, layout-driven design accent. Always pair high-character display headings with highly legible, neutrally designed body fonts like <em>Inter</em>.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">2. Scale and Vertical Rhythm</h3>
      <p class="mb-4">Establish a clear typographic scale. Your <code>h1</code> should stand out from your <code>h2</code>, which should clearly dominate body text. More importantly, pay attention to line heights (leading) and character tracking. For display sizes, tighter tracking (e.g., <code>tracking-tight</code>) makes headings look unified and intentional. For body text, a spacious line-height (like <code>leading-relaxed</code>) reduces visual fatigue significantly.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">3. Visual Contrast and Hierarchy</h3>
      <p class="mb-4">You do not always need to make text larger to create hierarchy. Often, playing with font weights (bold vs medium vs regular) or color density (deep charcoal for headings, stone-500 for secondary text, and soft gray for timestamps) achieves a far cleaner and more sophisticated hierarchy.</p>
    `,
    category: 'Typography',
    readTime: '4 min read',
    date: 'June 18, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Gokul Krisnan',
      role: 'Digital Marketer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    },
  },
  {
    id: 'micro-animations',
    title: 'Mastering the Power of Micro-Animations in React',
    summary: 'A look into how micro-interactions, subtle hover states, and staggered entrance transitions elevate the premium feel of web layouts.',
    content: `
      <p class="mb-4">Have you ever visited a website that felt static and lifeless, almost like a print PDF? And conversely, have you visited a site that felt instantly satisfying, reactive, and organic? The difference is usually in the execution of micro-animations.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">1. Micro-interactions Provide Feedback</h3>
      <p class="mb-4">When a user clicks a button, hover over an image, or successfully submits a contact inquiry, there should be instant physical feedback. Simple button scales, subtle color shifts, or icons that animate slightly (like an arrow sliding to the right) signal to the user that their action was detected and processed.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">2. Avoiding Cognitive Load with Spring Physics</h3>
      <p class="mb-4">Avoid aggressive, linear CSS transitions. They feel rigid and fake. Instead, utilize spring physics (via <code>motion/react</code> or similar libraries). Spring curves model the natural elasticity of the real world—smoothly accelerating and gently decelerating without jarring stops. This feels comforting and professional.</p>
      
      <h3 class="text-lg font-bold font-display text-stone-900 mt-6 mb-3">3. Staggering Lists for Premium Entrances</h3>
      <p class="mb-4">When a user scrolls down to a section, animating elements in a staggered order (first card, then second, then third, with 100ms delays) guides the user's eye naturally from left to right, creating a sense of curation, luxury, and care.</p>
    `,
    category: 'Motion Design',
    readTime: '6 min read',
    date: 'June 12, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Gokul Krisnan',
      role: 'Digital Marketer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    },
  },
];


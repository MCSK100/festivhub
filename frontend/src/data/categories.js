export const CATEGORIES = [
  { name: 'Photography', icon: '📸', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
  { name: 'Videography', icon: '🎬', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop' },
  { name: 'Catering', icon: '🍽️', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop' },
  { name: 'Decoration', icon: '✨', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop' },
  { name: 'Makeup & Beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop' },
  { name: 'DJ & Music', icon: '🎵', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop' },
  { name: 'Event Planning', icon: '📋', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop' },
  { name: 'Venues', icon: '🏛️', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop' },
  { name: 'Mehendi', icon: '🤲', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop' },
  { name: 'Invitation & Printing', icon: '💌', image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=600&auto=format&fit=crop' },
  { name: 'Florists', icon: '💐', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&auto=format&fit=crop' },
  { name: 'Entertainment', icon: '🎭', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop' },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export const FILTER_CATEGORIES = ['All', ...CATEGORY_NAMES.slice(0, 7)]

export const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Reception',
  'Haldi / Mehendi',
  'Sangeet',
  'Birthday',
  'Corporate Event',
  'Festival',
  'Concert',
  'Baby Shower',
  'Housewarming',
  'Other',
]

export const POPULAR_LOCATIONS = ['Coimbatore', 'Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Kochi', 'Madurai']

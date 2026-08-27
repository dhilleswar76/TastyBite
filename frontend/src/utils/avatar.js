// Generates a consistent, vibrant gradient based on the reviewer or user name
export const getAvatarGradient = (name = '') => {
  const gradients = [
    'linear-gradient(135deg, #ff5722 0%, #d84315 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

// Extracts user initials (e.g. "Priya Sharma" -> "PS", "Vikram" -> "V")
export const getInitials = (name = '') => {
  if (!name || typeof name !== 'string') return 'TB';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TB';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const PRESET_AVATARS = [
  { label: 'Chef', emoji: '👨‍🍳' },
  { label: 'Foodie', emoji: '👩‍🍳' },
  { label: 'Gourmet', emoji: '😋' },
  { label: 'Biryani Fan', emoji: '🍛' },
  { label: 'Tandoor Fan', emoji: '🍗' },
  { label: 'Dessert Lover', emoji: '🍨' },
  { label: 'VIP Diner', emoji: '👑' },
  { label: 'Star Foodie', emoji: '🌟' },
];

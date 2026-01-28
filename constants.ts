import { Product, Testimonial } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NeuralNet Optimizer',
    shortDescription: 'AI-driven system performance booster.',
    description: 'Optimize your PC performance with our award-winning neural network algorithms. Cleans registry, optimizes RAM, and boosts FPS in real-time.',
    price: 49.99,
    category: 'Utility',
    rating: 4.9,
    reviews: 1240,
    image: 'https://picsum.photos/400/400?random=1',
    features: ['AI RAM Management', 'Registry Repair', 'Game Mode 2.0', 'Auto-Updates'],
    version: '4.2.0',
    downloadSize: '450 MB'
  },
  {
    id: '2',
    name: 'CyberGuard VPN',
    shortDescription: 'Military-grade encryption for total privacy.',
    description: 'Browse the web anonymously with zero logs. Features split-tunneling, kill switch, and multi-hop connections.',
    price: 29.99,
    category: 'Security',
    rating: 4.8,
    reviews: 850,
    image: 'https://picsum.photos/400/400?random=2',
    features: ['AES-256 Encryption', 'No-Log Policy', '5000+ Servers', 'P2P Support'],
    version: '2.1.5',
    downloadSize: '120 MB'
  },
  {
    id: '3',
    name: 'PixelWeaver Studio',
    shortDescription: 'Professional graphics editing suite.',
    description: 'A lightweight yet powerful alternative to heavy design software. GPU-accelerated rendering and AI object removal.',
    price: 89.99,
    category: 'Design',
    rating: 4.7,
    reviews: 630,
    image: 'https://picsum.photos/400/400?random=3',
    features: ['GPU Acceleration', 'AI Fill', 'Vector Support', 'PSD Compatibility'],
    version: '1.0.8',
    downloadSize: '1.2 GB'
  },
  {
    id: '4',
    name: 'CodeFlow IDE',
    shortDescription: 'The fastest IDE for React & Rust.',
    description: 'Built for speed. Instant startup, zero-latency typing, and integrated AI copilot that actually understands your codebase.',
    price: 0.00,
    category: 'Utility',
    rating: 4.9,
    reviews: 2100,
    image: 'https://picsum.photos/400/400?random=4',
    features: ['Instant Load', 'Built-in Copilot', 'Remote Dev', 'Vim Mode'],
    version: '3.3.1',
    downloadSize: '200 MB'
  },
  {
    id: '5',
    name: 'Nebula Streamer',
    shortDescription: 'Lossless 4K streaming toolkit.',
    description: 'Broadcast to Twitch and YouTube simultaneously with zero performance impact on your game.',
    price: 39.99,
    category: 'Gaming',
    rating: 4.6,
    reviews: 420,
    image: 'https://picsum.photos/400/400?random=5',
    features: ['Multi-stream', 'Overlay Editor', 'Chat Bot', 'Replay Buffer'],
    version: '5.0.0',
    downloadSize: '350 MB'
  },
  {
    id: '6',
    name: 'CryptVault Pro',
    shortDescription: 'Secure offline password manager.',
    description: 'Keep your credentials safe in a local, encrypted vault. Never upload your keys to the cloud.',
    price: 19.99,
    category: 'Security',
    rating: 4.8,
    reviews: 310,
    image: 'https://picsum.photos/400/400?random=6',
    features: ['Local Only', 'Biometric Unlock', 'Auto-Type', 'Breach Monitor'],
    version: '2.4.1',
    downloadSize: '85 MB'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Full Stack Dev',
    content: "CortexFile's software library is unmatched. CodeFlow IDE changed how I work daily. The UI is just stunning.",
    avatar: 'https://picsum.photos/100/100?random=10'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Cybersecurity Analyst',
    content: "CyberGuard VPN is the only tool I trust for my sensitive client communications. Fast, reliable, and secure.",
    avatar: 'https://picsum.photos/100/100?random=11'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Digital Artist',
    content: "PixelWeaver is incredibly fast. I replaced my subscription software with this one-time purchase and haven't looked back.",
    avatar: 'https://picsum.photos/100/100?random=12'
  }
];

export interface TeamMember {
    id: number
    name: string
    role: string
    specialty: string
    bio: string
    years: number
    image: string    // Unsplash avatar URL
    instagram?: string
}

export const team: TeamMember[] = [
    {
        id: 1,
        name: 'Priya Nair',
        role: 'Color Specialist',
        specialty: 'Balayage & Highlights',
        bio: 'Fifteen years perfecting balayage and highlights. She sees dimension where others see flat.',
        years: 15,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        instagram: '#',
    },
    {
        id: 2,
        name: 'Arjun Menon',
        role: 'Precision Cuts',
        specialty: 'Haircuts & Fades',
        bio: 'Sharp lines and sharper instincts. He listens first, cuts second, and the results speak.',
        years: 10,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        instagram: '#',
    },
    {
        id: 3,
        name: 'Divya Sharma',
        role: 'Bridal Artistry',
        specialty: 'Bridal Hair & Makeup',
        bio: 'She builds styles that hold through dancing and photographs. Your day gets the attention it deserves.',
        years: 8,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        instagram: '#',
    },
    {
        id: 4,
        name: 'Vikram Das',
        role: "Men's Grooming",
        specialty: 'Cuts & Beard Styling',
        bio: 'Beards and cuts handled with equal precision. Clean, sharp, confident. That\'s the standard here.',
        years: 7,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        instagram: '#',
    },
    {
        id: 5,
        name: 'Anjali Krishnan',
        role: 'Hair Treatments',
        specialty: 'Keratin & Hair Spa',
        bio: 'Keratin, spa, restoration. She rebuilds what time and heat have worn down to nothing.',
        years: 6,
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
        instagram: '#',
    },
    {
        id: 6,
        name: 'Rohan Patel',
        role: 'Makeup Artist',
        specialty: 'Makeup & Styling',
        bio: 'Color and technique that enhance what you have. He makes you look like yourself, only better.',
        years: 5,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        instagram: '#',
    },
    {
        id: 7,
        name: 'Sneha Iyer',
        role: 'Nail Care',
        specialty: 'Gel Nails & Nail Art',
        bio: 'Finished hands complete the picture. Precision and quality products in every application.',
        years: 4,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
        instagram: '#',
    },
]

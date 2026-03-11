export interface Service {
    slug: string
    title: string
    icon: string        // Lucide icon name
    shortDesc: string        // 1-line — used on cards
    longDesc: string        // 2-3 sentences — used on detail page
    subServices: string[]      // bullet list on detail page
    image: string        // Unsplash URL
    startingPrice: number        // in ₹
    duration: string        // e.g. "45–60 mins"
    tag?: string        // optional badge e.g. "Most Popular"
}

export const services: Service[] = [
    {
        slug: 'haircuts-styling',
        title: 'Haircuts & Styling',
        icon: 'Scissors',
        shortDesc: 'Clean lines and sharp edges. We listen to what you want and deliver it.',
        longDesc: 'Each cut is designed to work with your natural texture and grow out beautifully. We consult before we touch the scissors. No surprises — just the result you came for.',
        subServices: ['Ladies Haircut', 'Gents Haircut', 'Kids Haircut', 'Blow Dry', 'Hair Setting', 'Trim & Shape'],
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
        startingPrice: 350,
        duration: '30–60 mins',
        tag: 'Most Popular',
    },
    {
        slug: 'hair-coloring',
        title: 'Hair Color',
        icon: 'Palette',
        shortDesc: 'Balayage, highlights, global color, and correction. Vibrant. Lasting. Precise.',
        longDesc: 'From subtle sun-kissed balayage to bold full-color transformations. We use professional-grade products that protect while they color. Every shade is mixed to suit your skin tone.',
        subServices: ['Global Color', 'Balayage', 'Highlights', 'Ombre', 'Color Correction', 'Toning & Gloss'],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
        startingPrice: 1200,
        duration: '90–180 mins',
        tag: 'Trending',
    },
    {
        slug: 'hair-treatments',
        title: 'Treatments',
        icon: 'Sparkles',
        shortDesc: 'Keratin, spa, restoration. We rebuild what time and heat have worn down.',
        longDesc: 'Every treatment is customized to your hair\'s current condition and goal. We assess before we apply. The result is hair that looks and feels better than it has in years.',
        subServices: ['Hair Spa', 'Keratin Treatment', 'Smoothening', 'Deep Conditioning', 'Scalp Treatment', 'Aromatherapy'],
        image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80',
        startingPrice: 800,
        duration: '60–120 mins',
    },
    {
        slug: 'bridal-styling',
        title: 'Bridal Styling',
        icon: 'Crown',
        shortDesc: 'She builds styles that hold through dancing and photographs.',
        longDesc: 'Your wedding day gets the full attention it deserves, from trial to the big day. We build styles that hold through celebration, photography, and everything in between.',
        subServices: ['Bridal Hair', 'Bridal Makeup', 'Pre-Bridal Package', 'Trial Session', 'Party Makeup', 'Saree Draping'],
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        startingPrice: 8000,
        duration: '3–6 hours',
        tag: 'Premium',
    },
    {
        slug: 'mens-grooming',
        title: "Men's Grooming",
        icon: 'Zap',
        shortDesc: 'Beards and cuts handled with equal precision. Clean, sharp, confident.',
        longDesc: 'That\'s the standard here. No compromise on technique. Whether it\'s a fade, a beard shape-up, or a full grooming session — we handle it with skill.',
        subServices: ['Haircut', 'Beard Trim', 'Beard Styling', 'Clean Shave', 'Scalp Treatment', 'Hair Color (Men)'],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b28f1f?w=800&q=80',
        startingPrice: 250,
        duration: '30–45 mins',
    },
    {
        slug: 'makeup',
        title: 'Makeup',
        icon: 'Wand2',
        shortDesc: 'Color and technique that enhance what you have.',
        longDesc: 'We make you look like yourself — only better. Available for all events and occasions, from casual parties to full bridal looks. We use only professional-grade products.',
        subServices: ['Party Makeup', 'Bridal Makeup', 'Engagement Makeup', 'Photoshoot Makeup', 'Airbrush Makeup', 'HD Makeup'],
        image: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80',
        startingPrice: 1500,
        duration: '60–90 mins',
    },
    {
        slug: 'nail-care',
        title: 'Nail Care',
        icon: 'Hand',
        shortDesc: 'Finished hands complete the picture. Precision in every application.',
        longDesc: 'Quality products and skilled technicians in every session. We do nails that last, look flawless, and feel professional. From simple manicures to elaborate nail art.',
        subServices: ['Basic Manicure', 'Gel Manicure', 'Basic Pedicure', 'Spa Pedicure', 'Nail Art', 'Gel Extensions', 'Nail Repair'],
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
        startingPrice: 400,
        duration: '45–90 mins',
    },
]

export const getServiceBySlug = (slug: string): Service | undefined =>
    services.find(s => s.slug === slug)

export const getFeaturedServices = () => services.filter(s => s.tag === 'Most Popular' || s.tag === 'Premium')

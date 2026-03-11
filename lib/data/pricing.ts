export interface PriceItem {
    name: string
    price: number       // in ₹
    note?: string       // e.g. "per session" or "starting from"
}

export interface PriceCategory {
    category: string
    items: PriceItem[]
}

export const pricingTable: PriceCategory[] = [
    {
        category: 'Haircuts',
        items: [
            { name: 'Ladies Haircut', price: 350 },
            { name: 'Gents Haircut', price: 250 },
            { name: 'Kids Haircut', price: 200 },
            { name: 'Blow Dry', price: 300 },
            { name: 'Hair Setting', price: 400 },
        ],
    },
    {
        category: 'Hair Coloring',
        items: [
            { name: 'Global Color', price: 1200, note: 'starting from' },
            { name: 'Highlights', price: 1800, note: 'starting from' },
            { name: 'Balayage', price: 2500, note: 'starting from' },
            { name: 'Ombre', price: 2000, note: 'starting from' },
            { name: 'Color Correction', price: 3500, note: 'starting from' },
            { name: 'Toning & Gloss', price: 800 },
        ],
    },
    {
        category: 'Treatments',
        items: [
            { name: 'Hair Spa', price: 800 },
            { name: 'Keratin Treatment', price: 3500, note: 'starting from' },
            { name: 'Smoothening', price: 4000, note: 'starting from' },
            { name: 'Deep Conditioning', price: 600 },
            { name: 'Scalp Treatment', price: 900 },
            { name: 'Aromatherapy', price: 700 },
        ],
    },
    {
        category: "Men's Grooming",
        items: [
            { name: 'Haircut', price: 250 },
            { name: 'Beard Trim', price: 150 },
            { name: 'Beard Styling', price: 200 },
            { name: 'Clean Shave', price: 180 },
            { name: 'Scalp Treatment (Men)', price: 600 },
            { name: 'Hair Color (Men)', price: 800, note: 'starting from' },
        ],
    },
    {
        category: 'Makeup',
        items: [
            { name: 'Party Makeup', price: 1500 },
            { name: 'Engagement Makeup', price: 2500 },
            { name: 'Bridal Makeup', price: 5000, note: 'starting from' },
            { name: 'Airbrush Makeup', price: 3500 },
            { name: 'HD Makeup', price: 4000 },
        ],
    },
    {
        category: 'Nail Care',
        items: [
            { name: 'Basic Manicure', price: 400 },
            { name: 'Gel Manicure', price: 700 },
            { name: 'Basic Pedicure', price: 500 },
            { name: 'Spa Pedicure', price: 900 },
            { name: 'Nail Art', price: 300, note: 'per nail design' },
            { name: 'Gel Extensions', price: 1200 },
            { name: 'Nail Repair', price: 200 },
        ],
    },
    {
        category: 'Bridal Packages',
        items: [
            { name: 'Basic Bridal', price: 8000, note: 'hair + makeup' },
            { name: 'Premium Bridal', price: 15000, note: 'hair + makeup + nails' },
            { name: 'Full Day Bridal', price: 22000, note: 'all day + trial session' },
        ],
    },
]

export interface Membership {
    tier: string
    subtitle: string
    price: number
    period: string
    popular: boolean
    features: string[]
    cta: string
}

export const memberships: Membership[] = [
    {
        tier: 'Single Visit',
        subtitle: 'One service',
        price: 1500,
        period: 'per appointment',
        popular: false,
        features: [
            'One haircut or color service',
            'Consultation included',
            'Expert stylist assigned',
            'No commitment required',
        ],
        cta: 'Book Now',
    },
    {
        tier: 'Monthly Membership',
        subtitle: 'Unlimited visits',
        price: 4500,
        period: 'per month',
        popular: true,
        features: [
            'Two services monthly',
            'Priority booking',
            '15% discount on all services',
            'Guest privileges',
            'Free treatment quarterly',
            'WhatsApp stylist access',
        ],
        cta: 'Join Monthly',
    },
    {
        tier: 'Annual Membership',
        subtitle: 'Best value',
        price: 45000,
        period: 'per year',
        popular: false,
        features: [
            'Unlimited services all year',
            '25% discount always',
            'Priority + weekend slots',
            'Free bridal trial session',
            'Birthday special treatment',
            'Dedicated personal stylist',
            'Free monthly deep conditioning',
        ],
        cta: 'Join Annual',
    },
]

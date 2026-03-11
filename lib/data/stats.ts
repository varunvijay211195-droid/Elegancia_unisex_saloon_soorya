export interface Stat {
    label: string;
    sublabel: string;
    end: number;
    suffix: string;
}

export const stats: Stat[] = [
    {
        label: 'Transformations',
        sublabel: 'Shaped with precision',
        end: 10000,
        suffix: '+',
    },
    {
        label: 'Years Experience',
        sublabel: 'A legacy of style',
        end: 15,
        suffix: '+',
    },
    {
        label: 'Return Rate',
        sublabel: 'Trusted by many',
        end: 94,
        suffix: '%',
    },
    {
        label: 'Expert Stylists',
        sublabel: 'Dedicated to you',
        end: 12,
        suffix: '+',
    },
];

'use server';

import { createClient } from '@/lib/supabase/server';
import { sendBookingConfirmation } from './email';
import { notifyAdmins } from './engagement';

export async function createBooking(formData: {
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email?: string;
    notes?: string;
}) {
    const supabase = await createClient();

    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Insert booking into Supabase
    const { data, error } = await supabase
        .from('bookings')
        .insert({
            service_id: formData.serviceId,
            service_name: formData.serviceName,
            date: formData.date,         // actual DB column name
            time: formData.time,          // actual DB column name
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email || null,
            notes: formData.notes || null,
            user_id: user?.id || null,    // Associate with logged in user
            status: 'pending'             // Explicitly set initial status
        })
        .select()
        .single();

    if (error) {
        console.error('Booking error:', error);
        return { success: false, error: error.message };
    }

    // 1. Notify Admins in real-time
    await notifyAdmins(
        'New Ritual Requested',
        `${formData.name} requested a ${formData.serviceName} for ${formData.date} at ${formData.time}.`,
        'booking_new',
        { booking_id: data.id }
    );

    // 2. Send confirmation email if email provided
    if (formData.email) {
        await sendBookingConfirmation(formData.email, {
            serviceName: formData.serviceName,
            date: formData.date,
            time: formData.time,
            name: formData.name,
        });
    }

    return { success: true, data };
}

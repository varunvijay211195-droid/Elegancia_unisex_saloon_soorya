'use server';

import { createClient } from '@/lib/supabase/server';
import { notifyAdmins } from './engagement';

// Get customer points
export async function getCustomerPoints(customerId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('customer_points')
        .select(`
      *,
      profiles:customer_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
        .eq('customer_id', customerId)
        .single();

    if (error) {
        console.error('Error fetching customer points:', error);
        return null;
    }

    return data;
}

// Get all customers with points (admin view)
export async function getAllCustomerPoints() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('customer_points')
        .select(`
      *,
      profiles:customer_id (
        id,
        full_name,
        email,
        avatar_url,
        created_at
      )
    `)
        .order('available_points', { ascending: false });

    if (error) {
        console.error('Error fetching all customer points:', error);
        return [];
    }

    return data;
}

// Get points transactions for a customer
export async function getPointsTransactions(customerId: string, limit = 20) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    return data;
}

// Get all points transactions (admin view)
export async function getAllPointsTransactions(limit = 100) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('points_transactions')
        .select(`
            id,
            points,
            transaction_type,
            description,
            created_at,
            profiles:customer_id (
                id,
                full_name,
                email
            )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching all transactions:', error);
        return [];
    }

    return data;
}

// Add points to customer (called after booking completion)
export async function addPointsToCustomer(
    customerId: string,
    points: number,
    description: string,
    bookingId?: string
) {
    const supabase = await createClient();

    // Get loyalty program settings
    const { data: program } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('is_active', true)
        .single();

    // Calculate bonus points based on tier
    const { data: customerPoints } = await supabase
        .from('customer_points')
        .select('tier')
        .eq('customer_id', customerId)
        .single();

    let bonusPercentage = 0;
    if (customerPoints?.tier) {
        const { data: tierBenefit } = await supabase
            .from('tier_benefits')
            .select('bonus_percentage')
            .eq('tier_name', customerPoints.tier)
            .single();
        bonusPercentage = tierBenefit?.bonus_percentage || 0;
    }

    // Apply tier bonus
    const totalPoints = Math.round(points * (1 + bonusPercentage / 100));

    // Call the database function
    const { data, error } = await supabase.rpc('add_loyalty_points', {
        p_customer_id: customerId,
        p_points: totalPoints,
        p_transaction_type: 'earn',
        p_description: description,
        p_booking_id: bookingId || null
    });

    if (error) {
        console.error('Error adding points:', error);
        return { success: false, error: error.message };
    }

    // Notify admins of significant point additions
    if (totalPoints >= 100) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', customerId)
            .single();

        await notifyAdmins(
            'Points Earned',
            `${profile?.full_name || 'A customer'} earned ${totalPoints} loyalty points!`,
            'points_earned',
            { customer_id: customerId, points: totalPoints }
        );
    }

    return { success: true, points: totalPoints };
}

// Redeem points for customer
export async function redeemPoints(
    customerId: string,
    points: number,
    description: string
) {
    const supabase = await createClient();

    // Check if customer has enough points
    const { data: currentPoints } = await supabase
        .from('customer_points')
        .select('available_points')
        .eq('customer_id', customerId)
        .single();

    if (!currentPoints || currentPoints.available_points < points) {
        return { success: false, error: 'Insufficient points' };
    }

    // Call the database function
    const { error } = await supabase.rpc('redeem_loyalty_points', {
        p_customer_id: customerId,
        p_points: points,
        p_description: description
    });

    if (error) {
        console.error('Error redeeming points:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Manual points adjustment (admin only)
export async function adjustPoints(
    customerId: string,
    points: number,
    type: 'add' | 'subtract',
    reason: string
) {
    const supabase = await createClient();

    const transactionType = type === 'add' ? 'bonus' : 'redeem';
    const finalPoints = type === 'add' ? points : -points;

    const { error } = await supabase.rpc('add_loyalty_points', {
        p_customer_id: customerId,
        p_points: finalPoints,
        p_transaction_type: transactionType,
        p_description: reason,
        p_booking_id: null
    });

    if (error) {
        console.error('Error adjusting points:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Get referral for a customer
export async function getCustomerReferral(customerId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', customerId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching referral:', error);
        return null;
    }

    return data;
}

// Create referral code for customer
export async function createReferralCode(customerId: string) {
    const supabase = await createClient();

    // Check if customer already has a referral code
    const { data: existing } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', customerId)
        .single();

    if (existing) {
        return { success: true, code: existing.referral_code };
    }

    // Generate new code using database function
    const { data: code, error: codeError } = await supabase.rpc('generate_referral_code');

    if (codeError || !code) {
        console.error('Error generating code:', codeError);
        // Fallback to simple random code
        const fallbackCode = 'ELG' + Math.random().toString(36).substring(2, 8).toUpperCase();

        const { error: insertError } = await supabase
            .from('referrals')
            .insert({
                referrer_id: customerId,
                referral_code: fallbackCode,
                referrer_reward_points: 100,
                referee_reward_points: 50,
                status: 'pending'
            });

        if (insertError) {
            return { success: false, error: insertError.message };
        }

        return { success: true, code: fallbackCode };
    }

    // Insert new referral
    const { error: insertError } = await supabase
        .from('referrals')
        .insert({
            referrer_id: customerId,
            referral_code: code,
            referrer_reward_points: 100,
            referee_reward_points: 50,
            status: 'pending'
        });

    if (insertError) {
        console.error('Error creating referral:', insertError);
        return { success: false, error: insertError.message };
    }

    return { success: true, code };
}

// Validate and use referral code
export async function useReferralCode(code: string, refereeId: string) {
    const supabase = await createClient();

    // Find the referral by code
    const { data: referral, error: findError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', code.toUpperCase())
        .eq('status', 'pending')
        .single();

    if (findError || !referral) {
        return { success: false, error: 'Invalid or expired referral code' };
    }

    // Can't refer yourself
    if (referral.referrer_id === refereeId) {
        return { success: false, error: 'You cannot use your own referral code' };
    }

    // Complete the referral using database function
    const { error: completeError } = await supabase.rpc('complete_referral', {
        p_referral_id: referral.id,
        p_referee_id: refereeId
    });

    if (completeError) {
        console.error('Error completing referral:', completeError);
        return { success: false, error: completeError.message };
    }

    return { success: true, message: 'Referral applied! You earned bonus points.' };
}

// Get all referrals (admin)
export async function getAllReferrals() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('referrals')
        .select(`
      *,
      referrer:profiles!referrals_referrer_id_fkey (
        id,
        full_name,
        email
      )
    `)
        .order('referred_at', { ascending: false });

    if (error) {
        console.error('Error fetching referrals:', error);
        return [];
    }

    return data;
}

// Get loyalty program settings
export async function getLoyaltySettings() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching loyalty settings:', error);
        return null;
    }

    return data;
}

// Update loyalty settings (admin)
export async function updateLoyaltySettings(settings: {
    points_per_rupee?: number;
    points_to_redeem?: number;
    rupee_value_per_point?: number;
    is_active?: boolean;
}) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('loyalty_programs')
        .update({
            ...settings,
            updated_at: new Date().toISOString()
        })
        .eq('is_active', true);

    if (error) {
        console.error('Error updating loyalty settings:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Get tier benefits
export async function getTierBenefits() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tier_benefits')
        .select('*')
        .order('min_points', { ascending: true });

    if (error) {
        console.error('Error fetching tier benefits:', error);
        return [];
    }

    return data;
}

// Get loyalty statistics (admin dashboard)
export async function getLoyaltyStats() {
    const supabase = await createClient();

    // Total points outstanding
    const { data: allPoints } = await supabase
        .from('customer_points')
        .select('available_points');
    const totalPointsOutstanding = allPoints?.reduce((sum, p) => sum + (p.available_points || 0), 0) || 0;

    // Total customers in program
    const { data: allCustomers } = await supabase
        .from('customer_points')
        .select('customer_id');
    const totalCustomers = allCustomers?.length || 0;

    // Tier distribution
    const { data: tierData } = await supabase
        .from('customer_points')
        .select('tier');
    const tierDistribution = tierData?.reduce((acc: Record<string, number>, item) => {
        const tier = item.tier || 'bronze';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
    }, {}) || [];

    // This month's points earned
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: earnedData } = await supabase
        .from('points_transactions')
        .select('points')
        .gte('created_at', monthStart)
        .eq('transaction_type', 'earn');
    const monthlyEarned = earnedData?.reduce((sum, item) => sum + (item.points || 0), 0) || 0;

    // This month's points redeemed
    const { data: redeemedData } = await supabase
        .from('points_transactions')
        .select('points')
        .gte('created_at', monthStart)
        .eq('transaction_type', 'redeem');
    const monthlyRedeemed = Math.abs(redeemedData?.reduce((sum, item) => sum + (item.points || 0), 0) || 0);

    // Total referrals
    const { data: referralsData } = await supabase
        .from('referrals')
        .select('id')
        .eq('status', 'completed');
    const totalReferrals = referralsData?.length || 0;

    // Top point earners
    const { data: topEarners } = await supabase
        .from('customer_points')
        .select(`
      available_points,
      lifetime_points,
      profiles:customer_id (
        full_name
      )
    `)
        .order('lifetime_points', { ascending: false })
        .limit(5);

    return {
        totalPointsOutstanding,
        totalCustomers,
        tierDistribution,
        monthlyEarned,
        monthlyRedeemed,
        totalReferrals,
        topEarners: topEarners || []
    };
}

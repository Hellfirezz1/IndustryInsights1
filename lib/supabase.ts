import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Get the site URL for redirects
const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'industry-digest@0.1.0'
    }
  }
});

export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscriptionstatus, trialStartDate')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user subscription status:', error);
    return null;
  }
};

export const updateUserNiches = async (userId: string, niches: string[]) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ niches })
      .eq('id', userId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user niches:', error);
    throw error;
  }
};

export const updateSubscriptionStatus = async (userId: string, status: 'pending' | 'trial' | 'active' | 'expired') => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        subscriptionstatus: status,
        trialStartDate: status === 'trial' ? new Date().toISOString() : null
      })
      .eq('id', userId);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};

export const getDigests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('digests')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting digests:', error);
    return [];
  }
};

export const getDigestById = async (digestId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('digests')
      .select('*')
      .eq('id', digestId)
      .eq('userId', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting digest by id:', error);
    return null;
  }
};
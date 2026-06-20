"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  console.log('[LOGIN ACTION] Started login attempt');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    console.log('[LOGIN ACTION] Missing email or password');
    return { error: 'Email and password are required' };
  }

  console.log(`[LOGIN ACTION] Attempting to sign in user: ${email}`);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  

  if (error) {
    console.log('[LOGIN ACTION] Supabase error:', error.message);
    return { error: error.message };
  }

  console.log('[LOGIN ACTION] Login successful. User:', data?.user?.id);
  console.log('[LOGIN ACTION] Session:', !!data?.session);

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !name) {
    return { error: 'Name, email, and password are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  console.log('[SIGNUP ACTION] Error:', error);
  console.log('[SIGNUP ACTION] Data session exists:', !!data?.session);
  console.log('[SIGNUP ACTION] Data user exists:', !!data?.user);

  if (error) {
    return { error: error.message };
  }

  // FORCE SET A TEST COOKIE
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set('test_cookie', 'works', { path: '/' });
  console.log('[SIGNUP ACTION] Manually set test_cookie');

  // If email confirmation is disabled, user is signed in immediately
  // If enabled, they need to check their email
  if (data.session) {
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  } else {
    // Usually means email already exists or confirm email is still required
    console.log('[SIGNUP ACTION] Session is null! Returning check email message.');
    return { success: 'Please check your email to confirm your account. (If you disabled confirm email, this means the email is already registered!)' };
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    return { error: error.message };
  }
}

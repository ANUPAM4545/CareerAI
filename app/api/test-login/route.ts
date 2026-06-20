import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'rohan@13gmail.com',
      password: 'password' // I don't know the password, but we will see if getAll is called
    });

    return NextResponse.json({ success: true, data, error });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
  
}

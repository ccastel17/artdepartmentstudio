import { NextResponse } from 'next/server';

export async function POST() {
  console.log('🚪 Logout request received');
  
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  response.cookies.delete('auth-token');
  
  console.log('✅ Logout successful, cookie deleted');

  return response;
}

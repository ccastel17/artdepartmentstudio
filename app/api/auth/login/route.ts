import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    console.log('🔐 Login attempt started');
    
    const body = await request.json();
    const { username, password } = body;

    console.log('📝 Username received:', username);

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { error: 'Usuario y contraseña requeridos' },
        { status: 400 }
      );
    }

    console.log('🔌 Connecting to database...');
    const client = await clientPromise;
    const db = client.db();

    console.log('🔍 Looking for user:', username);
    const user = await db.collection('users').findOne({ username });

    if (!user) {
      console.log('❌ User not found:', username);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('✅ User found, verifying password...');
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      console.log('❌ Invalid password for user:', username);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('✅ Password valid, generating token...');
    const token = generateToken(user._id.toString());
    console.log('🎫 Token generated:', token.substring(0, 20) + '...');

    const response = NextResponse.json(
      { message: 'Login exitoso', success: true },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('🍪 Cookie set successfully');
    console.log('✅ Login completed successfully for user:', username);

    return response;
  } catch (error) {
    console.error('❌ Error en login:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Error al iniciar sesión', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

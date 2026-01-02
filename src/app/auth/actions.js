'use server'

import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function registerUser(formData) {
  try {
      await dbConnect();

      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');

      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return { success: true };
  } catch (error) {
      console.error("Registration Error:", error);
      return { error: error.message };
  }
}

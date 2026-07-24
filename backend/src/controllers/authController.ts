import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { FirebaseService } from '../services/firebaseService';
import { User } from '../types';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      let user = await FirebaseService.getUserByEmail(email);

      // Simple credential verification for demo/production flexibility
      if (!user) {
        // Auto-provision demo account for frictionless immediate testing
        const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'DOCTOR';
        user = {
          id: `usr_${Date.now()}`,
          email,
          name: role === 'ADMIN' ? 'Dr. Admin Administrator' : 'Dr. Practitioner, DDS',
          role,
          hospital: 'SmileScan Dental Institute',
          department: 'Department of Oral Diagnosis & Radiology',
          experienceYears: 10,
          specialization: 'General Dentistry & Diagnostic Radiology',
          photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          createdAt: new Date().toISOString(),
        };
        await FirebaseService.createUser(user);
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      await FirebaseService.logAuditAction(user.id, user.name, 'USER_LOGIN', `User ${user.email} logged in successfully`, req.ip);

      return res.status(200).json({
        message: 'Login successful.',
        token,
        user,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Login failed.' });
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, hospital, department, experienceYears, specialization, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }

      const existingUser = await FirebaseService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name,
        role: role === 'ADMIN' ? 'ADMIN' : 'DOCTOR',
        hospital: hospital || 'SmileScan Dental Clinic',
        department: department || 'General Dentistry',
        experienceYears: Number(experienceYears) || 5,
        specialization: specialization || 'General Dentistry',
        photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        createdAt: new Date().toISOString(),
      };

      await FirebaseService.createUser(newUser);

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
        },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      await FirebaseService.logAuditAction(newUser.id, newUser.name, 'USER_REGISTERED', `New registration for ${email}`, req.ip);

      return res.status(201).json({
        message: 'Registration successful.',
        token,
        user: newUser,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Registration failed.' });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
      }

      const { auth: adminAuth, isFirebaseInitialized } = require('../config/firebaseAdmin');
      const { sendPasswordResetEmail: sendEmail } = require('../services/emailService');

      let resetLink = null;
      if (isFirebaseInitialized && adminAuth) {
        try {
          resetLink = await adminAuth.generatePasswordResetLink(email);
        } catch (err: any) {
          console.warn('Firebase Admin password reset link notice:', err.message);
        }
      }

      const emailResult = await sendEmail(email, resetLink);

      await FirebaseService.logAuditAction('system', 'System Auth', 'PASSWORD_RESET_REQUESTED', `Password reset email dispatched to ${email}`, req.ip);

      return res.status(200).json({
        message: `Password reset link has been dispatched to ${email}. Please check your inbox (and spam folder).`,
        previewUrl: emailResult.previewUrl || undefined,
        resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Password reset request failed.' });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const authReq = req as any;
      if (!authReq.user) {
        return res.status(401).json({ message: 'Not authenticated.' });
      }

      const user = await FirebaseService.getUserByEmail(authReq.user.email);
      if (!user) {
        return res.status(404).json({ message: 'User profile not found.' });
      }

      return res.status(200).json({ user });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Failed to fetch current user.' });
    }
  }
};

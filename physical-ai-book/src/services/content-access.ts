import { User } from '../types/auth';
import { supabase } from './supabase';

/**
 * Service for handling content access control
 */
export class ContentAccessService {
  /**
   * Check if a user has access to specific content
   */
  static async hasAccess(userId: string, contentId: string, requiredAccessLevel: 'view' | 'edit' | 'admin' = 'view'): Promise<boolean> {
    try {
      // First, check if content is public
      const { data: publicContent, error: publicError } = await supabase
        .from('content')
        .select('access_level')
        .eq('id', contentId)
        .eq('is_public', true)
        .single();

      if (!publicError && publicContent) {
        // Content is public, anyone can access
        return true;
      }

      // If not public, check user's access permissions
      const { data, error } = await supabase
        .from('content_access')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .gte('access_level', this.getAccessLevelValue(requiredAccessLevel))
        .single();

      if (error) {
        console.error('Error checking content access:', error);
        return false;
      }

      // If we found a record, user has access
      return !!data;
    } catch (error) {
      console.error('Error in hasAccess:', error);
      return false;
    }
  }

  /**
   * Get user's access level for specific content
   */
  static async getUserAccessLevel(userId: string, contentId: string): Promise<'none' | 'view' | 'edit' | 'admin'> {
    try {
      // Check if content is public
      const { data: publicContent, error: publicError } = await supabase
        .from('content')
        .select('access_level')
        .eq('id', contentId)
        .eq('is_public', true)
        .single();

      if (!publicError && publicContent) {
        return 'view'; // Public content is viewable by anyone
      }

      // Get user's specific access
      const { data, error } = await supabase
        .from('content_access')
        .select('access_level')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single();

      if (error || !data) {
        return 'none';
      }

      return data.access_level as 'view' | 'edit' | 'admin';
    } catch (error) {
      console.error('Error getting user access level:', error);
      return 'none';
    }
  }

  /**
   * Grant access to content for a user
   */
  static async grantAccess(userId: string, contentId: string, accessLevel: 'view' | 'edit' | 'admin'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_access')
        .upsert({
          user_id: userId,
          content_id: contentId,
          access_level: accessLevel,
          granted_at: new Date().toISOString()
        }, { onConflict: 'user_id,content_id' });

      if (error) {
        console.error('Error granting content access:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in grantAccess:', error);
      return false;
    }
  }

  /**
   * Check if user has a specific role
   */
  static hasRole(user: User | null, requiredRole: string): boolean {
    if (!user) return false;
    return user.role === requiredRole;
  }

  /**
   * Check if user has admin role
   */
  static isAdmin(user: User | null): boolean {
    return this.hasRole(user, 'admin');
  }

  /**
   * Check if user has premium access
   */
  static hasPremiumAccess(user: User | null): boolean {
    if (!user) return false;
    return ['premium', 'admin'].includes(user.role);
  }

  /**
   * Check if user has instructor access
   */
  static hasInstructorAccess(user: User | null): boolean {
    if (!user) return false;
    return ['instructor', 'admin'].includes(user.role);
  }

  /**
   * Helper to convert access level to numeric value for comparison
   */
  private static getAccessLevelValue(level: 'view' | 'edit' | 'admin'): number {
    switch (level) {
      case 'view': return 1;
      case 'edit': return 2;
      case 'admin': return 3;
      default: return 0;
    }
  }
}
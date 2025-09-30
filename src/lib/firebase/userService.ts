import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../schema';

export interface NeonUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  provider?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    addresses: Array<{
      id: string;
      type: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault: boolean;
    }>;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  cart: any[];
  wishlist: any[];
  orders: any[];
}

export async function fetchUserFromNeon(
  userId: string
): Promise<NeonUser | null> {
  if (!db) {
    console.warn("DB not available on client side");
    return null;
  }
  try {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (result.length > 0) {
      const userData = result[0];
      return {
        ...userData,
        createdAt: userData.createdAt!.toISOString(),
        updatedAt: userData.updatedAt!.toISOString(),
      } as NeonUser;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user from Neon:", error);
    return null;
  }
}

export async function getCurrentUserData(
  session: any
): Promise<NeonUser | null> {
  if (!session?.user?.id) {
    return null;
  }

  return await fetchUserFromNeon(session.user.id);
}

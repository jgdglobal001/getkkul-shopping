import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// 데이터베이스 인터페이스 정의 (Better Auth 스키마 기반)
export interface Database {
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    // 추가 필드 (커스텀)
    role?: string;
    // 기타 Better Auth 관련 필드
  };
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  account: {
    id: string;
    userId: string;
    providerId: string;
    accountId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  verification: {
    id: string;
    identifier: string;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Kysely 인스턴스 생성
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL, // PostgreSQL 연결 문자열
    }),
  }),
});

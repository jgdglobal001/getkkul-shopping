import { betterAuth } from "better-auth";
import { kyselyAdapter } from "better-auth/adapters/kysely";
import { db } from "./kysely-db";

export const auth = betterAuth({
  database: kyselyAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // 소셜 로그인 설정 (필요 시)
  },
  // 추가 설정 (세션 등)
});

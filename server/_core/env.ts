function getEnvVar(name: string, required = false): string {
  const value = process.env[name]?.trim() ?? "";

  if (required && value.length === 0) {
    throw new Error(`[Env] ${name} is required but was not provided.`);
  }

  return value;
}

export const ENV = {
  appId: getEnvVar("VITE_APP_ID"),
  cookieSecret: getEnvVar("JWT_SECRET"),
  databaseUrl: getEnvVar("DATABASE_URL"),
  oAuthServerUrl: getEnvVar("OAUTH_SERVER_URL"),
  ownerOpenId: getEnvVar("OWNER_OPEN_ID"),
  stripeSecretKey: getEnvVar("STRIPE_SECRET_KEY"),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: getEnvVar("BUILT_IN_FORGE_API_URL"),
  forgeApiKey: getEnvVar("BUILT_IN_FORGE_API_KEY"),
};

export function assertRequiredEnv(): void {
  getEnvVar("JWT_SECRET", true);
  getEnvVar("OAUTH_SERVER_URL", true);
  getEnvVar("DATABASE_URL", true);
  getEnvVar("STRIPE_SECRET_KEY", true);
}

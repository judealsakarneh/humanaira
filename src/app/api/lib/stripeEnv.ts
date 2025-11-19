export const isLive = (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_live_')
export const isTest = !isLive
// Minimal ambient module so TypeScript stops erroring when nodemailer
// is not installed (we guard the runtime import behind env checks).
declare module 'nodemailer';
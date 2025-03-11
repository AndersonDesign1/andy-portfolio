declare namespace NodeJS {
    interface ProcessEnv {
      // Next.js environment
      NODE_ENV: "development" | "production" | "test"
  
      // Sanity environment variables
      NEXT_PUBLIC_SANITY_PROJECT_ID: string
      NEXT_PUBLIC_SANITY_DATASET: string
      SANITY_API_TOKEN?: string
  
      // Resend environment variables (if you're using it)
      RESEND_API_KEY?: string
      CONTACT_EMAIL?: string
    }
  }
  
  
export function createClient() {
  return {
    auth: {
      async signInWithPassword({ email, password }: any) {
        // Stub implementation, will be replaced by P1
        return { error: null, data: { user: { email } } }
      },
      async signUp({ email, password }: any) {
        // Stub implementation, will be replaced by P1
        return { error: null, data: { user: { email } } }
      }
    }
  }
}

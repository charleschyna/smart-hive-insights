
// Since we can't directly modify SignupForm.tsx as it's read-only, we'll create a helper function
// that adapts the signUp function to match what SignupForm expects

// Create a new file for the adapter function
export const signUpAdapter = (
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ error: Error | null }>,
  email: string, 
  password: string, 
  userData?: Record<string, any>
) => {
  return signUp(email, password, userData);
};

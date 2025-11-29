// frontend/js/main.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/index.js';

const SUPABASE_URL = '<YOUR_SUPABASE_URL>';
const SUPABASE_ANON_KEY = '<YOUR_SUPABASE_ANON_KEY>';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');

loginBtn.onclick = async () => {
  const email = emailInput.value;
  if (!email) return alert("Enter email");
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) alert(error.message); else alert("Magic link sent to email");
};

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

// show user when logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    userInfo.innerText = `Logged in: ${session.user.email}`;
  } else userInfo.innerText = '';
});

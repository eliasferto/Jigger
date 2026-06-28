import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";
import Auth from "./Auth.jsx";
import App from "./App.jsx";

export default function Root() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
  };

  const handleAuth = (user) => {
    setUser(user);
    fetchProfile(user.id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#06060e", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#a855f7", fontSize:22, fontWeight:900, letterSpacing:4 }}>JIGGER</div>
    </div>
  );

  if (!user) return <Auth onAuth={handleAuth} />;

  return <App user={user} profile={profile} onProfileUpdate={fetchProfile} onSignOut={handleSignOut} supabase={supabase} />;
}

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.VITE_GOOGLE_CLIENT_SECRET;
const jwtSecret = process.env.VITE_JWT_SECRET;

const supabase = createClient(supabaseUrl, supabaseKey);

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL:
        process.env.VITE_NODE_ENV === "production"
          ? "https://roomfinder-0ouu.onrender.com/auth/google/callback"
          : "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      if (!email.endsWith("@vitstudent.ac.in")) {
        return done(null, false, { message: "Unauthorized Email" });
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      let token;
      if (error || !user) {
        token = jwt.sign({ email,isAdmin: false }, jwtSecret, { expiresIn: "1h" });
        return done(null, { ...profile, newUser: true, token });
      }

      token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: "1h" });

      return done(null, { ...user, token });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

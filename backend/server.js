import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import session from "express-session";
import passport from "passport";
import "./auth.js";
import multer from "multer";
import cloudinary from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: '../.env' })

const app = express();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const jwtSecret = process.env.VITE_JWT_SECRET;

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: jwtSecret,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

const supabase = createClient(supabaseUrl, supabaseKey);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const __dirname1 = path.resolve();

cloudinary.config({
  cloud_name:process.env.VITE_CLOUD_NAME,
  api_key:process.env.VITE_API_KEY,
  api_secret:process.env.VITE_API_SECRET
})

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.email = decoded.email;
    next();
  });
};

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.email = decoded.email;
    if (decoded.isAdmin == true) {
      return next();
    } else {
      return res.status(403).json({ error: "You are not authorized as admin" });
    }
  });
};

const uploadCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    fs.unlinkSync(localFilePath);

    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error;
  }
};

app.post("/upload/pic", upload.single("avatar"), async (req, res) => {
  try {
    const responseUrl = await uploadCloudinary(req.file.path);
    res.json({ picUrl: responseUrl });
  } catch (error) {
    res.status(500).send("Error uploading image");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    hd: "vitstudent.ac.in",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = req.user.token;

    const frontendBaseURL =
      process.env.VITE_NODE_ENV == "production"
        ? "https://roomfinder-0ouu.onrender.com"
        : "http://localhost:5173";

    const redirectPath = req.user.newUser ? "/register" : "/";

    res.redirect(`${frontendBaseURL}${redirectPath}?token=${token}`);
  }
);


app.post("/api/register",verifyToken, async (req, res) => {
  const { name, reg } = req.body;
  const email=req.email;
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name, reg }])
      .select();

    if (error) return res.status(500).json({ message: "Error updating profile", error });

    const newToken = jwt.sign(
      { id: data[0].id, email: data[0].email },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Profile updated successfully", token: newToken });

  } catch (err) {
    res.status(403).json({ message: "Error inserting" });
  }
});

app.get("/api/hostels", async (req, res) => {
  try {
      let { data: hostels, error } = await supabase
      .from('hostels')
      .select('*')
      if (error) throw error;

      res.status(200).json({ hostels });
  } catch (err) {
      console.error("Error fetching hostels:", err.message);
      res.status(500).json({ message: "An error occurred while fetching hostels" });
  }
});

app.get("/api/hostel", async (req, res) => {
  const { hostelId } = req.query;
  if (!hostelId) return res.status(400).json({ message: "Hostel ID is required" });

  try {
      let { data: hostel, error } = await supabase.from('hostels').select('*').eq("name", hostelId).single();
      if (error) throw error;

      res.status(200).json({ hostel });
  } catch (err) {
      console.error("Error fetching details of hostel:", err.message);
      res.status(500).json({ message: "An error occurred while fetching hostel details" });
  }
});

app.get("/api/hostel/:id",verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Hostel ID is required" });
  try {
      let { data: hostel, error } = await supabase.from('hostels').select('*').eq("id", id).single();
      if (error) throw error;
      res.status(200).json({ hostel });
  } catch (err) {
      console.error("Error fetching details of hostel:", err.message);
      res.status(500).json({ message: "An error occurred while fetching hostel details" });
  }
});

app.get("/api/hostelRoom", async (req, res) => {
  const { roomType, hostelId } = req.query;
  if (!roomType || !hostelId) {
    return res.status(400).json({ message: "roomType and hostelId are required" });
  }

  try {
    let { data: rooms, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("type", roomType)
      .eq("block", hostelId);
    if (error) throw error;

    res.status(200).json({ rooms });
  } catch (err) {
    console.error("Error fetching hostel rooms:", err.message);
    res.status(500).json({ message: "An error occurred while fetching hostel rooms" });
  }
});

app.post("/api/addReview",verifyToken, async (req, res) => {
  const { roomType,hostelId, rating, review } = req.body;
  const email=req.email;
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("reviews")
      .eq("type", roomType)
      .eq("block", hostelId);

    if (error) throw error;
    
    const existingReviews = data.reviews || [];

    const { data:user, fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    const existingUserReviews = user.reviews || [];
    if(fetchError) throw fetchError;

    const updatedReviews = [{ name: user.name, rating, review }, ...existingReviews];
    const updatedUserReviews = [{ rating, review }, ...existingUserReviews];

    const { error: updateError } = await supabase
      .from("rooms")
      .update({ reviews: updatedReviews })
      .eq("type", roomType)
      .eq("block", hostelId);

    const { error: updateUserError } = await supabase
      .from("users")
      .update({ reviews: updatedUserReviews })
      .eq("email", email);

    if (updateError) throw updateError;
    if (updateUserError) throw updateUserError;

    res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
});

app.get("/api/profile",verifyToken,async(req,res)=>{
  const email=req.email;
  try {
    const { data:user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if(error) throw error;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error:error.message });
  }
})

app.post("/api/add-hostels", verifyAdminToken, async (req, res) => {
  try {
    const { name, sex, description, rooms, amenities, image } = req.body;
    
    const { data, error } = await supabase
      .from("hostels")
      .insert([{ name, sex, description, rooms, amenities, image }]);

    if (error) throw error;
    res.status(201).json({ message: "Hostel added successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Error adding hostel", error: error.message });
  }
});

app.put("/api/edit-hostel/:id",verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { name, sex, description, rooms, amenities, image } = req.body;

  try {
    const { data, error } = await supabase
      .from("hostels")
      .update({ name, sex, description, rooms, amenities, image })
      .eq("id", id);
      if(error) throw error
      res.status(201).json({ message: "Hostel updated successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Error updating hostel", error: error.message });
  }
});

if (process.env.VITE_NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1,"dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cors from "cors"
import { createServer } from "http"
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import unsplashRoutes from "./routes/unsplashRoutes.js";
import "./config/passport.js";
import { isLoggedIn } from "./middleware/auth.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const httpServer = createServer(app)

app.use(cors({
    origin : ["http://localhost:5173"],
    credentials: true
}))
app.use(express.json())
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/current-user", isLoggedIn, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    photo: req.user.photo,
    provider: req.user.provider
  });
});


app.use("/auth", authRoutes);
app.use("/api/unsplash", unsplashRoutes);

app.get('/', (req, res) => {
  res.send('Server running !');
});

httpServer.listen(PORT,()=>{
    console.log("Server starting at port "+PORT )
    connectDB()
})
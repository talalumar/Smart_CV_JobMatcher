import { createClient } from "@supabase/supabase-js";

/*
========================================
SUPABASE CLIENT
========================================
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/*
========================================
AUTH MIDDLEWARE
========================================
*/

export default async function authMiddleware(
  req,
  res,
  next
) {
  try {
    /*
    ========================================
    GET AUTH HEADER
    ========================================
    */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    /*
    ========================================
    EXTRACT TOKEN
    ========================================
    */

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    /*
    ========================================
    VERIFY USER WITH SUPABASE
    ========================================
    */

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(
      token
    );

    /*
    ========================================
    INVALID TOKEN
    ========================================
    */

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /*
    ========================================
    ATTACH USER TO REQUEST
    ========================================
    */

    req.user = {
      id: user.id, // UUID
      email: user.email,
    };

    next();
  } catch (error) {
    console.error(
      "Auth Middleware Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
}
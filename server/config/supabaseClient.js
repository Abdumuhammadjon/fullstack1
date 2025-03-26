const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // .env fayldan Supabase ma'lumotlarini yuklash

// Supabase client yaratish
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase; // Supabase ni eksport qilish

import { createClient } from "@supabase/supabase-js";

// création d'un client pour interagir avec le DAAS (Database As A Service) supabase

// ne pas oublier de préfixer les variables d'environnements par VITE_
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

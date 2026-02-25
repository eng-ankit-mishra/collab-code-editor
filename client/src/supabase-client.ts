import {createClient} from "@supabase/supabase-js"

const url="https://akicigsayusjzyljfmzi.supabase.co";
const key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraWNpZ3NheXVzanp5bGpmbXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTE1MDAsImV4cCI6MjA2NzU2NzUwMH0.4rAM2CS9db64wvAIJI7D796HXm7DOM8UodF3O2IVRG0";



export const supabase=createClient(url,key)
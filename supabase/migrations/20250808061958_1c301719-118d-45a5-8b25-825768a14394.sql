-- Enable real-time updates for trips table
ALTER TABLE public.trips REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;

-- Enable real-time updates for vans table  
ALTER TABLE public.vans REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vans;
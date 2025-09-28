-- Create storage bucket for space images
INSERT INTO storage.buckets (id, name, public) VALUES ('space-images', 'space-images', true);

-- Add cover_image_url column to spaces table
ALTER TABLE public.spaces ADD COLUMN cover_image_url TEXT;

-- Create storage policies for space images
CREATE POLICY "Anyone can view space images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'space-images');

CREATE POLICY "Authenticated users can upload space images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'space-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their space images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'space-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their space images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'space-images' AND auth.uid()::text = (storage.foldername(name))[1]);
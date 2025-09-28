-- Create spaces table for real space management
CREATE TABLE public.spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_live BOOLEAN NOT NULL DEFAULT false,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  listener_count INTEGER NOT NULL DEFAULT 0,
  duration INTEGER DEFAULT 0, -- in minutes for live spaces
  tags TEXT[] DEFAULT '{}',
  privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  quality_threshold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on spaces table
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

-- Create policies for spaces
CREATE POLICY "Anyone can view public spaces" 
ON public.spaces 
FOR SELECT 
USING (privacy = 'public');

CREATE POLICY "Authenticated users can create spaces" 
ON public.spaces 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Users can update their own spaces" 
ON public.spaces 
FOR UPDATE 
TO authenticated
USING (auth.uid() = host_id);

CREATE POLICY "Users can delete their own spaces" 
ON public.spaces 
FOR DELETE 
TO authenticated
USING (auth.uid() = host_id);

-- Create space_participants table for tracking who joins spaces
CREATE TABLE public.space_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_speaker BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(space_id, user_id)
);

-- Enable RLS on space_participants
ALTER TABLE public.space_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for space_participants
CREATE POLICY "Users can view participants in public spaces" 
ON public.space_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.spaces 
  WHERE spaces.id = space_id AND spaces.privacy = 'public'
));

CREATE POLICY "Users can join public spaces" 
ON public.space_participants 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.spaces 
    WHERE spaces.id = space_id AND spaces.privacy = 'public'
  )
);

CREATE POLICY "Users can leave spaces they joined" 
ON public.space_participants 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger for updating spaces updated_at
CREATE TRIGGER update_spaces_updated_at
BEFORE UPDATE ON public.spaces
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for spaces table
ALTER TABLE public.spaces REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.spaces;

-- Enable realtime for space_participants table  
ALTER TABLE public.space_participants REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.space_participants;
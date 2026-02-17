-- Enable Row Level Security on the appointments table
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select only their own appointments
CREATE POLICY "Users can view their own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own appointments
CREATE POLICY "Users can insert their own appointments" 
ON appointments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own appointments
CREATE POLICY "Users can update their own appointments" 
ON appointments FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own appointments
CREATE POLICY "Users can delete their own appointments" 
ON appointments FOR DELETE 
USING (auth.uid() = user_id);


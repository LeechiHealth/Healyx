-- Create improved function with error handling for appointments
CREATE OR REPLACE FUNCTION set_user_id_on_appointments()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the user_id to the current authenticated user
  NEW.user_id := auth.uid();
  
  -- Basic validation - ensure we have a Patient Name
  IF NEW.patient_name IS NULL OR NEW.patient_name = '' THEN
    NEW.patient_name := 'Unnamed Patient';  -- Set a default instead of failing
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and continue (don't fail the insert)
    RAISE NOTICE 'Error in set_user_id_on_appointments: %', SQLERRM;
    
    -- Still set the user_id even if other validations fail
    NEW.user_id := auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


/*
  # Add Returns Page Styling

  1. Updates
    - Add CSS classes for returns page tabs styling
    - Add blue underline indicator for active tab
    - Add spacing and layout styles
*/

-- Add custom CSS classes for returns page tabs
CREATE OR REPLACE FUNCTION public.get_returns_tab_styles(is_active boolean)
RETURNS text AS $$
BEGIN
  RETURN CASE 
    WHEN is_active THEN 'border-b-2 border-blue-500 text-blue-600'
    ELSE 'border-transparent text-gray-500 hover:text-gray-700'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add helper function for tab container styles
CREATE OR REPLACE FUNCTION public.get_returns_container_styles()
RETURNS text AS $$
BEGIN
  RETURN 'flex border-b border-gray-200 mb-6';
END;
$$ LANGUAGE plpgsql IMMUTABLE;
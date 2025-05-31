-- Create digests table
CREATE TABLE IF NOT EXISTS digests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS digests_user_id_idx ON digests(user_id);
CREATE INDEX IF NOT EXISTS digests_created_at_idx ON digests(created_at);
CREATE INDEX IF NOT EXISTS digests_status_idx ON digests(status);

-- Create function to get latest digest for a user and topic
CREATE OR REPLACE FUNCTION get_latest_digest(user_id UUID, topic TEXT)
RETURNS TABLE (
    id UUID,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.content, d.created_at
    FROM digests d
    WHERE d.user_id = $1
    AND d.topic = $2
    AND d.status = 'sent'
    ORDER BY d.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql; 
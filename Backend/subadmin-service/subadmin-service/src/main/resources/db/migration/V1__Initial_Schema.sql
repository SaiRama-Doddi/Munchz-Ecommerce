CREATE TABLE IF NOT EXISTS sub_admins (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    permissions TEXT DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'PRE_VERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_admin_activities (
    id UUID PRIMARY KEY,
    sub_admin_id UUID,
    sub_admin_email VARCHAR(255) NOT NULL,
    module VARCHAR(50),
    action VARCHAR(50),
    target_id VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

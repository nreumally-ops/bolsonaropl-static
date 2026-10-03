BEGIN;

CREATE TABLE IF NOT EXISTS public.campaign_support_baseline (
    singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    baseline_count BIGINT NOT NULL CHECK (baseline_count >= 0),
    resumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.campaign_support_baseline (singleton, baseline_count)
VALUES (TRUE, 2380)
ON CONFLICT (singleton) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.campaign_support_votes (
    ip_hash TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
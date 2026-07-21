-- ==========================================
-- Row Level Security (RLS)
-- Tabel : public.dokumen
-- ==========================================

-- Mengaktifkan Row Level Security
ALTER TABLE public.dokumen ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ADMIN
-- Admin memiliki akses penuh (CRUD)
-- ==========================================

CREATE POLICY "Admin Full Access"
ON public.dokumen
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
    )
);

-- ==========================================
-- USER & PEGAWAI
-- Hanya dapat melihat dokumen miliknya
-- ==========================================

CREATE POLICY "Select own document"
ON public.dokumen
FOR SELECT
TO authenticated
USING (
    auth.uid() = owner
);

-- ==========================================
-- USER & PEGAWAI
-- Hanya dapat menambahkan dokumen miliknya
-- ==========================================

CREATE POLICY "Insert own document"
ON public.dokumen
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = owner
);

-- ==========================================
-- USER & PEGAWAI
-- Hanya dapat mengubah dokumen miliknya
-- ==========================================

CREATE POLICY "Update own document"
ON public.dokumen
FOR UPDATE
TO authenticated
USING (
    auth.uid() = owner
)
WITH CHECK (
    auth.uid() = owner
);

-- ==========================================
-- DELETE
-- Hanya Admin yang dapat menghapus dokumen
-- ==========================================

CREATE POLICY "Only admin delete"
ON public.dokumen
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
    )
);
-- Storage Policies for 'assets' bucket

-- 1. Allow Public Read (Anyone can view images)
create policy "Give me access to view images"
on storage.objects for select
using ( bucket_id = 'assets' );

-- 2. Allow Public Upload (Anyone can upload - for MVP)
create policy "Give me access to upload images"
on storage.objects for insert
with check ( bucket_id = 'assets' );

-- 3. Allow Public Update (Optional, if we want to overwrite)
create policy "Give me access to update images"
on storage.objects for update
using ( bucket_id = 'assets' );

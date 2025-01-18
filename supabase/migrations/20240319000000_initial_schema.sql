-- Create accounts table
create table public.accounts (
    id bigint primary key generated always as identity,
    username text,
    domain text,
    ip_address text,
    application text,
    port integer,
    url_path text,
    password_hash text,
    tags jsonb default '[]'::jsonb,
    url_title text,
    login_form_detected boolean default false,
    captcha_required boolean default false,
    otp_required boolean default false,
    is_parked boolean,
    is_accessible boolean,
    breach_detected boolean,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.accounts enable row level security;

-- Create policy to allow read access to authenticated users
create policy "Allow read access for authenticated users"
    on public.accounts
    for select
    to authenticated
    using (true);

-- Create storage bucket for breach data files
insert into storage.buckets (id, name)
values ('breach-data', 'breach-data');

-- Enable RLS on the storage bucket
create policy "Allow authenticated users to upload files"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'breach-data');
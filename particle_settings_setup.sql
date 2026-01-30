-- Add particle settings columns if they don't exist
alter table site_settings 
add column if not exists particle_color text default '#6366f1',
add column if not exists particle_speed numeric default 1.0,
add column if not exists particle_density numeric default 80;

-- Update the comments/description if useful
comment on column site_settings.particle_color is 'Hex color code for particles';
comment on column site_settings.particle_speed is 'Speed multiplier for particle movement';
comment on column site_settings.particle_density is 'Number of particles (performance heavy if too high)';

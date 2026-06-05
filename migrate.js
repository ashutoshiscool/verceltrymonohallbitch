const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

const db = new sqlite3.Database('./backend/monohall.db');

function queryAll(query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function migrate() {
  try {
    console.log("Fetching users...");
    const users = await queryAll("SELECT * FROM users");
    console.log(`Found ${users.length} users. Migrating...`);
    for (const user of users) {
      const { error } = await supabase.from('users').insert({
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role,
        created_at: user.created_at
      });
      if (error) console.error("User insert error:", error);
    }

    console.log("Fetching settings...");
    const settings = await queryAll("SELECT * FROM settings");
    console.log(`Found ${settings.length} settings. Migrating...`);
    for (const setting of settings) {
      const { error } = await supabase.from('settings').upsert({
        key: setting.key,
        value: setting.value
      });
      if (error) console.error("Setting insert error:", error);
    }

    console.log("Fetching brands...");
    const brands = await queryAll("SELECT * FROM brands");
    console.log(`Found ${brands.length} brands. Migrating...`);
    for (const brand of brands) {
      const { error } = await supabase.from('brands').insert({
        id: brand.id,
        name: brand.name,
        logo_url: brand.image_base64 || brand.logo_url || '',
        description: brand.description,
        created_at: brand.created_at
      });
      if (error) console.error("Brand insert error:", error);
    }

    console.log("Fetching events...");
    const events = await queryAll("SELECT * FROM events");
    console.log(`Found ${events.length} events. Migrating...`);
    for (const event of events) {
      const { error } = await supabase.from('events').insert({
        id: event.id,
        artist: event.artist,
        subtitle: event.subtitle,
        date: event.date,
        price: event.price,
        status: event.status,
        ticket_url: event.ticket_url,
        image_url: event.image_base64 || event.image_url || '',
        brand_id: event.brand_id,
        is_featured: event.is_featured === 1,
        created_at: event.created_at
      });
      if (error) console.error("Event insert error:", error);
    }

    console.log("Fetching gallery...");
    try {
      const gallery = await queryAll("SELECT * FROM event_gallery");
      console.log(`Found ${gallery.length} gallery images. Migrating...`);
      for (const img of gallery) {
        const { error } = await supabase.from('event_gallery').insert({
          id: img.id,
          event_id: img.event_id,
          image_url: img.image_url,
          caption: img.caption,
          created_at: img.created_at
        });
        if (error) console.error("Gallery insert error:", error);
      }
    } catch(e) {
      console.log("No gallery table found in old db, skipping.");
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration fatal error:", err);
  }
}

migrate();

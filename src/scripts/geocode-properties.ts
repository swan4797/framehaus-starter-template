// ========================================
// GEOCODE PROPERTIES SCRIPT
// Bulk geocode using Nominatim (OpenStreetMap)
// FREE - No API key needed!
// ========================================

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load .env file
dotenv.config()

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const USER_AGENT = 'StratosReachAI/1.0' // Required by Nominatim

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing environment variables!')
  console.error('')
  console.error('Required in .env file:')
  console.error('  PUBLIC_SUPABASE_URL=https://xxx.supabase.co')
  console.error('  SUPABASE_SERVICE_KEY=your_service_role_key')
  console.error('')
  console.error('Get your service role key from:')
  console.error('  Supabase Dashboard → Project Settings → API → service_role key (secret)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Sleep function for rate limiting (Nominatim requires 1 req/sec)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface GeocodeResult {
  lat: string
  lon: string
  display_name: string
}

async function geocodeAddress(address: string, postcode: string): Promise<{ lat: number, lng: number } | null> {
  try {
    // Build search query
    const searchQuery = `${address}, ${postcode}, UK`
    const encodedQuery = encodeURIComponent(searchQuery)
    
    // Call Nominatim API (free!)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&countrycodes=gb`,
      {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    )
    
    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status}`)
      return null
    }
    
    const results: GeocodeResult[] = await response.json()
    
    if (results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon)
      }
    }
    
    // If no results with full address, try just postcode
    const postcodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(postcode + ', UK')}&format=json&limit=1&countrycodes=gb`,
      {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    )
    
    if (postcodeResponse.ok) {
      const postcodeResults: GeocodeResult[] = await postcodeResponse.json()
      if (postcodeResults.length > 0) {
        return {
          lat: parseFloat(postcodeResults[0].lat),
          lng: parseFloat(postcodeResults[0].lon)
        }
      }
    }
    
    return null
    
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

async function geocodeProperties(batchSize: number = 100, agencyId?: string) {
  console.log('🗺️ Starting property geocoding...\n')
  
  // Build query
  let query = supabase
    .from('properties')
    .select('id, display_address, postcode, agency_id')
    .is('latitude', null)
    .eq('is_deleted', false)
    .not('postcode', 'is', null)
    .order('is_published', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(batchSize)
  
  // Filter by agency if provided
  if (agencyId) {
    query = query.eq('agency_id', agencyId)
  }
  
  const { data: properties, error } = await query
  
  if (error) {
    console.error('❌ Error fetching properties:', error)
    return
  }
  
  if (!properties || properties.length === 0) {
    console.log('✅ No properties need geocoding!')
    return
  }
  
  console.log(`📍 Found ${properties.length} properties to geocode\n`)
  
  let successCount = 0
  let failCount = 0
  let skipCount = 0
  
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]
    const progress = `[${i + 1}/${properties.length}]`
    
    console.log(`${progress} Geocoding: ${property.display_address}`)
    
    // Skip if no address or postcode
    if (!property.display_address || !property.postcode) {
      console.log(`  ⚠️  Missing address/postcode - skipping`)
      skipCount++
      continue
    }
    
    // Geocode
    const coords = await geocodeAddress(property.display_address, property.postcode)
    
    if (coords) {
      // Update in database
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          latitude: coords.lat,
          longitude: coords.lng,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id)
      
      if (updateError) {
        console.log(`  ❌ Database update failed:`, updateError)
        failCount++
      } else {
        console.log(`  ✅ Success: ${coords.lat}, ${coords.lng}`)
        successCount++
      }
    } else {
      console.log(`  ❌ Geocoding failed`)
      failCount++
    }
    
    // Rate limit: 1 request per second (Nominatim requirement)
    if (i < properties.length - 1) {
      await sleep(1000)
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 GEOCODING SUMMARY')
  console.log('='.repeat(50))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed:  ${failCount}`)
  console.log(`⚠️  Skipped: ${skipCount}`)
  console.log(`📍 Total:   ${properties.length}`)
  console.log('='.repeat(50))
  
  // Check remaining
  const { count } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .is('latitude', null)
    .eq('is_deleted', false)
    .not('postcode', 'is', null)
  
  if (count && count > 0) {
    console.log(`\n📌 ${count} properties still need geocoding`)
    console.log(`   Run this script again to continue`)
  } else {
    console.log('\n🎉 All properties geocoded!')
  }
}

// ========================================
// RUN SCRIPT
// ========================================

// Option 1: Geocode all properties (100 at a time)
geocodeProperties(100)

// Option 2: Geocode for specific agency
// geocodeProperties(100, 'agency-uuid-here')

// Option 3: Geocode more properties (change batch size)
// geocodeProperties(500)

/*
USAGE:

1. Install dependencies:
   npm install @supabase/supabase-js

2. Update SUPABASE_URL and SUPABASE_SERVICE_KEY at the top

3. Run the script:
   npx tsx geocode-properties.ts
   
   Or with Node:
   node geocode-properties.js

NOTES:
- Nominatim rate limit: 1 request per second
- 100 properties = ~2 minutes
- 1,000 properties = ~17 minutes
- 10,000 properties = ~3 hours
- Run overnight for large batches
- Script can be stopped and restarted anytime

ALTERNATIVE APIS:
If Nominatim is too slow, you can use:

1. Google Geocoding API ($5 per 1,000 requests)
   https://developers.google.com/maps/documentation/geocoding

2. Mapbox Geocoding API (100,000 free/month)
   https://docs.mapbox.com/api/search/geocoding/

3. LocationIQ (5,000 free/day)
   https://locationiq.com/

Replace the geocodeAddress function with your preferred API.
*/
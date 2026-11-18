import type { ServiceAreaItem } from "./serviceAreas";

export interface ServiceAreaLandmark {
    name: string;
    category: string;
    description: string;
}

export interface ServiceAreaActivity {
    title: string;
    spot: string;
    description: string;
}

export interface ServiceAreaStats {
    population: string;
    households: string;
    landArea: string;
    commercialGrowth: string;
    geographyType?: string;
}

export interface ServiceAreaGuide {
    localCopy: string[];
    landmarks: ServiceAreaLandmark[];
    thingsToDo: ServiceAreaActivity[];
    keyCorridors: string[];
    topIndustries: string[];
    stats?: ServiceAreaStats;
}

export const SERVICE_AREA_GUIDES: Record<string, ServiceAreaGuide> = {
    "west-palm-beach": {
        localCopy: [
            "West Palm Beach pairs downtown Class-A office towers along Flagler Drive and Okeechobee Boulevard with historic Mediterranean Revival neighborhoods like El Cid, Flamingo Park, and Northwood Village.",
            "Our bonded specialists serve financial suites, Good Samaritan area clinics, and coastal residences with hospital-grade EPA List N disinfection, flexible night janitorial, and our 100% guarantee."
        ],
        landmarks: [
            { name: "The Square (CityPlace)", category: "Shopping & Dining District", description: "Open-air downtown plaza with dining, showrooms, and modern office towers." },
            { name: "Norton Museum of Art", category: "Cultural Landmark", description: "Renowned art museum featuring subtropical sculpture gardens along South Dixie Highway." },
            { name: "Kravis Center for the Performing Arts", category: "Performing Arts", description: "Premier performing arts venue hosting Broadway tours, symphonies, and galas." },
            { name: "Clematis Street & Waterfront Commons", category: "Historic Downtown Core", description: "Historic downtown corridor running from Rosemary Avenue to Centennial Square." }
        ],
        thingsToDo: [
            { title: "West Palm Beach GreenMarket & Clematis by Night", spot: "Great Lawn on Flagler Drive", description: "Top-rated Saturday waterfront farmers market and Thursday evening outdoor concerts." },
            { title: "Antique Row Art & Design Stroll", spot: "South Dixie Highway", description: "Over 40 curated antique showrooms, fine galleries, and neighborhood cafés." },
            { title: "Flagler Drive Waterfront Bike & Paddle Trail", spot: "Lake Worth Lagoon", description: "Palm-lined waterfront promenade overlooking Palm Beach Island marinas and yachts." },
            { title: "Manatee Lagoon & Cox Science Center", spot: "North Flagler & Dreher Park", description: "Waterfront manatee discovery center and science complex near the zoo." }
        ],
        keyCorridors: ["Flagler Drive", "Okeechobee Boulevard", "Clematis Street", "US-1 / Dixie Highway", "Palm Beach Lakes Boulevard", "Southern Boulevard"],
        topIndustries: ["Private Wealth & Finance", "Trial Law & Legal Services", "Luxury Real Estate & Construction", "Concierge Healthcare & MedSpas", "Marine & Hospitality"]
    },
    "boca-raton": {
        localCopy: [
            "Defined by Addison Mizner's Mediterranean Revival architecture, Boca Raton blends corporate campuses at The Park at Broken Sound with oceanfront estates and gated clubs along Glades and Yamato Roads.",
            "We deliver white-glove commercial janitorial, medical suite sanitization, and recurring estate housekeeping for Mizner Park boutiques, Royal Palm Yacht & Country Club homes, and corporate offices."
        ],
        landmarks: [
            { name: "Mizner Park Amphitheater & Plaza", category: "Cultural & Lifestyle Center", description: "Signature pink-stucco promenade with boutiques, dining, and the Boca Museum of Art." },
            { name: "The Boca Raton (Historic Resort & Club)", category: "Historic Architectural Icon", description: "Addison Mizner's landmark 1926 waterfront resort on Lake Boca Raton." },
            { name: "Town Center at Boca Raton", category: "Luxury Retail Hub", description: "Premier luxury shopping destination serving Palm Beach and Broward counties." },
            { name: "Gumbo Limbo Nature Center & Red Reef Park", category: "Coastal Preserve", description: "20-acre barrier-island sanctuary with boardwalks, sea turtles, and snorkeling reefs." }
        ],
        thingsToDo: [
            { title: "Fine Dining & Gallery Nights at Mizner Park", spot: "Plaza Real Downtown Boca", description: "Outdoor concerts, museum exhibitions, and al fresco chef dining downtown." },
            { title: "Snorkeling & Beachfront Picnics at Red Reef Park", spot: "A1A / North Ocean Blvd", description: "Clear nearshore artificial reefs and shaded oceanfront walking paths." },
            { title: "Boutique Shopping & Espresso at Royal Palm Place", spot: "SE Mizner Blvd", description: "Courtyard boutiques, bronze sculptures, salons, and artisan bakeries." },
            { title: "Eco-Trails at Daggerwing Nature Center", spot: "West Boca Burt Aaronson Park", description: "Elevated cypress swamp boardwalks beside championship golf and park trails." }
        ],
        keyCorridors: ["Glades Road", "Palmetto Park Road", "Yamato Road", "Federal Highway (US-1)", "A1A / Ocean Boulevard", "Military Trail"],
        topIndustries: ["Corporate Headquarters & SaaS", "Plastic Surgery & Aesthetic Medicine", "Wealth Management & Family Offices", "Private Aviation & Marine Charter", "Luxury Home Remodeling"]
    },
    "delray-beach": {
        localCopy: [
            "Known as the Village by the Sea, Delray Beach connects a walkable Atlantic Avenue downtown and Pineapple Grove Arts District with coastal neighborhoods stretching to Lake Ida and the ocean.",
            "From Atlantic Avenue restaurants and creative studios to Lake Ida homes and beachside rentals, our local crews provide fast turnovers, commercial cleaning, and recurring maid service."
        ],
        landmarks: [
            { name: "Atlantic Avenue Downtown District", category: "Main Street Corridor", description: "Pedestrian-friendly dining, shopping, and nightlife avenue stretching to the Atlantic." },
            { name: "Morikami Museum and Japanese Gardens", category: "Cultural & Botanical Landmark", description: "16 acres of Japanese stroll gardens, bonsai displays, and cultural galleries." },
            { name: "Pineapple Grove Arts District", category: "Creative Quarter", description: "Colorful downtown quarter featuring murals, Artists Alley studios, and boutiques." },
            { name: "Wakodahatchee Wetlands", category: "Eco-Landmark", description: "50-acre wetland boardwalk famed for nesting wood storks and coastal birds." }
        ],
        thingsToDo: [
            { title: "First Friday Art Walk & Pineapple Grove Stroll", spot: "NE 2nd Avenue & Artists Alley", description: "Monthly live music and open-studio evenings across downtown galleries." },
            { title: "Retro Arcade Gaming at Silverball Museum", spot: "NE 3rd Avenue", description: "Classic playable pinball and vintage arcade games steps from Atlantic Avenue." },
            { title: "Delray Beach Tennis Center Championships", spot: "West Atlantic Avenue", description: "Host venue for the ATP Delray Beach Open and public court play." },
            { title: "Sunrise Paddleboarding & Cabana Rentals", spot: "Delray Municipal Beach (A1A)", description: "Blue Wave beach offering paddleboarding, sailboats, and oceanfront cafés." }
        ],
        keyCorridors: ["Atlantic Avenue", "Linton Boulevard", "Federal Highway (US-1)", "Congress Avenue", "Jog Road", "A1A / South Ocean Blvd"],
        topIndustries: ["Hospitality & Restaurant Groups", "Boutique Fitness & Wellness", "Custom Coastal Architecture", "Real Estate & Property Management", "Professional & Legal Services"]
    },
    "jupiter": {
        localCopy: [
            "Anchored by the 1860 Jupiter Inlet Lighthouse where the Loxahatchee River meets the Atlantic, Jupiter combines sportfishing, golf, and biotech hubs across Abacoa, Admirals Cove, and Jonathan's Landing.",
            "Our vetted teams serve Abacoa corporate and lab suites, waterfront estates, and coastal rentals with hospital-grade sanitization, post-build detailing, and guaranteed recurring residential care."
        ],
        landmarks: [
            { name: "Jupiter Inlet Lighthouse & Museum", category: "Historic Maritime Icon", description: "1860 red-brick lighthouse rising above the Loxahatchee River and inlet." },
            { name: "Roger Dean Chevrolet Stadium & Abacoa", category: "Sports & Town Center", description: "Spring training ballpark surrounded by Abacoa dining, shops, and greenways." },
            { name: "Harbourside Place & Love Street", category: "Waterfront Dining & Marina", description: "Intracoastal amphitheater, boat slips, and dockside dining along Love Street." },
            { name: "Dubois Park & Blowing Rocks Preserve", category: "Coastal Landmark", description: "Calm inlet lagoons beside dramatic Anastasia limestone shoreline on Jupiter Island." }
        ],
        thingsToDo: [
            { title: "Clear-Bottom Kayaking on the Loxahatchee River", spot: "Riverbend Park & Jupiter Inlet", description: "Paddle shaded cypress waterways or spot manatees near the inlet." },
            { title: "Spring Training Baseball & Food Truck Fridays", spot: "Abacoa Town Center", description: "Major League spring training matchups and Friday community concerts on the green." },
            { title: "Sunset Dining on the Jupiter Inlet", spot: "Love Street & U-Tiki District", description: "Waterfront seafood and cocktails facing the illuminated Jupiter Inlet Lighthouse." },
            { title: "Snorkeling the Cato's Bridge Sandbar", spot: "Intracoastal Waterway", description: "Clear outgoing-tide snorkeling and family paddleboarding along calm inlet shoals." }
        ],
        keyCorridors: ["Indiantown Road", "US-1 / Federal Highway", "Alternate A1A", "Donald Ross Road", "Military Trail", "Center Street"],
        topIndustries: ["Marine & Yacht Services", "Luxury Custom Home Builders", "Sports Medicine & Orthopedics", "Biotech & Life Sciences", "Private Club & Golf Hospitality"]
    },
    "palm-beach-gardens": {
        localCopy: [
            "Home to the PGA of America, Palm Beach Gardens pairs country club neighborhoods like PGA National, BallenIsles, and Mirasol with upscale retail and medical corridors along PGA Boulevard.",
            "From PGA Boulevard offices and medical clinics to estates in Mirasol, Avenir, and Alton, we provide tailored janitorial care, terminal disinfection, and recurring home cleaning."
        ],
        landmarks: [
            { name: "PGA National Resort & Champion Course", category: "World Golf Landmark", description: "Home of the famed Bear Trap and championship PGA Tour history." },
            { name: "The Gardens Mall", category: "Luxury Retail Destination", description: "Sunlit two-level luxury mall anchored by flagship stores and fine jewelers." },
            { name: "Downtown Palm Beach Gardens", category: "Open-Air Lifestyle District", description: "Lakeside dining, Whole Foods Market, carousel, and weekend live music." },
            { name: "Sandhill Crane Golf Club & Loxahatchee Slough", category: "Nature & Recreation", description: "Scenic fairways bordered by preserved wetlands and peaceful walking trails." }
        ],
        thingsToDo: [
            { title: "Championship Golf & Spa Retreats", spot: "PGA National & Sandhill Crane", description: "Play championship fairways or unwind in resort mineral pools and spas." },
            { title: "Gardens GreenMarket on Sunday Mornings", spot: "City Hall Municipal Campus", description: "Year-round Sunday market with local produce, orchids, honey, and live music." },
            { title: "Al Fresco Chef Dining along PGA Boulevard", spot: "Downtown PBG & Mainstreet at Midtown", description: "Neighborhood steakhouses, fresh coastal seafood, and evening patio lounges." },
            { title: "Paddle & Hike the Loxahatchee Slough", spot: "PGA Blvd West Corridor", description: "Quiet pine flatwoods and cypress marshes ideal for trail biking and birding." }
        ],
        keyCorridors: ["PGA Boulevard", "Northlake Boulevard", "Military Trail", "Donald Ross Road", "Prosperity Farms Road", "I-95 & Turnpike"],
        topIndustries: ["Golf & Country Club Management", "Wealth Advisory & Private Banking", "Specialty Healthcare & Dentistry", "Luxury Interior Design", "Biotech & Aerospace"]
    },
    "wellington": {
        localCopy: [
            "Celebrated as the Winter Equestrian Capital of the World, Wellington welcomes international riders to Wellington International and the National Polo Center alongside family communities like Olympia and Versailles.",
            "We support seasonal trainer residences, Palm Beach Point estates, Olympia homes, and State Road 7 medical offices with post-season turnovers, recurring housekeeping, and commercial sanitization."
        ],
        landmarks: [
            { name: "Wellington International Equestrian Venue", category: "Global Equestrian Landmark", description: "Host of the 13-week Winter Equestrian Festival welcoming international competitors." },
            { name: "National Polo Center (NPC)", category: "Polo Championship Grounds", description: "Premier American polo venue known for Sunday matches on Field One." },
            { name: "The Mall at Wellington Green", category: "Regional Shopping Hub", description: "Regional retail, dining, and medical hub along State Road 7." },
            { name: "Wellington Environmental Preserve", category: "Eco-Park & Bridle Trails", description: "365-acre preserve with an observation tower and miles of bridle paths." }
        ],
        thingsToDo: [
            { title: "Saturday Night Lights Grand Prix Show Jumping", spot: "Wellington International", description: "Evening grand prix jumping with live music, dining, and family activities." },
            { title: "Sunday Polo Match & Fieldside Tailgates", spot: "National Polo Center on South Shore Blvd", description: "High-goal winter polo matches and social tailgates from January through April." },
            { title: "Concerts & Food Trucks at Wellington Amphitheater", spot: "Civic Center Drive", description: "Weekly lakeside food truck rallies, outdoor concerts, and family movie nights." },
            { title: "Horseback Riding & Birding at Peaceful Waters", spot: "Village Park & Environmental Preserve", description: "Elevated wetland boardwalks connecting over 60 miles of community bridle trails." }
        ],
        keyCorridors: ["State Road 7 (US-441)", "Forest Hill Boulevard", "Southern Boulevard", "Lake Worth Road", "South Shore Boulevard", "Pierson Road"],
        topIndustries: ["Equestrian Real Estate & Veterinary", "Custom Barn & Estate Builders", "Pediatric & Family Healthcare", "Private Aviation (Wellington Aero Club)", "Landscape & Pool Architecture"]
    }
};

const ADDITIONAL_GUIDES: Record<string, ServiceAreaGuide> = {
    "boynton-beach": {
        localCopy: [
            "Palm Beach County's third-largest city bridges Boynton Harbor Marina's waterfront dining with growing retail and residential corridors stretching west to Canyon Town Center and Valencia communities.",
            "We serve Congress Avenue medical offices, coastal condos near the marina, and Canyon family homes with commercial janitorial, clinic disinfection, and dependable residential maid services."
        ],
        landmarks: [
            { name: "Boynton Harbor Marina & Inlet Park", category: "Waterfront & Boating Hub", description: "Atlantic inlet marina offering dive charters, boat rentals, and dockside dining." },
            { name: "Green Cay Nature Center & Wetlands", category: "Eco-Sanctuary", description: "Elevated cypress boardwalks winding across 100 acres of restored wetlands." },
            { name: "Arthur R. Marshall Loxahatchee National Wildlife Refuge", category: "Everglades Gateway", description: "145,000-acre northern Everglades refuge with canoe trails and cypress boardwalks." },
            { name: "Renaissance Commons & Town Square", category: "Commercial & Cultural Hub", description: "Congress Avenue retail district paired with Boynton Beach's revitalized Town Square." }
        ],
        thingsToDo: [
            { title: "Dockside Dining & Dive Charters at the Marina", spot: "Two Georges & Banana Boat", description: "Intracoastal seafood dining steps from fishing and reef diving charters." },
            { title: "Boardwalk Wildlife Viewing at Green Cay", spot: "Hagen Ranch Road", description: "Spot roseate spoonbills, herons, and alligators along scenic wetland boardwalks." },
            { title: "Family Discovery at Schoolhouse Children's Museum", spot: "East Ocean Avenue", description: "Interactive Florida pioneer exhibits inside a restored 1913 historic schoolhouse." },
            { title: "Sunset Concerts at Centennial Park Amphitheater", spot: "Downtown Boynton Beach", description: "Monthly night markets, food trucks, and outdoor community concerts downtown." }
        ],
        keyCorridors: ["Boynton Beach Boulevard", "Congress Avenue", "Federal Highway (US-1)", "Woolbright Road", "Jog Road", "Lyons Road"],
        topIndustries: ["Home Services & HVAC/Roofing", "Marine & Charter Recreation", "Senior & Active Adult Healthcare", "Retail & Restaurant Groups", "Medical & Dental Practices"]
    },
    "lake-worth-beach": {
        localCopy: [
            "Celebrated for historic cottages, creative arts, and walkable Lake and Lucerne Avenues, Lake Worth Beach brings lively coastal character to the Intracoastal and oceanfront pier.",
            "Our local pros support downtown studios and restaurants, beachside Airbnb turnovers, and historic residential cottages with thorough rotation cleaning and reliable commercial care."
        ],
        landmarks: [
            { name: "Lake Worth Beach Casino Building & Municipal Pier", category: "Oceanfront Landmark", description: "Restored 1920s oceanfront pavilion and classic Atlantic fishing pier." },
            { name: "Benzaiten Center for Creative Arts", category: "Historic Arts Facility", description: "1924 train depot hosting live glassblowing, bronze casting, and fine art galleries." },
            { name: "Lake Worth Playhouse", category: "Historic Theater", description: "Historic 1924 Art Deco theater staging musicals, plays, and indie films." },
            { name: "Snook Islands Natural Area", category: "Lagoon Boardwalk & Kayak Pier", description: "100-acre Lake Worth Lagoon preserve with fishing piers and kayak launches." }
        ],
        thingsToDo: [
            { title: "Annual Street Painting Festival & Gallery Walks", spot: "Lake Avenue & Lucerne Avenue", description: "Hundreds of chalk artists transform downtown streets each February alongside galleries." },
            { title: "Live Glassblowing Demos at Benzaiten Center", spot: "South F Street Historic Depot", description: "Watch master glassblowers or join hands-on weekend studio workshops." },
            { title: "Oceanfront Dining at Benny's on the Beach", spot: "Lake Worth Pier", description: "Classic pier-top dining overlooking Atlantic surfers and morning sunrises." },
            { title: "Kayaking the Snook Islands Mangrove Trails", spot: "North Golfview Road", description: "Paddle calm lagoon mangroves past manatees and Bryant Park." }
        ],
        keyCorridors: ["Lake Avenue", "Lucerne Avenue", "Dixie Highway", "Federal Highway", "Lake Worth Road", "10th Avenue North"],
        topIndustries: ["Creative Arts & Design Studios", "Craft Hospitality & Breweries", "Historic Home Restoration", "Specialty Retail & Boutiques", "Marine & Eco-Tourism"]
    },
    "palm-beach": {
        localCopy: [
            "The Town of Palm Beach spans a 16-mile barrier island defined by Worth Avenue boutiques, Henry Flagler's Whitehall estate, and landmarked Mediterranean Revival residences.",
            "Serving Worth Avenue family offices and private island estates, we provide discreet white-glove housekeeping, delicate marble and chandelier care, and post-renovation detailing."
        ],
        landmarks: [
            { name: "Worth Avenue & Historic Vias", category: "Global Luxury Shopping", description: "Palm-lined luxury avenue and cobblestone vias with couture boutiques and bistros." },
            { name: "Henry Morrison Flagler Museum (Whitehall)", category: "National Historic Landmark", description: "Restored 75-room Gilded Age estate overlooking the Lake Worth Lagoon." },
            { name: "The Breakers Palm Beach", category: "Legendary Oceanfront Resort", description: "Iconic 1896 Italian Renaissance oceanfront resort along South County Road." },
            { name: "The Royal Poinciana Plaza & Society of the Four Arts", category: "Cultural & Lifestyle Enclave", description: "Garden courtyards, sculpture gardens, fine dining, and performing arts." }
        ],
        thingsToDo: [
            { title: "Cycling or Strolling the Palm Beach Lake Trail", spot: "Intracoastal Waterway", description: "Scenic 5.5-mile Intracoastal path passing kapok trees, docks, and historic estates." },
            { title: "Afternoon Tea in the Railcar Pavilion", spot: "Flagler Museum", description: "Gilded Age afternoon tea served beside Henry Flagler's private railcar." },
            { title: "Via Courtyard Shopping & Dining on Worth Avenue", spot: "Via Mizner & Via Parigi", description: "Bougainvillea-draped courtyards with fine galleries and Italian cafés." },
            { title: "Botanical Strolls at Pan's Garden & Four Arts", spot: "Four Arts Plaza", description: "Native Florida botanical garden paired with seasonal cultural programming." }
        ],
        keyCorridors: ["Worth Avenue", "Royal Poinciana Way", "South County Road", "North Ocean Boulevard (A1A)", "Cocoanut Row", "Bradley Place"],
        topIndustries: ["Family Offices & Private Banking", "Fine Art & Luxury Retail", "Estate Management & Security", "Ultra-Luxury Real Estate", "Concierge Medicine & Aviation"]
    },
    "royal-palm-beach": {
        localCopy: [
            "Anchored by 160-acre Royal Palm Beach Commons Park and busy Southern Boulevard and State Road 7 corridors, Royal Palm Beach blends family neighborhoods with active retail hubs.",
            "We deliver dependable office cleaning, pediatric and dental clinic sanitization, and recurring residential care across Madison Green, Counterpoint Estates, and western retail plazas."
        ],
        landmarks: [
            { name: "Royal Palm Beach Commons Park", category: "Signature Community Park", description: "160-acre lakeside park with splash pad, trails, pavilion, and amphitheater." },
            { name: "Veterans Park & Amphitheater", category: "Civic Landmark", description: "Memorial plaza hosting weekend green markets and community celebrations." },
            { name: "Royal Palm Beach Pines Natural Area", category: "Nature Preserve", description: "145-acre pine flatwoods and wetland preserve with wildlife observation decks." },
            { name: "Southern Blvd & SR-7 Commercial Hub", category: "Retail Corridor", description: "Western Palm Beach County hub for shopping, dining, and healthcare." }
        ],
        thingsToDo: [
            { title: "Kayaking & Picnics at Commons Park", spot: "Royal Palm Beach Blvd", description: "Three miles of paved lakeside paths, volleyball courts, and kayak launches." },
            { title: "Green Market & Bazaar at Village Hall", spot: "Commons Park Lakeside", description: "Saturday lakeside market featuring local produce, plants, and artisan goods." },
            { title: "Championship Golf at Madison Green", spot: "Crestwood Boulevard", description: "Par-72 championship golf course winding through preserved natural wetlands." },
            { title: "Birding at Royal Palm Beach Pines", spot: "40th Street North", description: "Quiet shaded trails ideal for spotting sandhill cranes and woodpeckers." }
        ],
        keyCorridors: ["Southern Boulevard", "Okeechobee Boulevard", "Royal Palm Beach Boulevard", "Crestwood Boulevard", "State Road 7 (US-441)"],
        topIndustries: ["Family Dental & Medical", "Roofing, Solar & Impact Windows", "Youth Sports & Education", "Veterinary & Pet Care", "Local Dining & Retail"]
    },
    "north-palm-beach": {
        localCopy: [
            "Planned as a waterfront boating and golf village, North Palm Beach features deepwater Intracoastal canals, John D. MacArthur Beach State Park, and North Palm Beach Country Club.",
            "From US-1 and Northlake Boulevard offices to canal-front residences, our team handles commercial janitorial, move-in/move-out deep cleans, and recurring coastal home upkeep."
        ],
        landmarks: [
            { name: "John D. MacArthur Beach State Park", category: "Barrier Island State Park", description: "Coastal state park with a 1,600-foot estuary boardwalk and pristine beach." },
            { name: "North Palm Beach Country Club", category: "Municipal Nicklaus Golf & Club", description: "Jack Nicklaus Signature links course, Olympic pool, and clubhouse dining." },
            { name: "Old Port Cove & Safe Harbor Marina", category: "Deepwater Yacht Basin", description: "Protected mega-yacht basin and waterfront promenade just off US-1." },
            { name: "Anchorage Park & Marina", category: "Boating & Recreation Park", description: "Intracoastal boat ramps, kayak launch, dry storage, and lighted courts." }
        ],
        thingsToDo: [
            { title: "Kayak Munyon Island at MacArthur Beach", spot: "A1A / Jack Nicklaus Drive", description: "Paddle across Lake Worth Lagoon to historic Munyon Island estuaries." },
            { title: "Golf & Sunset Dining at the Country Club", spot: "US Highway 1", description: "Play undulating links fairways and dine overlooking the 18th green." },
            { title: "Intracoastal Cruising to Peanut Island", spot: "Anchorage Park Boat Ramp", description: "Quick boat access to Lake Worth Inlet and Peanut Island sandbars." },
            { title: "Waterfront Dining along Crystal Cove Commons", spot: "US-1 Corridor", description: "Coastal seafood, wine bars, and specialty shops along US-1." }
        ],
        keyCorridors: ["US Highway 1", "PGA Boulevard", "Northlake Boulevard", "Prosperity Farms Road", "Lighthouse Drive", "A1A / Ocean Blvd"],
        topIndustries: ["Yacht Brokerage & Marine Dock Building", "Wealth & Accounting Firms", "Custom Waterfront Construction", "Concierge Medicine", "Boutique Fitness & Golf"]
    },
    "riviera-beach": {
        localCopy: [
            "Home to the Port of Palm Beach, Singer Island's beachfront towers, and Blue Heron Bridge diving at Phil Foster Park, Riviera Beach pairs maritime commerce with resort living.",
            "We support Broadway and Blue Heron logistics offices alongside Singer Island oceanfront condos with commercial janitorial, day porter service, and vacation rental turnovers."
        ],
        landmarks: [
            { name: "Phil Foster Park & Underwater Snorkel Trail", category: "World-Renowned Dive Site", description: "800-foot artificial reef trail beneath the Blue Heron Bridge." },
            { name: "Peanut Island Park", category: "Historic Lagoon Island", description: "80-acre inlet island with clear snorkeling lagoons and the JFK Bunker." },
            { name: "Port of Palm Beach & Riviera Beach Marina Village", category: "Maritime & Cruise Hub", description: "Busy maritime cargo port beside the waterfront Marina Event Center." },
            { name: "Singer Island Ocean Beach & Ocean Reef Park", category: "Coastal Resort Strip", description: "Seven miles of white-sand shoreline, oceanfront towers, and dune boardwalks." }
        ],
        thingsToDo: [
            { title: "Shore Diving the Blue Heron Bridge Trail", spot: "Phil Foster Park", description: "Spot octopuses, seahorses, and rays along calm slack-tide reef sculptures." },
            { title: "Water Taxi & Snorkeling at Peanut Island", spot: "Riviera Beach Marina", description: "Take the shuttle boat to clear snorkeling lagoons and picnic pavilions." },
            { title: "Parasailing & Paddleboarding at Sailfish Marina", spot: "Singer Island", description: "Thursday sunset art walks, water taxis, and offshore fishing charters." },
            { title: "Waterfront Splash Pad at Barracuda Bay", spot: "West Blue Heron Blvd", description: "Family aquatic center featuring water slides, splash zones, and lap pools." }
        ],
        keyCorridors: ["Blue Heron Boulevard", "Broadway (US-1)", "North Ocean Drive (Singer Island)", "Military Trail", "MLK Jr. Boulevard", "Australian Avenue"],
        topIndustries: ["Maritime Logistics & Freight", "Commercial Marine & Ship Repair", "Oceanfront Hospitality & Condos", "Industrial Manufacturing", "Dive & Charter Tourism"]
    },
    "broward-county": {
        localCopy: [
            "From Pompano Beach and Las Olas Boulevard to Hollywood Beach and Weston, Broward County forms a thriving commercial, marine, and residential corridor.",
            "Our teams serve downtown Fort Lauderdale towers, Las Olas hospitality, Coral Springs and Pembroke Pines offices, and coastal homes with commercial janitorial, clinic disinfection, and rental turnovers."
        ],
        landmarks: [
            { name: "Las Olas Boulevard & Riverwalk Fort Lauderdale", category: "Downtown Cultural & Dining Axis", description: "Waterfront arts promenade, boutiques, galleries, and New River yacht docks." },
            { name: "Fort Lauderdale Beach & Bonnet House Museum", category: "Historic Coastal Estate", description: "Signature wave-wall beachfront promenade and historic 35-acre coastal estate." },
            { name: "Hollywood Beach Broadwalk", category: "Oceanfront Promenade", description: "2.5-mile brick beachfront promenade lined with cafés, bandshell concerts, and resorts." },
            { name: "Sawgrass Mills & Flamingo Gardens", category: "Retail & Botanical Landmark", description: "Major national outlet destination beside a 60-acre historic botanical sanctuary." }
        ],
        thingsToDo: [
            { title: "Water Taxi Cruise along the Venice of America", spot: "New River & Intracoastal", description: "Cruise inland waterways past Millionaire's Row and waterfront dining." },
            { title: "Airboat Eco-Tours at Everglades Holiday Park", spot: "West Broward / Griffin Road", description: "Guided airboat tours across western Broward's Everglades sawgrass prairies." },
            { title: "Art & Theatre at Broward Center for Performing Arts", spot: "Riverwalk Arts & Entertainment District", description: "Waterfront Broadway shows, art museum exhibits, and outdoor jazz events." },
            { title: "Cycling the Hollywood Beach Broadwalk & Dania Pier", spot: "A1A Coastal Corridor", description: "Oceanfront biking, pier fishing, and casual beachfront cafés along A1A." }
        ],
        keyCorridors: ["Las Olas Boulevard", "Federal Highway (US-1)", "I-95 & I-595", "Sunrise Boulevard", "Broward Boulevard", "University Drive"],
        topIndustries: ["Global Marine & Superyacht Industry", "Aviation, Logistics & Port Everglades", "Enterprise Tech & FinTech", "Medical Centers & Cosmetic Surgery", "Luxury Real Estate & Hospitality"]
    },
    "miami-dade-county": {
        localCopy: [
            "Connecting Brickell's financial towers, Wynwood's creative district, Coral Gables' avenues, and Miami Beach's shoreline, Miami-Dade County leads South Florida commerce and hospitality.",
            "We support Brickell high-rises, Doral offices, Miami Beach condos, and Coral Gables estates with scalable commercial janitorial, hospitality deep cleans, and white-glove residential care."
        ],
        landmarks: [
            { name: "Vizcaya Museum and Gardens", category: "National Historic Landmark", description: "1916 waterfront villa and formal gardens overlooking Biscayne Bay." },
            { name: "Brickell City Centre & Miami Financial District", category: "Global Finance & Luxury Hub", description: "Open-air luxury center surrounded by international banks and rooftop dining." },
            { name: "Wynwood Walls & Miami Design District", category: "Global Art & Couture Quarter", description: "Outdoor mural museum beside flagship fashion houses and contemporary galleries." },
            { name: "Art Deco Historic District & Pérez Art Museum (PAMM)", category: "Architectural & Cultural Icons", description: "Pastel Ocean Drive Art Deco landmarks and bayfront contemporary art museum." }
        ],
        thingsToDo: [
            { title: "Gallery Hopping in Wynwood & Design District", spot: "NW 2nd Ave & NE 40th Street", description: "Street art murals, Michelin-recognized dining, and contemporary gallery showcases." },
            { title: "Bayfront Strolls at Maurice A. Ferré Park", spot: "Biscayne Boulevard", description: "Explore PAMM and the Frost Science planetarium and aquarium bayfront." },
            { title: "Historic Swim at the Venetian Pool & Miracle Mile", spot: "Coral Gables", description: "Spring-fed 1924 coral rock pool beside Coral Gables dining and shops." },
            { title: "Cape Florida Lighthouse & Key Biscayne Cycling", spot: "Bill Baggs Cape Florida State Park", description: "Historic 1825 lighthouse overlooking Biscayne Bay and coastal bike paths." }
        ],
        keyCorridors: ["Brickell Avenue", "Biscayne Boulevard (US-1)", "Calle Ocho (SW 8th St)", "Collins Avenue (A1A)", "Miracle Mile", "Palmetto Expressway (SR 826)"],
        topIndustries: ["International Banking & Crypto/FinTech", "Luxury Real Estate & Architecture", "Global Trade, Aviation & Cruise Lines", "Hospitality, Nightlife & Michelin Dining", "Multi-Lingual Legal & Medical Practices"]
    },
    "martin-county": {
        localCopy: [
            "Known for preserved coastlines and four-story height limits, Martin County spans Downtown Stuart, Hutchinson Island, Palm City, Hobe Sound, and Jupiter Island.",
            "From Stuart medical and legal suites to Kanner Highway marine businesses and Hobe Sound estates, we provide commercial janitorial, caretaker cleans, and post-build detailing."
        ],
        landmarks: [
            { name: "Historic Downtown Stuart & Riverwalk Stage", category: "Waterfront Main Street", description: "Walkable seaside downtown with boardwalks overlooking the St. Lucie River." },
            { name: "Elliott Museum & House of Refuge at Gilbert's Bar", category: "Historic Barrier Island Icons", description: "1876 shipwreck life-saving station and museum on Hutchinson Island." },
            { name: "Jonathan Dickinson State Park & Hobe Mountain", category: "Wild & Scenic Loxahatchee River", description: "11,500-acre coastal scrub preserve along the Wild and Scenic Loxahatchee." },
            { name: "Banyan Street & Bridge Road Canopy", category: "Natural Heritage Corridors", description: "Historic arching banyan and ficus tree canopies in Hobe Sound." }
        ],
        thingsToDo: [
            { title: "Sunday Rock'n Riverwalk Concerts", spot: "Stuart Riverwalk Stage", description: "Free Sunday waterfront music beside Downtown Stuart cafés and shops." },
            { title: "Boat Tour to Trapper Nelson's Zoo Camp", spot: "Jonathan Dickinson State Park", description: "Cruise or kayak upriver through cypress-lined Loxahatchee River bends." },
            { title: "Florida Oceanographic Coastal Center", spot: "Hutchinson Island", description: "57-acre marine center featuring stingray touch tanks and coastal lagoons." },
            { title: "Offshore Sailfish Charter Fishing", spot: "St. Lucie Inlet & Pirate's Cove", description: "World-renowned sailfish charters minutes from the Gulf Stream." }
        ],
        keyCorridors: ["US Highway 1 (Federal Hwy)", "Monterey Road", "Kanner Highway (SR 76)", "SE Ocean Boulevard", "Bridge Road (Hobe Sound)", "Martin Downs Boulevard"],
        topIndustries: ["Custom Sportfishing Yachts & Marine", "Luxury Estate Management (Jupiter Island)", "Coastal Construction & Roofing", "Healthcare & Cleveland Clinic Providers", "Eco-Tourism & Hospitality"]
    },
    "st-lucie-county": {
        localCopy: [
            "Stretching across fast-growing Port St. Lucie, Tradition Town Center, and Historic Downtown Fort Pierce, St. Lucie County blends residential growth with waterfront commerce.",
            "We serve Tradition healthcare campuses, St. Lucie West offices, and Fort Pierce coastal homes with hospital-grade sanitization, corporate janitorial, and move-in/move-out detailing."
        ],
        landmarks: [
            { name: "Clover Park & St. Lucie West", category: "Sports & Entertainment Hub", description: "Spring training ballpark home to the New York and St. Lucie Mets." },
            { name: "National Navy UDT-SEAL Museum", category: "National Military Landmark", description: "North Hutchinson Island museum on original WWII Frogmen training beaches." },
            { name: "Tradition Square & Town Center", category: "Master-Planned Lifestyle Hub", description: "Lakeside town square with public art, dining, and medical centers." },
            { name: "Historic Sunrise Theatre & Fort Pierce Inlet State Park", category: "Cultural & Coastal Icons", description: "1923 Vaudeville theater near Fort Pierce's farmers market and inlet." }
        ],
        thingsToDo: [
            { title: "Saturday Fort Pierce Downtown Farmers Market", spot: "Melody Lane Waterfront", description: "Over 70 waterfront vendors beside the Indian River Lagoon marina." },
            { title: "Botanical Strolls & Riverwalk at PSL Botanical Gardens", spot: "Westmoreland Boulevard", description: "21 acres of orchid rooms, bamboo gardens, and riverfront boardwalks." },
            { title: "Horseback Riding on the Beach at Frederick Douglass Park", spot: "South Hutchinson Island", description: "Guided oceanfront horseback rides along quiet Treasure Coast sand." },
            { title: "Manatee Observation & Smithsonian Marine Station", spot: "Seaway Drive, Fort Pierce", description: "Winter manatee viewing and Indian River Lagoon reef exhibits." }
        ],
        keyCorridors: ["Port St. Lucie Boulevard", "Tradition Parkway", "Gatlin Boulevard", "St. Lucie West Boulevard", "US-1", "Okeechobee Road"],
        topIndustries: ["Residential Construction & Trades", "Healthcare & Hospital Networks", "Distribution & Logistics", "Marine & Charter Fishing", "Family Retail & Professional Services"]
    },
    "orange-county": {
        localCopy: [
            "Centered around Downtown Orlando's Lake Eola, Winter Park's Park Avenue, Lake Nona Medical City, and International Drive, Orange County drives Central Florida's business and hospitality growth.",
            "Our teams handle Orlando office towers, Lake Nona clinical suites, attractions-corridor vacation rentals, and Winter Park residences with commercial janitorial, medical disinfection, and rapid turnovers."
        ],
        landmarks: [
            { name: "Lake Eola Park & Walt Disney Amphitheater", category: "Downtown Orlando Icon", description: "Downtown lakefront park with swan boats, fountain, and Sunday markets." },
            { name: "Park Avenue & Rollins College (Winter Park)", category: "Historic Luxury & Cultural Avenue", description: "Brick-paved boutiques, the Morse Museum, and scenic Winter Park lakes." },
            { name: "Dr. Phillips Center for the Performing Arts", category: "Arts & Cultural Landmark", description: "Downtown Orlando performing arts center hosting Broadway and symphony shows." },
            { name: "Lake Nona Town Center & Medical City", category: "Innovation & Biotech Hub", description: "Medical research campus beside USTA National Campus and Boxi Park." }
        ],
        thingsToDo: [
            { title: "Winter Park Scenic Boat Tour through Chain of Lakes", spot: "East Morse Boulevard", description: "Guided pontoon cruises through tree-lined canals and Winter Park lakes." },
            { title: "Botanical Walks at Harry P. Leu Gardens", spot: "North Forest Avenue", description: "50-acre gardens showcasing historic live oaks, camellias, and tropical flora." },
            { title: "Michelin-Recognized Dining in Mills 50 & Restaurant Row", spot: "Sand Lake Road & Thornton Park", description: "Renowned Orlando culinary districts featuring diverse, chef-driven dining." },
            { title: "Outdoor Music & Container Dining at Boxi Park", spot: "Lake Nona", description: "Open-air Lake Nona dining, live music, and family hangout." }
        ],
        keyCorridors: ["Orange Avenue", "Colonial Drive (SR 50)", "Sand Lake Road", "Park Avenue", "International Drive", "I-4 & SR 408"],
        topIndustries: ["Simulation, Defense & SaaS Tech", "Biotech & Healthcare (Lake Nona)", "Hospitality & Convention Services", "Commercial & Luxury Real Estate", "Legal & Financial Advisory"]
    },
    "okeechobee-county": {
        localCopy: [
            "Sitting on the northern shore of Lake Okeechobee, Okeechobee County serves as South and Central Florida's agricultural, ranching, and freshwater sportfishing crossroads.",
            "From US-441 and SR-70 clinics and commercial offices to lakeside properties, we deliver reliable office janitorial, heavy-duty floor care, and thorough residential cleaning."
        ],
        landmarks: [
            { name: "Lake Okeechobee Scenic Trail (LOST) & Lock 7", category: "Freshwater & Eco Landmark", description: "Paved dike trail overlooking Florida's largest freshwater lake and marshes." },
            { name: "Flagler Park in Historic Downtown Okeechobee", category: "Civic Main Street Park", description: "Shaded downtown park blocks hosting local festivals and heritage monuments." },
            { name: "Okeechobee Battlefield Historic State Park", category: "Historic Heritage Site", description: "Preserved 1837 historic site with trails and seasonal reenactments." },
            { name: "Kissimmee Prairie Preserve State Park", category: "International Dark Sky Park", description: "54,000-acre dry prairie famed for wildlife and dark-sky stargazing." }
        ],
        thingsToDo: [
            { title: "Trophy Largemouth Bass & Crappie Fishing", spot: "Scott Driver Park & Garrard's Bait & Tackle", description: "Guided bass fishing and airboat excursions across Lake Okeechobee." },
            { title: "Speckled Perch Festival & Rodeo Weekend", spot: "Flagler Park & Cattlemen's Arena", description: "Heritage parade, community fish fry, and annual PRCA rodeo." },
            { title: "Cycling the Lake Okeechobee Scenic Trail", spot: "Clifford E. 'Sonny' Williamson Park", description: "Wide lakeside biking and birdwatching along the Hoover Dike trail." },
            { title: "Stargazing at Kissimmee Prairie Preserve", spot: "NW 40th Avenue", description: "Florida's first International Dark Sky Park with native prairie wildlife." }
        ],
        keyCorridors: ["US Highway 441 / Parrott Avenue", "State Road 70 (Park Street)", "State Road 78", "US Highway 98", "SW 16th Avenue"],
        topIndustries: ["Agribusiness, Dairy & Cattle Ranching", "Freshwater Marine & Bass Guides", "Heavy Equipment & Diesel Logistics", "Roofing, Fencing & Land Clearing", "Regional Healthcare & Retail"]
    }
};

Object.assign(SERVICE_AREA_GUIDES, ADDITIONAL_GUIDES);

const COMMUNITY_AND_COASTAL_GUIDES: Record<string, ServiceAreaGuide> = {
    "greenacres": {
        localCopy: [
            "Centrally located along Jog Road, Lake Worth Road, and Forest Hill Boulevard, Greenacres is a growing family community anchored by Samuel J. Ferreri Park near Okeeheelee Park.",
            "We serve Jog Road and Lake Worth Road medical clinics, retail plazas, and family neighborhoods with dependable office janitorial, bilingual support, and thorough residential deep cleaning."
        ],
        landmarks: [
            { name: "Samuel J. Ferreri Community Park", category: "Civic & Festival Park", description: "Central community park hosting local cultural festivals and youth athletics." },
            { name: "Okeeheelee Park & Nature Center", category: "Regional Recreation Hub", description: "1,700-acre regional park with golf, BMX trails, waterski lakes, and nature paths." },
            { name: "Greenacres Freedom Park", category: "Sports & Community Complex", description: "Lighted sports fields, lakeside walking paths, and memorial plazas on Swain Boulevard." },
            { name: "Lake Worth Road & Jog Road Commercial Plaza District", category: "Central Retail Axis", description: "Busy central Palm Beach County retail, dining, and commuter crossroads." }
        ],
        thingsToDo: [
            { title: "Cable Waterskiing & Golf at Okeeheelee Park", spot: "Forest Hill Boulevard", description: "27 holes of public golf, wakeboarding cables, and paved lakeside bike trails." },
            { title: "Annual Fiesta de Pueblo Cultural Festival", spot: "Samuel J. Ferreri Community Park", description: "Vibrant annual festival celebrating Latin American music, food, and local businesses." },
            { title: "Nature Trail Walks at Pinehurst Mountain Bike Trail", spot: "Okeeheelee South", description: "Shaded wooded trails and wildlife boardwalks along Okeeheelee South." },
            { title: "International Dining along Lake Worth Road", spot: "Jog Road to Military Trail", description: "Neighborhood Latin, Caribbean, and Mediterranean family restaurants along Lake Worth Road." }
        ],
        keyCorridors: ["Jog Road", "Lake Worth Road", "Forest Hill Boulevard", "10th Avenue North", "Military Trail", "Haverhill Road"],
        topIndustries: ["Family Medical & Dental Clinics", "HVAC, Plumbing & Roofing Trades", "Tax, Accounting & Insurance", "Auto Repair & Dealership Services", "Multi-Cultural Dining & Retail"]
    },
    "lantana": {
        localCopy: [
            "Combining direct Atlantic access at Lantana Municipal Beach with walkable East Ocean Avenue and Intracoastal homes on Hypoluxo Island, Lantana blends coastal charm with waterfront living.",
            "From East Ocean Avenue restaurants and marine shops to Hypoluxo Island residences, our crews provide commercial kitchen degreasing, vacation rental turnovers, and recurring home maintenance."
        ],
        landmarks: [
            { name: "Lantana Municipal Beach & Pavilion", category: "Oceanfront Park", description: "Public Atlantic beachfront park featuring dune boardwalks and oceanfront café dining." },
            { name: "Historic Old Key Lime House", category: "Historic Waterfront Landmark", description: "1889 waterfront restaurant overlooking the Intracoastal Waterway on East Ocean Avenue." },
            { name: "Lantana Nature Preserve", category: "Coastal Hammock Sanctuary", description: "Shaded subtropical coastal hammock trail beside the Intracoastal Waterway." },
            { name: "Lantana Bicentennial Park & Boat Ramp", category: "Lagoon Waterfront Park", description: "Lake Worth Lagoon park and marina launch along East Ocean Avenue." }
        ],
        thingsToDo: [
            { title: "Sunset Live Music on the Intracoastal", spot: "East Ocean Avenue Waterfront", description: "Dockside dining, tiki patios, and waterfront music beside the Lantana bridge." },
            { title: "Sunrise Beach Breakfast at Lantana Beach", spot: "South Ocean Boulevard (A1A)", description: "Oceanfront morning dining steps from the sand along South Ocean Boulevard." },
            { title: "Kayaking around Hypoluxo Island", spot: "Lantana Boat Ramp", description: "Paddle calm Intracoastal waters past historic waterfront estates and manatee habitats." },
            { title: "Shaded Hammock Walks at Lantana Nature Preserve", spot: "East Ocean Avenue", description: "Short coastal nature walk beneath native gumbo limbo trees." }
        ],
        keyCorridors: ["East Ocean Avenue", "Dixie Highway (US-1)", "Lantana Road", "Hypoluxo Road", "South Ocean Blvd (A1A)", "I-95"],
        topIndustries: ["Waterfront Dining & Hospitality", "Marine Services & Boat Sales", "Coastal Real Estate & Remodeling", "Healthcare & Senior Living", "Commercial Trades"]
    },
    "palm-springs": {
        localCopy: [
            "Positioned between Lake Worth Beach and West Palm Beach along Congress Avenue and Forest Hill Boulevard, Palm Springs is a busy residential and commercial village.",
            "Serving Congress Avenue clinics, dental and legal offices, and surrounding neighborhoods, we provide terminal medical sanitization, daily office floor care, and dependable home housekeeping."
        ],
        landmarks: [
            { name: "Village of Palm Springs Park & Splash Pad", category: "Civic Center Complex", description: "Central village green, athletic courts, library, and splash pad on Cypress Lane." },
            { name: "Lake Clarke & Chain of Lakes Waterways", category: "Freshwater Canal System", description: "Freshwater boating canals connecting Palm Springs and Lake Clarke Shores." },
            { name: "Congress Avenue Commercial Corridor", category: "Business & Medical Axis", description: "Active retail, medical, and professional services corridor through Palm Springs." },
            { name: "Sago Palm Park", category: "Neighborhood Eco-Park", description: "Shaded walking trails and butterfly garden tucked inside central Palm Springs." }
        ],
        thingsToDo: [
            { title: "Family Afternoons at Village Splash Pad", spot: "226 Cypress Lane", description: "Interactive splash pad, shaded pavilions, and weekend community gatherings." },
            { title: "Freshwater Kayaking & Bass Fishing", spot: "Keller Canal & Lake Clarke Access", description: "Calm inland canals ideal for early morning kayaking and bass fishing." },
            { title: "Latin Bakeries & Cafés on Congress Avenue", spot: "Congress Ave & Forest Hill Blvd", description: "Neighborhood Cuban bakeries, coffee counters, and international family restaurants." },
            { title: "Ice Skating & Hockey Nearby at Palm Beach Skate Zone", spot: "Lake Worth Road Corridor", description: "Year-round twin-rink ice skating and youth hockey minutes away." }
        ],
        keyCorridors: ["Congress Avenue", "Forest Hill Boulevard", "10th Avenue North", "Lake Worth Road", "Military Trail", "Kirk Road"],
        topIndustries: ["Medical & Urgent Care Clinics", "Auto & Commercial Services", "Home Remodeling & HVAC", "Immigration & Family Law", "Local Retail & Groceries"]
    },
    "lake-park": {
        localCopy: [
            "Anchored by 1920s Kelsey City heritage, Lake Park Harbor Marina, and the Park Avenue Arts & Brewery District, Lake Park is a lively revitalized coastal town.",
            "From Park Avenue craft breweries and studios to Northlake Boulevard industrial spaces, we deliver taproom and restaurant cleaning, shop detailing, and move-in/move-out turnovers."
        ],
        landmarks: [
            { name: "Lake Park Harbor Marina", category: "Deepwater Intracoastal Marina", description: "Intracoastal marina offering wet slips, boat ramps, and Lake Worth Inlet access." },
            { name: "Kelsey Park on the Intracoastal", category: "Waterfront Heritage Park", description: "Palm-lined waterfront park showcasing historic 1923 Olmsted Brothers design." },
            { name: "Park Avenue Downtown Arts & Brewery District", category: "Creative Main Street", description: "Walkable arts corridor with craft breweries, roasters, studios, and Kelsey Theater." },
            { name: "Historic Lake Park Town Hall (1927)", category: "Mediterranean Revival Icon", description: "Restored 1927 landmark featuring a signature clock tower and civic auditorium." }
        ],
        thingsToDo: [
            { title: "Sunset Brews & Live Music on Park Avenue", spot: "Downtown Lake Park", description: "Monthly marina Sunset Celebrations and craft taproom tastings along Park Avenue." },
            { title: "Boating & Picnics at Kelsey Park", spot: "Lake Shore Drive", description: "Watch Intracoastal boats pass beside shaded picnic lawns and tennis courts." },
            { title: "Live Concerts at The Kelsey Theater", spot: "700 Park Avenue", description: "Intimate live concerts, independent films, and neighborhood comedy nights." },
            { title: "Kayaking to Munyon Island", spot: "Lake Park Harbor Marina Launch", description: "Short paddle across Lake Worth Lagoon to MacArthur Beach State Park." }
        ],
        keyCorridors: ["Park Avenue", "Federal Highway (US-1)", "Northlake Boulevard", "10th Street", "Silver Beach Road", "Congress Avenue"],
        topIndustries: ["Marine Service & Boat Outfitters", "Craft Hospitality & Roasteries", "Specialty Construction & Cabinetry", "Industrial & Warehouse Logistics", "Creative Studios"]
    },
    "tequesta": {
        localCopy: [
            "Where the Loxahatchee River forks meet at Palm Beach County's northern edge, Tequesta offers quiet village living, fine galleries, and quick access to Coral Cove Park.",
            "Our discreet crews serve Tequesta Drive and US-1 boutiques and offices alongside waterfront country club estates with white-glove housekeeping, post-build cleanup, and janitorial care."
        ],
        landmarks: [
            { name: "Coral Cove Park on Jupiter Island", category: "Limestone Reef Beach", description: "Anastasia limestone rock formations, tide pools, and calm reef snorkeling." },
            { name: "Lighthouse ArtCenter Gallery & School of Art", category: "Cultural Institution", description: "Northern Palm Beach County visual arts museum, gallery, and studio school." },
            { name: "Constitution Park & Baumgee's Treehouse", category: "Community Park", description: "Shaded neighborhood park with elevated canopy treehouse, disc golf, and trails." },
            { name: "Loxahatchee River & Pointe waterfront", category: "Waterfront Confluence", description: "Scenic river confluence looking across toward the Jupiter Inlet Lighthouse." }
        ],
        thingsToDo: [
            { title: "Snorkeling Limestone Ledges at Coral Cove Park", spot: "Beach Road", description: "Explore nearshore limestone ledges, sea turtles, and calm Intracoastal swim coves." },
            { title: "Fine Art Exhibitions at Lighthouse ArtCenter", spot: "Tequesta Drive", description: "Rotating art exhibitions, ceramics classes, and annual plein air festivals." },
            { title: "Specialty Coffee & Boutique Shopping", spot: "Tequesta Drive & Gallery Square", description: "Curated coastal home boutiques, surf shops, and neighborhood coffee spots." },
            { title: "Pontoon & Paddleboard Cruises up the Loxahatchee", spot: "Juno Park / River Access", description: "Boat or paddle past riverside estates toward Jonathan Dickinson State Park." }
        ],
        keyCorridors: ["US Highway 1", "Tequesta Drive", "County Line Road", "Seabrook Road", "Old Dixie Highway"],
        topIndustries: ["Luxury Interior Design & Retail", "Concierge Medical & Wellness", "Custom Waterfront Builders", "Fine Art & Jewelry", "Marine & Yacht Management"]
    },
    "juno-beach": {
        localCopy: [
            "Framed by the Atlantic Ocean and over 40% preserved land, Juno Beach is home to Loggerhead Marinelife Center, Juno Beach Pier, and NextEra Energy headquarters.",
            "We support US-1 and Donald Ross Road corporate offices alongside Ocean Drive condominiums with executive suite janitorial, vacation rental turnovers, and coastal home care."
        ],
        landmarks: [
            { name: "Loggerhead Marinelife Center", category: "Global Sea Turtle Hospital", description: "Sea turtle hospital, marine research campus, and ocean conservation center." },
            { name: "Juno Beach Pier", category: "Oceanfront Landmark", description: "990-foot Atlantic saltwater fishing and scenic oceanfront walking pier." },
            { name: "Juno Dunes Natural Area", category: "569-Acre Scrub Preserve", description: "Ocean-to-Intracoastal preserve featuring Palm Beach County's highest natural sand dune." },
            { name: "Pelican Lake in Town Center", category: "Scenic Civic Landmark", description: "Tranquil lakeside walking path and gazebos in central Juno Beach." }
        ],
        thingsToDo: [
            { title: "Meet Rescued Sea Turtles at Loggerhead Center", spot: "14200 US Highway 1", description: "Visit outdoor sea turtle rehabilitation tanks and seasonal guided turtle walks." },
            { title: "Sunrise Photography & Fishing on Juno Pier", spot: "Ocean Drive (A1A)", description: "Rent fishing tackle at the pier house and watch Atlantic sunrises." },
            { title: "Hike to the Observation Tower at Juno Dunes", spot: "US-1 Trailhead", description: "Short scrub trail leading to ocean-to-Intracoastal observation tower views." },
            { title: "Dog-Friendly Beach Walks at Jupiter/Juno Off-Leash", spot: "Marcinski Road North", description: "Popular off-leash ocean beach stretch just north of Juno Beach Pier." }
        ],
        keyCorridors: ["Ocean Drive (A1A)", "US Highway 1", "Donald Ross Road", "Marcinski Road", "Universe Boulevard"],
        topIndustries: ["Clean Energy & Corporate Executive Services", "Coastal Real Estate & Vacation Rentals", "Hospitality & Oceanfront Dining", "Wealth Management", "Eco-Tourism & Wellness"]
    },
    "westlake": {
        localCopy: [
            "Palm Beach County's newest municipality continues rapid master-planned growth along Seminole Pratt Whitney Road, anchored by Westlake Adventure Park and the regional ER campus.",
            "As new Westlake homes and shops open, South Florida Cleaning Concepts delivers thorough post-construction cleanup, move-in deep scrubs, and recurring family home cleaning."
        ],
        landmarks: [
            { name: "Westlake Adventure Park & Lagoon Pool", category: "Master-Planned Amenity Hub", description: "15-acre recreation park with lagoon pool, slides, BMX track, and lawn." },
            { name: "Shoppes of Westlake Landings", category: "Commercial Town Center", description: "Expanding neighborhood retail, dining, and medical hub on Seminole Pratt Whitney." },
            { name: "J.W. Corbett Wildlife Management Area Gateway", category: "Pine Flatwoods Preserve", description: "60,000-acre pine flatwoods and cypress preserve bordering northern Westlake." },
            { name: "Cresswind Palm Beach Clubhouse", category: "Active Adult Landmark", description: "Resort-style active-adult clubhouse, pools, and fitness center." }
        ],
        thingsToDo: [
            { title: "BMX Pump Park & Resort Lagoon Pool", spot: "Kingfisher Boulevard", description: "Family water slides, splash pad, bocce courts, and weekend food trucks." },
            { title: "4thFest & Concert Lawn Events", spot: "Westlake Adventure Park", description: "Community concerts, holiday fireworks, and seasonal neighborhood farmers markets." },
            { title: "Golf Cart Trail Cruising Across Neighborhoods", spot: "Town Center Parkway", description: "Multi-use paths linking Westlake neighborhoods directly to shopping and dining." },
            { title: "Wildlife Viewing at Corbett & Loxahatchee Slough", spot: "Seminole Pratt Whitney North", description: "Hiking, trail riding, and birding across preserved Florida pine flatwoods." }
        ],
        keyCorridors: ["Seminole Pratt Whitney Road", "Town Center Parkway", "Persimmon Boulevard", "60th Street North", "Southern Boulevard"],
        topIndustries: ["Custom Pool, Patio & Landscape Design", "Home Automation & Impact Glass", "Family Medical, Dental & Veterinary", "Real Estate & Mortgage Services", "New Retail & Restaurants"]
    },
    "lake-clarke-shores": {
        localCopy: [
            "Centered around freshwater Lake Clarke and its navigable canal system, Lake Clarke Shores is a tranquil boating and waterskiing residential town tucked between Forest Hill Boulevard and Southern Boulevard.",
            "Our vetted pros serve Lake Clarke Shores lakefront estates, residential streets, and nearby Forest Hill and Southern Boulevard offices with eco-safe rotation cleaning, humidity-ready floor care, and commercial sanitization."
        ],
        landmarks: [
            { name: "Lake Clarke & Connecting Canal Network", category: "Freshwater Boating Hub", description: "Spring-fed freshwater lake and residential canals known for waterskiing and wakeboarding." },
            { name: "Lake Clarke Shores Memorial Park", category: "Lakeside Civic Park", description: "Tree-shaded waterfront park and Town Hall green along Pine Tree Lane." },
            { name: "Community Park & Tennis Courts", category: "Neighborhood Recreation", description: "Lighted tennis courts, walking paths, and family picnic pavilions." },
            { name: "Forest Hill & Southern Boulevard Corridors", category: "Local Transit & Retail Axis", description: "Direct access to neighborhood medical offices, dining, I-95, and PBI Airport." }
        ],
        thingsToDo: [
            { title: "Morning Waterskiing & Wakeboarding", spot: "Lake Clarke", description: "Calm freshwater runs along Lake Clarke and its sheltered residential canals." },
            { title: "Lakeside Walking & Sunset Strolls", spot: "Memorial Park & Pine Tree Lane", description: "Shaded walks beneath mature live oaks overlooking the water." },
            { title: "Neighborhood Tennis & Pickleball", spot: "Town Community Park", description: "Evening court play and family gatherings on shaded park lawns." },
            { title: "Freshwater Kayaking & Birdwatching", spot: "Lake Clarke Waterways", description: "Quiet morning paddles past lakeside docks and wading birds." }
        ],
        keyCorridors: ["Forest Hill Boulevard", "Southern Boulevard", "Lake Clarke Drive", "Pine Tree Lane", "I-95 Access"],
        topIndustries: ["Lakefront Residential & Estate Care", "Freshwater Marine & Boating Services", "Local Medical & Dental Suites", "Boutique Professional Offices", "Home Remodeling & Landscaping"]
    },
    "golden-lakes": {
        localCopy: [
            "Positioned along Okeechobee Boulevard west of Florida's Turnpike, Golden Lakes is an active 55+ condominium and lakefront community built around scenic freshwater lakes and clubhouse amenities.",
            "South Florida Cleaning Concepts supports Golden Lakes condominiums, seasonal residences, and neighboring Jog Road and Okeechobee medical suites with gentle eco-safe housekeeping and dependable clinic care."
        ],
        landmarks: [
            { name: "Golden Lakes Clubhouse & Lakefront Campus", category: "Active 55+ Community Hub", description: "Lakeside clubhouse, heated pools, and social halls anchoring Golden Lakes." },
            { name: "Okeechobee Boulevard & Turnpike Corridor", category: "Transit & Healthcare Axis", description: "Direct Turnpike access connecting residents to nearby clinics, pharmacies, and dining." },
            { name: "Okeeheelee Park & Nature Center", category: "Nearby Regional Park", description: "1,700-acre county park minutes south with paved lake trails and 27 holes of golf." },
            { name: "Jog Road & Okeechobee Retail Plazas", category: "Neighborhood Services", description: "Convenient grocery, dental, financial, and family dining centers nearby." }
        ],
        thingsToDo: [
            { title: "Clubhouse Pools & Social Events", spot: "Golden Lakes Clubhouse", description: "Water aerobics, card clubs, and seasonal resident socials overlooking the lake." },
            { title: "Flat Lakeside Morning Walks", spot: "Golden Lakes Walking Paths", description: "Paved neighborhood loops around freshwater lakes lined with royal palms." },
            { title: "Nature Trails & Public Golf Nearby", spot: "Okeeheelee Park", description: "Cypress boardwalks, nature center exhibits, and lakeside biking minutes away." },
            { title: "Local Café & Market Outings", spot: "Okeechobee & Jog Corridors", description: "Neighborhood bakeries, cafés, and everyday shopping plazas." }
        ],
        keyCorridors: ["Okeechobee Boulevard", "Jog Road", "Florida's Turnpike", "Golden Lakes Boulevard", "Melaleuca Lane"],
        topIndustries: ["Active-Adult Condominium Care", "Outpatient & Senior Healthcare", "Neighborhood Retail & Dining", "Home Maintenance & Remodeling", "Financial & Insurance Offices"]
    },
    "limestone-creek": {
        localCopy: [
            "Tucked along Church Street and the Indiantown Road corridor in Northern Palm Beach County just west of Jupiter, Limestone Creek pairs historic shaded residential streets with parks and athletic fields.",
            "Our local crews serve Limestone Creek homes, nearby Jupiter and Tequesta residences, and Indiantown Road offices with recurring rotation cleaning, move-in/move-out detailing, and commercial care."
        ],
        landmarks: [
            { name: "Limestone Creek Park & Community Center", category: "Neighborhood Hub", description: "Community center, shaded picnic pavilions, and neighborhood sports fields." },
            { name: "Indiantown Road Corridor", category: "Northern Palm Beach Axis", description: "Main Jupiter east-west corridor linking neighborhood streets to dining, clinics, and I-95." },
            { name: "Riverbend Park & Loxahatchee River", category: "Nearby Eco-Preserve", description: "Historic cypress river park minutes west with kayak launches and shaded bike trails." },
            { name: "Church Street Residential Enclave", category: "Historic Jupiter Corridor", description: "Quiet, tree-lined Northern Palm Beach residential avenues adjacent to Jupiter." }
        ],
        thingsToDo: [
            { title: "Community Sports & Park Picnics", spot: "Limestone Creek Park", description: "Local ballgames, shaded playgrounds, and neighborhood community events." },
            { title: "Canoeing & Biking on the Loxahatchee", spot: "Riverbend Park", description: "Shaded shell-rock bike trails and calm cypress-lined paddling minutes away." },
            { title: "Dining & Shops Along Indiantown Road", spot: "Jupiter Indiantown Corridor", description: "Family restaurants, coffee counters, and neighborhood boutiques minutes east." },
            { title: "Atlantic Beach & Inlet Trips", spot: "Jupiter Beach & Inlet", description: "Short drive east along Indiantown Road to beaches and the Jupiter Lighthouse." }
        ],
        keyCorridors: ["Indiantown Road", "Church Street", "Island Way", "Central Boulevard", "I-95 & Florida's Turnpike"],
        topIndustries: ["Residential Home Maintenance", "Local Medical & Dental Clinics", "Landscaping & Home Trades", "Neighborhood Retail & Dining", "Commercial & Marine Services"]
    }
};

Object.assign(SERVICE_AREA_GUIDES, COMMUNITY_AND_COASTAL_GUIDES);

export const SERVICE_AREA_STATS: Record<string, ServiceAreaStats> = {
    "west-palm-beach": {
        population: "117,415",
        households: "52,522",
        landArea: "53.82 sq mi",
        commercialGrowth: "Wall Street South finance, Class-A corporate towers, legal & healthcare hub",
        geographyType: "Coastal plain bordering Lake Worth Lagoon & Grassy Waters wetlands"
    },
    "boca-raton": {
        population: "97,422",
        households: "41,400",
        landArea: "29.20 sq mi",
        commercialGrowth: "Corporate HQ hub (The Park at Broken Sound), FAU research & luxury retail",
        geographyType: "Atlantic coastal barrier island & Intracoastal waterway corridor"
    },
    "delray-beach": {
        population: "66,846",
        households: "29,933",
        landArea: "15.92 sq mi",
        commercialGrowth: "Downtown Atlantic Ave dining & arts corridor, hospitality & medical tech",
        geographyType: "Coastal plain extending from barrier beach west to Wakodahatchee wetlands"
    },
    "jupiter": {
        population: "61,047",
        households: "26,959",
        landArea: "21.60 sq mi",
        commercialGrowth: "Biotech & life sciences (Max Planck, Scripps), Roger Dean Stadium & luxury marine",
        geographyType: "Loxahatchee River estuary convergence & coastal inlet"
    },
    "palm-beach-gardens": {
        population: "59,182",
        households: "28,500",
        landArea: "55.30 sq mi",
        commercialGrowth: "Golf Capital of the World (PGA of America), Gardens Mall retail & biotech",
        geographyType: "Northern Palm Beach County plain to Loxahatchee Slough nature corridor"
    },
    "wellington": {
        population: "61,637",
        households: "22,500",
        landArea: "45.20 sq mi",
        commercialGrowth: "Winter Equestrian Capital of the World, multi-billion equestrian industry & SR-7 retail",
        geographyType: "Western Everglades fringe and wetland drainage greenways"
    },
    "boynton-beach": {
        population: "80,380",
        households: "36,500",
        landArea: "16.16 sq mi",
        commercialGrowth: "Downtown Town Square redevelopment, Boynton Harbor Marina & medical corridor",
        geographyType: "Central coastal plain with direct ocean inlet access at Boynton Inlet"
    },
    "lake-worth-beach": {
        population: "42,219",
        households: "16,200",
        landArea: "5.89 sq mi",
        commercialGrowth: "Downtown arts & cultural district, historic cottage restorations & municipal pier",
        geographyType: "Lake Worth Lagoon mainland shoreline, Bryant Park & barrier beach"
    },
    "royal-palm-beach": {
        population: "38,932",
        households: "14,800",
        landArea: "11.30 sq mi",
        commercialGrowth: "Master-planned park sanctuary (350+ acres of parks), Commons Park & SR-7 retail",
        geographyType: "Western suburban canal network & Pine flatwoods preserve"
    },
    "north-palm-beach": {
        population: "13,162",
        households: "8,400",
        landArea: "3.58 sq mi",
        commercialGrowth: "Jack Nicklaus Signature municipal links, mega-yacht marinas & waterfront commerce",
        geographyType: "Lake Worth Lagoon & Earman River estuary gateway to MacArthur Beach"
    },
    "riviera-beach": {
        population: "37,604",
        households: "16,500",
        landArea: "8.50 sq mi",
        commercialGrowth: "Port of Palm Beach maritime shipping & Singer Island luxury oceanfront resort towers",
        geographyType: "Mainland industrial port sector and Singer Island barrier island strip"
    },
    "greenacres": {
        population: "43,990",
        households: "18,200",
        landArea: "5.96 sq mi",
        commercialGrowth: "Tree City USA family community, Jog Road retail plazas & multicultural commercial centers",
        geographyType: "Central flatwoods basin bordered by Okeeheelee Park waterways"
    },
    "lantana": {
        population: "11,504",
        households: "5,300",
        landArea: "2.30 sq mi",
        commercialGrowth: "Historic coastal dining corridor (Old Key Lime House), marine trades & Ocean Ave retail",
        geographyType: "Tri-part coastal geography: mainland, Hypoluxo Island & municipal barrier beach"
    },
    "palm-springs": {
        population: "26,890",
        households: "10,500",
        landArea: "4.30 sq mi",
        commercialGrowth: "Congress Avenue & Forest Hill Blvd commercial crossway, family healthcare & multicultural retail",
        geographyType: "Inland central plain between West Palm Beach and Lake Worth"
    },
    "lake-park": {
        population: "9,047",
        households: "4,100",
        landArea: "2.30 sq mi",
        commercialGrowth: "Lake Park Harbor Marina, Park Avenue Arts & Brewery revitalization district",
        geographyType: "Coastal Lake Worth Lagoon shoreline directly across from Peanut Island"
    },
    "tequesta": {
        population: "6,158",
        households: "3,500",
        landArea: "1.80 sq mi",
        commercialGrowth: "Northern Palm Beach County village center, art galleries, fine dining & country club estates",
        geographyType: "Loxahatchee River North Fork & Northwest Fork estuary border with Martin County"
    },
    "juno-beach": {
        population: "3,858",
        households: "2,850",
        landArea: "1.90 sq mi",
        commercialGrowth: "NextEra Energy global headquarters, Loggerhead Marinelife Center & oceanfront vacation rentals",
        geographyType: "Coastal barrier ridge between Atlantic Ocean and Intracoastal Waterway"
    },
    "highland-beach": {
        population: "4,295",
        households: "2,400",
        landArea: "0.50 sq mi",
        commercialGrowth: "Exclusive coastal residential enclave, luxury ocean-to-Intracoastal condominium towers",
        geographyType: "3-mile coastal barrier island strip bordered by Delray Beach and Boca Raton"
    },
    "hypoluxo": {
        population: "2,687",
        households: "1,450",
        landArea: "0.80 sq mi",
        commercialGrowth: "Yacht club marinas, residential waterfront complexes & Hypoluxo Scrub preserve",
        geographyType: "West bank of Lake Worth Lagoon facing Hypoluxo Island"
    },
    "manalapan": {
        population: "419",
        households: "230",
        landArea: "0.45 sq mi",
        commercialGrowth: "Top 5 wealthiest US ZIP code (33462), Forbes 5-Star Eau Palm Beach Resort, Plaza del Mar",
        geographyType: "Barrier island tip and southern Hypoluxo Island bordered by Boynton Inlet"
    },
    "ocean-ridge": {
        population: "1,830",
        households: "1,000",
        landArea: "0.90 sq mi",
        commercialGrowth: "Low-density residential barrier island enclave, luxury estates & coastal conservation",
        geographyType: "Barrier island strip between Atlantic Ocean and Intracoastal lagoon"
    },
    "south-palm-beach": {
        population: "1,471",
        households: "1,100",
        landArea: "0.10 sq mi",
        commercialGrowth: "High-density oceanfront condominium strip on A1A with seasonal resident population",
        geographyType: "Narrow 5/8-mile barrier island strip between Atlantic Ocean and Lake Worth Lagoon"
    },
    "palm-beach": {
        population: "9,245",
        households: "9,326",
        landArea: "3.90 sq mi",
        commercialGrowth: "Billionaire enclave, family offices, couture retail on Worth Avenue & luxury hotels (The Breakers)",
        geographyType: "16-mile barrier island dividing Lake Worth Lagoon from Atlantic Ocean"
    },
    "atlantis": {
        population: "2,142",
        households: "1,200",
        landArea: "1.40 sq mi",
        commercialGrowth: "Private gated golf community, Atlantis Country Club & HCA Florida JFK Hospital medical hub",
        geographyType: "Enclosed inland golf sanctuary with street-legal golf cart networks"
    },
    "haverhill": {
        population: "2,187",
        households: "780",
        landArea: "0.60 sq mi",
        commercialGrowth: "Inland equestrian and contractor properties, quiet residential streets near PBI Airport",
        geographyType: "Inland central pocket between Belvedere Road and Southern Boulevard"
    },
    "mangonia-park": {
        population: "2,142",
        households: "790",
        landArea: "0.70 sq mi",
        commercialGrowth: "Industrial warehousing, commercial logistics & Tri-Rail commuter rail terminus",
        geographyType: "Urban transportation corridor north of West Palm Beach"
    },
    "loxahatchee": {
        population: "26,000",
        households: "8,200",
        landArea: "48.00 sq mi",
        commercialGrowth: "Equestrian properties, organic agriculture, nursery cultivation & Lion Country Safari",
        geographyType: "Western pine flatwoods basin bordering Arthur R. Marshall Loxahatchee Wildlife Refuge"
    },
    "the-acreage": {
        population: "39,000",
        households: "12,800",
        landArea: "40.50 sq mi",
        commercialGrowth: "Expansive 1.25-acre residential acreage parcels, local commercial plazas & community park",
        geographyType: "Western flatwoods basin north of Royal Palm Beach and west of Grassy Waters"
    },
    "palm-beach-shores": {
        population: "1,330",
        households: "950",
        landArea: "0.30 sq mi",
        commercialGrowth: "Boutique oceanfront resort strip, Sailfish Marina yacht charters & inlet fishing commerce",
        geographyType: "Southernmost tip of Singer Island surrounded by Lake Worth Inlet and Atlantic Ocean"
    },
    "glen-ridge": {
        population: "217",
        households: "85",
        landArea: "0.20 sq mi",
        commercialGrowth: "Tranquil single-family residential enclave preserved along Southern Boulevard",
        geographyType: "Inland residential town adjacent to Palm Beach International Airport and C-51 Canal"
    },
    "gulf-stream": {
        population: "954",
        households: "475",
        landArea: "0.80 sq mi",
        commercialGrowth: "Historic Australian pine canopy corridor, ultra-luxury polo and coastal estates, private school",
        geographyType: "Barrier island bisected by Highway A1A and Intracoastal Waterway"
    },
    "cloud-lake": {
        population: "135",
        households: "55",
        landArea: "0.10 sq mi",
        commercialGrowth: "Exclusively single-family residential town centered around a scenic freshwater lake",
        geographyType: "One of Florida's smallest municipalities, located near Southern Blvd and West Palm Beach"
    },
    "golf": {
        population: "255",
        households: "130",
        landArea: "0.80 sq mi",
        commercialGrowth: "Prestigious private golf sanctuary anchored by the Country Club of Florida",
        geographyType: "Inland golf oasis situated between Boynton Beach and Delray Beach along Military Trail"
    },
    "briny-breezes": {
        population: "502",
        households: "480",
        landArea: "0.10 sq mi",
        commercialGrowth: "Self-governing ocean-to-Intracoastal mobile home cooperative community with private marina",
        geographyType: "43-acre barrier island strip stretching from Atlantic Ocean to Intracoastal"
    },
    "jupiter-inlet-colony": {
        population: "405",
        households: "240",
        landArea: "0.20 sq mi",
        commercialGrowth: "Gated luxury oceanfront residential municipality at the southern tip of Jupiter Island",
        geographyType: "Three-sided waterfront peninsula: Atlantic Ocean, Jupiter Inlet, and Intracoastal"
    },
    "lake-clarke-shores": {
        population: "3,564",
        households: "1,350",
        landArea: "1.00 sq mi",
        commercialGrowth: "Boating & waterskiing residential village, lakefront estates & civic parks",
        geographyType: "Inland freshwater municipality centered on Lake Clarke and connecting canals"
    },
    "palm-beach-gardens-west": {
        population: "14,500",
        households: "5,800",
        landArea: "22.00 sq mi",
        commercialGrowth: "Northlake Blvd luxury master-planned expansion (Alton, Artistry, Ibis, Bayhill Estates)",
        geographyType: "Western woodland frontier bordered by Loxahatchee Slough and Grassy Waters"
    },
    "westlake": {
        population: "6,500",
        households: "3,800",
        landArea: "6.50 sq mi",
        commercialGrowth: "Fastest-growing master-planned city in Palm Beach County (Minto), Adventure Park, ER campus",
        geographyType: "Western frontier between Loxahatchee and J.W. Corbett Wildlife Management Area"
    },
    "avenir": {
        population: "5,200",
        households: "2,200",
        landArea: "7.50 sq mi",
        commercialGrowth: "4,752-acre master development, 2,400-acre nature preserve, Town Center & Panther National golf",
        geographyType: "Northlake Boulevard conservation corridor bordering Corbett Wildlife Management Area"
    },
    "arden": {
        population: "4,800",
        households: "1,850",
        landArea: "1.90 sq mi",
        commercialGrowth: "Award-winning master-planned Agrihood, 5-acre working organic farm, 175-acre lake & trails",
        geographyType: "Western Southern Boulevard corridor bordering Loxahatchee National Wildlife Refuge"
    },
    "century-village": {
        population: "17,250",
        households: "10,800",
        landArea: "2.10 sq mi",
        commercialGrowth: "Landmark 55+ active-adult resort community, on-site medical clinics, transit & 92K sq ft clubhouse",
        geographyType: "Inland lake network along Okeechobee Boulevard and Haverhill Road"
    },
    "kings-point": {
        population: "15,200",
        households: "9,600",
        landArea: "1.80 sq mi",
        commercialGrowth: "Major active 55+ community, two 18-hole Robert Trent Jones golf courses & theater performance venue",
        geographyType: "Inland West Delray community located along Atlantic Avenue and Jog Road"
    },
    "golden-lakes": {
        population: "6,850",
        households: "4,200",
        landArea: "2.40 sq mi",
        commercialGrowth: "Active 55+ condominium village, lakefront recreational amenities & quick Turnpike access",
        geographyType: "Central suburban lake community along Okeechobee Boulevard west of the Turnpike"
    },
    "limestone-creek": {
        population: "1,320",
        households: "480",
        landArea: "0.40 sq mi",
        commercialGrowth: "Historic Jupiter neighborhood, community center, local sports fields & shaded residential streets",
        geographyType: "Northern Palm Beach County community along Church Street adjacent to Jupiter"
    },
    "pine-jog": {
        population: "3,100",
        households: "1,100",
        landArea: "1.20 sq mi",
        commercialGrowth: "FAU Pine Jog Environmental Education Center, ecological research & suburban residential",
        geographyType: "Central flatwoods preserve along Summit Boulevard and Jog Road"
    },
    "schall-circle": {
        population: "1,150",
        households: "360",
        landArea: "0.30 sq mi",
        commercialGrowth: "Commercial logistics, light manufacturing trades, warehouse storage & residential enclave",
        geographyType: "Inland commercial and residential pocket bordering Okeechobee Blvd and Military Trail"
    },
    "cabana-colony": {
        population: "2,450",
        households: "900",
        landArea: "0.50 sq mi",
        commercialGrowth: "Established residential community with direct proximity to PGA Blvd dining & Gardens Medical",
        geographyType: "Northern Palm Beach County suburban pocket bordered by Palm Beach Gardens"
    },
    "kenwood-estates": {
        population: "1,280",
        households: "440",
        landArea: "0.40 sq mi",
        commercialGrowth: "Suburban residential neighborhood bordering Lake Worth Road commercial amenities",
        geographyType: "Suburban enclave west of Congress Avenue and south of 10th Avenue North"
    },
    "san-castle": {
        population: "3,600",
        households: "1,050",
        landArea: "0.60 sq mi",
        commercialGrowth: "Community revitalization corridor, local retail trades & family residential enclaves",
        geographyType: "Central county corridor between Lantana Road and Hypoluxo Road west of I-95"
    },
    "gun-club-estates": {
        population: "1,020",
        households: "340",
        landArea: "0.30 sq mi",
        commercialGrowth: "Civic & governmental corridor, Palm Beach County Sheriff's complex & residential streets",
        geographyType: "Inland central pocket between Forest Hill Boulevard and Southern Boulevard"
    },
    "okeechobee-county": {
        population: "39,644",
        households: "14,200",
        landArea: "769.00 sq mi",
        commercialGrowth: "Agricultural beef cattle, citrus groves, Lake Okeechobee sportfishing & eco-tourism",
        geographyType: "Northern rim of Lake Okeechobee, Kissimmee Prairie flatwoods and lakefront marshes"
    },
    "st-lucie-county": {
        population: "348,500",
        households: "132,000",
        landArea: "572.00 sq mi",
        commercialGrowth: "Fastest-growing metro (Port St. Lucie), Tradition Innovation hub, aviation & marine port",
        geographyType: "Treasure Coast coastal plain, Indian River Lagoon & St. Lucie River estuaries"
    },
    "martin-county": {
        population: "161,600",
        households: "68,200",
        landArea: "543.00 sq mi",
        commercialGrowth: "Sailfish Capital of the World (Stuart), 4-story building cap, marine manufacturing & bio-tech",
        geographyType: "Treasure Coast inlet convergence, Hobe Sound barrier island & Jonathan Dickinson park"
    },
    "orange-county": {
        population: "1,429,908",
        households: "515,000",
        landArea: "907.00 sq mi",
        commercialGrowth: "Global tourism hub (75M+ visitors), Lake Nona Medical City, simulation tech & aerospace",
        geographyType: "Central Florida highland lake region with 100+ freshwater lakes"
    },
    "broward-county": {
        population: "1,947,026",
        households: "850,000",
        landArea: "1,210.00 sq mi",
        commercialGrowth: "Yachting Capital of the World, Las Olas Class-A office boom, Port Everglades & aviation",
        geographyType: "Venice of America canal network, coastal barrier beaches & western Everglades border"
    },
    "miami-dade-county": {
        population: "2,701,767",
        households: "1,060,000",
        landArea: "1,898.00 sq mi",
        commercialGrowth: "Brickell Wall Street South financial center, #1 cruise port (PortMiami), tech & international trade",
        geographyType: "Biscayne Bay coastal barrier islands, limestone ridge & Everglades National Park border"
    }
};

export function getFallbackStats(area: ServiceAreaItem): ServiceAreaStats {
    const coastalSlugs = new Set([
        "highland-beach", "hypoluxo", "manalapan", "ocean-ridge",
        "south-palm-beach", "palm-beach-shores", "gulf-stream",
        "briny-breezes", "jupiter-inlet-colony"
    ]);
    const westernSlugs = new Set([
        "loxahatchee", "the-acreage", "avenir", "arden",
        "palm-beach-gardens-west"
    ]);
    const golfClubSlugs = new Set([
        "atlantis", "golf", "century-village", "kings-point"
    ]);

    if (coastalSlugs.has(area.slug)) {
        return {
            population: "3,850 (Seasonal: 6,200+)",
            households: "2,150",
            landArea: "1.8 sq mi",
            commercialGrowth: "High-net-worth coastal residential enclaves, private yachting facilities & luxury estate preservation",
            geographyType: "Barrier Island Atlantic Shoreline & Intracoastal Coastline"
        };
    }

    if (westernSlugs.has(area.slug)) {
        return {
            population: "38,500",
            households: "12,800",
            landArea: "42.5 sq mi",
            commercialGrowth: "Rapid master-planned expansion, custom equestrian estate building & agrihood town centers",
            geographyType: "Western Acreage Estates, Agrihoods & Preserved Wetlands"
        };
    }

    if (golfClubSlugs.has(area.slug)) {
        return {
            population: "8,950",
            households: "5,400",
            landArea: "3.2 sq mi",
            commercialGrowth: "Private country club hospitality, specialty outpatient healthcare & luxury condominium renovation",
            geographyType: "Championship Golf Corridors & Active-Adult Communities"
        };
    }

    return {
        population: "14,200",
        households: "5,100",
        landArea: "4.6 sq mi",
        commercialGrowth: "Commercial transit logistics, professional trade services & medical corridor expansion",
        geographyType: "Suburban Residential & Commercial Transit Corridor"
    };
}

function joinWithConjunction(items: string[]): string {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function formatNeighborhoodsProse(areaName: string, neighborhoods: string[]): string {
    const distinct = neighborhoods.filter(
        (n) => n.trim().toLowerCase() !== areaName.trim().toLowerCase()
    );
    const coreItems: string[] = [];
    const nearbyPlaces: string[] = [];

    for (const raw of distinct) {
        const trimmed = raw.trim();
        const borderMatch = trimmed.match(/^(.*?)\s+border$/i);
        const nearMatch = trimmed.match(/^Near\s+(.+)$/i);
        if (borderMatch) {
            nearbyPlaces.push(borderMatch[1].trim());
        } else if (nearMatch) {
            nearbyPlaces.push(nearMatch[1].trim());
        } else if (/\barea$/i.test(trimmed) && !/^the\s+/i.test(trimmed)) {
            coreItems.push(`the ${trimmed}`);
        } else {
            coreItems.push(trimmed);
        }
    }

    if (coreItems.length === 0 && nearbyPlaces.length > 0) {
        return `surrounding streets near ${joinWithConjunction(nearbyPlaces)}`;
    }
    if (coreItems.length === 0) {
        return "surrounding residential streets";
    }
    if (nearbyPlaces.length > 0) {
        return `${joinWithConjunction(coreItems)} near ${joinWithConjunction(nearbyPlaces)}`;
    }
    return joinWithConjunction(coreItems);
}

export function getServiceAreaGuide(area: ServiceAreaItem): ServiceAreaGuide {
    const stats = SERVICE_AREA_STATS[area.slug] || getFallbackStats(area);
    const direct = SERVICE_AREA_GUIDES[area.slug];
    if (direct) {
        return {
            ...direct,
            stats: direct.stats || stats
        };
    }

    const coastalSlugs = new Set([
        "highland-beach", "hypoluxo", "manalapan", "ocean-ridge",
        "south-palm-beach", "palm-beach-shores", "gulf-stream",
        "briny-breezes", "jupiter-inlet-colony"
    ]);
    const westernSlugs = new Set([
        "loxahatchee", "the-acreage", "avenir", "arden",
        "palm-beach-gardens-west"
    ]);
    const golfClubSlugs = new Set([
        "atlantis", "golf", "century-village", "kings-point"
    ]);

    const neighborhoodProse = formatNeighborhoodsProse(area.name, area.neighborhoods);
    const cleanLandmarkTokens = area.neighborhoods.filter((n) => {
        const trimmed = n.trim();
        return (
            trimmed.toLowerCase() !== area.name.trim().toLowerCase() &&
            !/\bborder\b/i.test(trimmed) &&
            !/^Near\s+/i.test(trimmed) &&
            !/\barea\b/i.test(trimmed)
        );
    });
    const primaryNeighborhood = cleanLandmarkTokens[0] || area.name;
    const secondaryNeighborhood = cleanLandmarkTokens[1];
    const thirdNeighborhood = cleanLandmarkTokens[2];

    if (coastalSlugs.has(area.slug)) {
        const corridors = Array.from(new Set([
            "State Road A1A (Ocean Boulevard)",
            "Intracoastal Waterway",
            "US Highway 1 (Federal Hwy)",
            ...cleanLandmarkTokens.slice(0, 2)
        ]));
        return {
            localCopy: [
                `Along Palm Beach County's barrier island and Intracoastal coast, ${area.name} blends oceanfront estates, deepwater docks, and A1A residential enclaves across ${neighborhoodProse}.`,
                `Our bonded pros deliver salt-air-resilient estate housekeeping, rotation deep cleaning, and discreet rental turnovers for year-round and seasonal coastal homeowners.`
            ],
            landmarks: [
                { name: `${area.name} Oceanfront & A1A Scenic Corridor`, category: "Coastal Landmark", description: `Canopied coastal dunes, Atlantic shoreline, and oceanfront residences near ${primaryNeighborhood}.` },
                { name: `${primaryNeighborhood} Intracoastal Waterway Basin`, category: "Deepwater Yacht & Lagoon View", description: `Sheltered Lake Worth Lagoon waters with private docks and coastal wildlife.` },
                { name: `Historic Coastal Town Hall & Preserve Access`, category: "Civic & Conservation Icon", description: `Barrier-island civic center and shaded dune walkovers serving local residents.` },
                { name: `Nearby Inlet & Barrier Island Beach Parks`, category: "Recreation Landmark", description: `Direct shoreline access to nearby ocean inlets and coastal hammock preserves.` }
            ],
            thingsToDo: [
                { title: `Sunrise Cycling along State Road A1A`, spot: `${area.name} Ocean Boulevard`, description: `Scenic coastal road cycling and morning walks beside the Atlantic.` },
                { title: `Intracoastal Yachting & Sunset Cruises`, spot: `${secondaryNeighborhood ? `${secondaryNeighborhood} Waterway` : "Intracoastal Waterway"}`, description: `Boating and paddleboarding along calm lagoon waters toward waterfront dining.` },
                { title: `Sea Turtle Nesting & Coastal Dune Walks`, spot: `${area.name} Shoreline`, description: `Seasonal sea turtle nesting walks and clear nearshore reef snorkeling.` },
                { title: `Resort & Oceanfront Club Dining`, spot: `A1A & Neighboring Plaza Corridors`, description: `Coastal fine dining, resort terraces, and ocean-view lounges minutes away.` }
            ],
            keyCorridors: corridors,
            topIndustries: ["Marine & Yacht Management", "Custom Coastal Estate Building", "Private Wealth & Family Offices", "Concierge Healthcare & Wellness", "Luxury Interior & Landscape Design"],
            stats
        };
    }

    if (westernSlugs.has(area.slug)) {
        return {
            localCopy: [
                `Surrounded by wide acreage, preserved wetlands, and master-planned communities in western Palm Beach County, ${area.name} connects ${neighborhoodProse} with modern resort amenities and open space.`,
                `We provide post-construction dust extraction, estate detailing, and recurring residential care built to keep ${area.name} homes and local offices spotless.`
            ],
            landmarks: [
                { name: `${area.name} Town Center & Amenity Clubhouse`, category: "Community Hub", description: `Community clubhouse, resort pools, and gathering greens anchoring ${primaryNeighborhood}.` },
                { name: `Loxahatchee Slough & Corbett Conservation Trails`, category: "Eco-Preserve Landmark", description: `Preserved pine flatwoods, equestrian bridle trails, and quiet cypress wetlands.` },
                { name: `${secondaryNeighborhood || "Western Corridor"} Equestrian & Acreage Estates`, category: "Residential & Equestrian District", description: `Spacious acreage homesteads, private barns, and custom western estates.` },
                { name: `Western Corridor Community Park & Amphitheater`, category: "Recreation Complex", description: `Lighted sports fields, equestrian rings, and weekend community market grounds.` }
            ],
            thingsToDo: [
                { title: `Equestrian Trail Riding & Greenbelt Cycling`, spot: `${primaryNeighborhood} Trail Network`, description: `Dedicated community bridle paths, greenways, and scenic canal-bank trails.` },
                { title: `Farm-to-Table Markets & Barn Socials`, spot: `${area.name} Community Hub`, description: `Seasonal local produce markets, artisan booths, and evening community gatherings.` },
                { title: `Kayaking & Birding in Western Preserves`, spot: `${thirdNeighborhood || "Western Preserve"} Conservation Area`, description: `Spot sandhill cranes, ospreys, and native flora along quiet freshwater sloughs.` },
                { title: `Resort Pool & Racquet Club Weekends`, spot: `${area.name} Amenity Campus`, description: `Pickleball, tennis courts, fitness centers, and shaded poolside cabanas.` }
            ],
            keyCorridors: ["Southern Boulevard (SR 80)", "Northlake Boulevard", "Seminole Pratt Whitney Road", "Okeechobee Boulevard", "Lion Country / Western Trail Axis"],
            topIndustries: ["Custom Home, Pool & Barn Builders", "Solar, Well Water & Land Services", "Equestrian & Veterinary Care", "Family Medical & Orthodontics", "Landscape & Outdoor Living"],
            stats
        };
    }

    if (golfClubSlugs.has(area.slug)) {
        return {
            localCopy: [
                `Centered on championship fairways, freshwater lakes, and clubhouse amenities, ${area.name} links ${neighborhoodProse} with active-lifestyle living and nearby medical and professional hubs.`,
                `Our vetted crews deliver HEPA allergen vacuuming, recurring housekeeping, and move-in/move-out detailing tailored to ${area.name} club residences and clinics.`
            ],
            landmarks: [
                { name: `${area.name} Championship Golf & Country Club`, category: "Signature Golf Landmark", description: `Manicured fairways, pro shops, and clubhouse dining anchoring ${primaryNeighborhood}.` },
                { name: `${secondaryNeighborhood || "Lakeside"} Waterfront & Civic Park`, category: "Community Park", description: `Shaded walking loops, racquet courts, and lakeside community pavilions.` },
                { name: `Regional Medical & Professional Plaza`, category: "Healthcare & Commercial Hub", description: `Neighborhood medical practices, clinics, and financial offices serving ${area.name}.` },
                { name: `Performing Arts Clubhouse & Recreation Theatre`, category: "Cultural Venue", description: `Community theatre, live concerts, and social clubs for residents.` }
            ],
            thingsToDo: [
                { title: `Morning Tee Times & Golf Cart Cruising`, spot: `${primaryNeighborhood} Fairways`, description: `Year-round fairway rounds and golf-cart-friendly neighborhood routes.` },
                { title: `Pickleball, Tennis & Aquatics Club`, spot: `${area.name} Racquet Center`, description: `Active racquet leagues, heated lap pools, and neighborhood fitness classes.` },
                { title: `Clubhouse Fine Dining & Sunset Terraces`, spot: `${secondaryNeighborhood || "Clubhouse"} Overlook`, description: `Casual and fine dining overlooking landscaped greens and lake fountains.` },
                { title: `Lakeside Birding & Botanical Walks`, spot: `${thirdNeighborhood || "Community"} Greenway`, description: `Calm morning walks beneath royal palms and shaded banyan trees.` }
            ],
            keyCorridors: ["Congress Avenue", "Military Trail", "Jog Road", "Lantana Road", "Atlantic Avenue / Glades Axis"],
            topIndustries: ["Concierge Medicine & Ophthalmology", "Estate Planning & Wealth Management", "Luxury Kitchen, Bath & Impact Remodeling", "Private Country Club Hospitality", "Home Care & Physical Therapy"],
            stats
        };
    }

    const defaultCorridors = Array.from(new Set([
        "Military Trail",
        "Congress Avenue",
        "US Highway 1 / Dixie Highway",
        "Southern Boulevard",
        ...cleanLandmarkTokens.slice(0, 1)
    ]));

    return {
        localCopy: [
            `Situated along Palm Beach County's central residential and commercial corridors, ${area.name} connects ${neighborhoodProse} with convenient parks, clinics, and commuter arteries.`,
            `South Florida Cleaning Concepts supports ${area.name} offices, medical suites, and neighborhood homes with dependable janitorial care, EPA List N disinfection, and rotation cleaning.`
        ],
        landmarks: [
            { name: `${primaryNeighborhood} Community Center & Park`, category: "Neighborhood Landmark", description: `Shaded neighborhood park with walking paths and athletic courts for ${area.name}.` },
            { name: `${secondaryNeighborhood || "Neighborhood"} Commercial & Retail Corridor`, category: "Business Hub", description: `Convenient local shopping plazas, neighborhood cafés, and service offices.` },
            { name: `Nearby Palm Beach County Regional Preserve & Waterways`, category: "Natural & Recreation Landmark", description: `County greenways, nature centers, and bike trails near ${area.name}.` },
            { name: `${thirdNeighborhood || "Neighborhood"} Historic & Civic District`, category: "Community Enclave", description: `Established residential avenues and classic South Florida neighborhood character.` }
        ],
        thingsToDo: [
            { title: `Greenway Cycling & Morning Park Walks`, spot: `${primaryNeighborhood} Trails`, description: `Palm-lined walking paths linking local neighborhoods to county parks.` },
            { title: `Local Cafés & Family Dining`, spot: `${secondaryNeighborhood || "Neighborhood"} Plaza`, description: `Neighborhood bakeries, Latin and coastal kitchens, and weekend brunch spots.` },
            { title: `Golf, Tennis & Aquatic Recreation`, spot: `Adjacent County Regional Parks`, description: `Public golf courses, racquet centers, and aquatic parks minutes away.` },
            { title: `Weekend GreenMarkets & Cultural Outings`, spot: `Central Palm Beach Corridor`, description: `Easy access to waterfront markets, museums, and outdoor community concerts.` }
        ],
        keyCorridors: defaultCorridors,
        topIndustries: ["Home Services (Roofing, HVAC, Electrical)", "Family Healthcare & Dental", "Legal & Financial Services", "Automotive & Commercial Trades", "Real Estate & Property Management"],
        stats
    };
}

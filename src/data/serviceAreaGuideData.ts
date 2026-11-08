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

export interface ServiceAreaGuide {
    localCopy: string[];
    landmarks: ServiceAreaLandmark[];
    thingsToDo: ServiceAreaActivity[];
    keyCorridors: string[];
    topIndustries: string[];
}

export const SERVICE_AREA_GUIDES: Record<string, ServiceAreaGuide> = {
    "west-palm-beach": {
        localCopy: [
            "Standing on the western shore of the Lake Worth Lagoon, West Palm Beach has evolved from Henry Flagler's historic railway hub into South Florida's premier corporate, cultural, and lifestyle capital—often called 'Wall Street South.' From the gleaming Class-A office towers along Flagler Drive and Okeechobee Boulevard to the historic Mediterranean Revival avenues of El Cid, Flamingo Park, and Northwood Village, the city blends vibrant coastal living with institutional business power.",
            "Whether servicing Class-A financial suites along Flagler Drive, medical practices near Good Samaritan, or historic luxury residences in El Cid and Northwood, South Florida Cleaning Concepts delivers hospital-grade sanitization, EPA List N disinfection, and customized commercial janitorial solutions. Our bonded and insured cleaning specialists bring over 20 years of family-owned excellence, flexible night janitorial shifts, and our 100% satisfaction guarantee to West Palm Beach commercial facilities and luxury homes."
        ],
        landmarks: [
            { name: "The Square (CityPlace)", category: "Shopping & Dining District", description: "Open-air downtown destination anchored by the Wishing Tree, upscale restaurants, showrooms, and modern office towers." },
            { name: "Norton Museum of Art", category: "Cultural Landmark", description: "World-renowned museum with a Foster + Partners wing and sub-tropical sculpture gardens along South Dixie Highway." },
            { name: "Kravis Center for the Performing Arts", category: "Performing Arts", description: "Palm Beach County's premier cultural stage hosting Broadway tours, symphony performances, and corporate galas." },
            { name: "Clematis Street & Waterfront Commons", category: "Historic Downtown Core", description: "The historic heartbeat of West Palm Beach extending from Rosemary Avenue directly to the Intracoastal Centennial Square." }
        ],
        thingsToDo: [
            { title: "West Palm Beach GreenMarket & Clematis by Night", spot: "Great Lawn on Flagler Drive", description: "Rated the #1 Farmers Market in the U.S., drawing thousands of locals every Saturday morning alongside Thursday evening waterfront concerts." },
            { title: "Antique Row Art & Design Stroll", spot: "South Dixie Highway", description: "Over 40 curated 17th-to-20th-century antique showrooms, fine art galleries, and award-winning cafés." },
            { title: "Flagler Drive Waterfront Bike & Paddle Trail", spot: "Lake Worth Lagoon", description: "Scenic palm-lined promenade overlooking Palm Beach Island marinas and mega-yachts." },
            { title: "Manatee Lagoon & Cox Science Center", spot: "North Flagler & Dreher Park", description: "Waterfront eco-discovery center and planetarium/aquarium complex near the Palm Beach Zoo." }
        ],
        keyCorridors: ["Flagler Drive", "Okeechobee Boulevard", "Clematis Street", "US-1 / Dixie Highway", "Palm Beach Lakes Boulevard", "Southern Boulevard"],
        topIndustries: ["Private Wealth & Finance", "Trial Law & Legal Services", "Luxury Real Estate & Construction", "Concierge Healthcare & MedSpas", "Marine & Hospitality"]
    },
    "boca-raton": {
        localCopy: [
            "Defined by Addison Mizner's iconic Mediterranean Revival architecture, manicured boulevards, and a powerhouse corporate ecosystem anchored by the Park at Broken Sound and Florida Atlantic University, Boca Raton represents one of the wealthiest and most discerning consumer markets in the United States. From oceanfront estates along South Ocean Boulevard and Royal Palm Yacht & Country Club to gated country club enclaves along Glades and Yamato Roads, Boca Raton customers expect white-glove excellence from the first digital impression.",
            "From corporate headquarters in the Park at Broken Sound and medical suites along Glades and Yamato Roads to luxury estates in Royal Palm Yacht & Country Club and upscale retail in Mizner Park, South Florida Cleaning Concepts delivers white-glove commercial janitorial, recurring estate housekeeping, and terminal medical sanitization tailored to Boca Raton's discerning standards."
        ],
        landmarks: [
            { name: "Mizner Park Amphitheater & Plaza", category: "Cultural & Lifestyle Center", description: "Boca Raton's signature pink-stucco promenade featuring luxury boutiques, chef-driven dining, and the Boca Raton Museum of Art." },
            { name: "The Boca Raton (Historic Resort & Club)", category: "Historic Architectural Icon", description: "Addison Mizner's legendary 1926 waterfront resort on Lake Boca Raton and the Atlantic Ocean." },
            { name: "Town Center at Boca Raton", category: "Luxury Retail Hub", description: "One of South Florida's top luxury shopping destinations drawing affluent shoppers across Palm Beach and Broward counties." },
            { name: "Gumbo Limbo Nature Center & Red Reef Park", category: "Coastal Preserve", description: "20-acre barrier island sanctuary with boardwalks, sea turtle rehabilitation tanks, and snorkeling reefs." }
        ],
        thingsToDo: [
            { title: "Fine Dining & Gallery Nights at Mizner Park", spot: "Plaza Real Downtown Boca", description: "Evening concerts, contemporary exhibitions at the Boca Museum of Art, and al fresco dining." },
            { title: "Snorkeling & Beachfront Picnics at Red Reef Park", spot: "A1A / North Ocean Blvd", description: "Crystal-clear nearshore artificial reefs and oceanfront walking paths." },
            { title: "Boutique Shopping & Espresso at Royal Palm Place", spot: "SE Mizner Blvd", description: "Charming courtyards, monumental bronze sculptures, and artisanal bakeries." },
            { title: "Eco-Trails at Daggerwing Nature Center", spot: "West Boca Burt Aaronson Park", description: "Elevated boardwalks through cypress swamps, championship golf, and waterpark amenities." }
        ],
        keyCorridors: ["Glades Road", "Palmetto Park Road", "Yamato Road", "Federal Highway (US-1)", "A1A / Ocean Boulevard", "Military Trail"],
        topIndustries: ["Corporate Headquarters & SaaS", "Plastic Surgery & Aesthetic Medicine", "Wealth Management & Family Offices", "Private Aviation & Marine Charter", "Luxury Home Remodeling"]
    },
    "delray-beach": {
        localCopy: [
            "Celebrated nationally as 'America's Most Fun Small Town' and the 'Village by the Sea,' Delray Beach blends a booming pedestrian-friendly downtown with historic artist districts, boutique hospitality, and coastal luxury. Atlantic Avenue stretches from the I-95 corridor through the lively Pineapple Grove Arts District straight to the white sands of Delray Municipal Beach.",
            "From bustling restaurants and boutique hotels along Atlantic Avenue and art studios in Pineapple Grove to coastal residences in Lake Ida and short-term Airbnb properties near Delray Municipal Beach, South Florida Cleaning Concepts provides rapid same-day turnovers, commercial kitchen degreasing, and recurring residential maid service."
        ],
        landmarks: [
            { name: "Atlantic Avenue Downtown District", category: "Main Street Corridor", description: "Florida's longest pedestrian-friendly shopping, nightlife, and dining avenue stretching to the Atlantic Ocean." },
            { name: "Morikami Museum and Japanese Gardens", category: "Cultural & Botanical Landmark", description: "16 acres of authentic stroll gardens, bonsai collections, lakes, and Japanese cultural galleries in West Delray." },
            { name: "Pineapple Grove Arts District", category: "Creative Quarter", description: "Vibrant corridor north of Atlantic Ave known for murals, Artists Alley studios, and boutique salons." },
            { name: "Wakodahatchee Wetlands", category: "Eco-Landmark", description: "50-acre tropical wetland boardwalk famous for nesting wood storks, herons, and wildlife photography." }
        ],
        thingsToDo: [
            { title: "First Friday Art Walk & Pineapple Grove Stroll", spot: "NE 2nd Avenue & Artists Alley", description: "Monthly live music and open studio tours across downtown galleries." },
            { title: "Retro Arcade Gaming at Silverball Museum", spot: "NE 3rd Avenue", description: "Classic playable pinball and arcade machines steps from Atlantic Avenue." },
            { title: "Delray Beach Tennis Center Championships", spot: "West Atlantic Avenue", description: "Home to the ATP Delray Beach Open and premier clay/hardcourt tournaments." },
            { title: "Sunrise Paddleboarding & Cabana Rentals", spot: "Delray Municipal Beach (A1A)", description: "Blue Wave certified shoreline with sailboat rentals and oceanfront cafés." }
        ],
        keyCorridors: ["Atlantic Avenue", "Linton Boulevard", "Federal Highway (US-1)", "Congress Avenue", "Jog Road", "A1A / South Ocean Blvd"],
        topIndustries: ["Hospitality & Restaurant Groups", "Boutique Fitness & Wellness", "Custom Coastal Architecture", "Real Estate & Property Management", "Professional & Legal Services"]
    },
    "jupiter": {
        localCopy: [
            "Anchored by the iconic red-brick 1860 Jupiter Inlet Lighthouse where the Loxahatchee River meets the Atlantic Ocean, Jupiter is synonymous with world-class sportfishing, PGA golf legends, and luxury waterfront living. Communities like Abacoa, Admirals Cove, Bear's Club, and Jonathan's Landing foster an active, high-income population that values authentic local expertise.",
            "From corporate suites and biotech facilities in Abacoa Town Center to luxury waterfront estates in Admirals Cove, Jonathan's Landing, and along the Jupiter Inlet, South Florida Cleaning Concepts provides hospital-grade sanitization, post-construction detailing, and trusted recurring residential cleaning backed by our 100% satisfaction guarantee."
        ],
        landmarks: [
            { name: "Jupiter Inlet Lighthouse & Museum", category: "Historic Maritime Icon", description: "1860 landmark climbing 105 steps above the Loxahatchee River and Outstanding Natural Area." },
            { name: "Roger Dean Chevrolet Stadium & Abacoa", category: "Sports & Town Center", description: "Spring training home of the Miami Marlins and St. Louis Cardinals surrounded by restaurants and greenways." },
            { name: "Harbourside Place & Love Street", category: "Waterfront Dining & Marina", description: "Intracoastal amphitheater, yacht slips, and fresh-catch waterfront restaurants at Love Street." },
            { name: "Dubois Park & Blowing Rocks Preserve", category: "Coastal Landmark", description: "Pineapple House history, turquoise inlet lagoons, and the largest Anastasia limestone shoreline on the East Coast." }
        ],
        thingsToDo: [
            { title: "Clear-Bottom Kayaking on the Loxahatchee River", spot: "Riverbend Park & Jupiter Inlet", description: "Paddle beneath ancient cypress canopies or alongside manatees and sea turtles near the inlet." },
            { title: "Spring Training Baseball & Food Truck Fridays", spot: "Abacoa Town Center", description: "Major League spring training games and community concerts on the green." },
            { title: "Sunset Dining on the Jupiter Inlet", spot: "Love Street & U-Tiki District", description: "Dockside dining with direct views of the illuminated lighthouse." },
            { title: "Snorkeling the Cato's Bridge Sandbar", spot: "Intracoastal Waterway", description: "Crystal-clear outgoing tide snorkeling and family paddleboarding." }
        ],
        keyCorridors: ["Indiantown Road", "US-1 / Federal Highway", "Alternate A1A", "Donald Ross Road", "Military Trail", "Center Street"],
        topIndustries: ["Marine & Yacht Services", "Luxury Custom Home Builders", "Sports Medicine & Orthopedics", "Biotech & Life Sciences", "Private Club & Golf Hospitality"]
    },
    "palm-beach-gardens": {
        localCopy: [
            "Known worldwide as the golf capital of America and headquarters of the PGA of America, Palm Beach Gardens combines master-planned country club communities like PGA National, BallenIsles, Mirasol, and Frenchman's Creek with upscale shopping along the PGA Boulevard corridor.",
            "From corporate headquarters along PGA Boulevard and medical suites near Palm Beach Gardens Medical Center to private estates in PGA National, Mirasol, and the new master-planned communities of Avenir and Alton, South Florida Cleaning Concepts delivers customized office janitorial care, medical terminal cleaning, and luxury residential rotation maid services."
        ],
        landmarks: [
            { name: "PGA National Resort & Champion Course", category: "World Golf Landmark", description: "Home of the famed 'Bear Trap' and decades of PGA Tour championship history." },
            { name: "The Gardens Mall", category: "Luxury Retail Destination", description: "1.4-million-square-foot sunlit luxury shopping center anchored by flagship department stores and fine jewelers." },
            { name: "Downtown Palm Beach Gardens", category: "Open-Air Lifestyle District", description: "Waterfront dining, Whole Foods Market, interactive carousel, and weekend live music." },
            { name: "Sandhill Crane Golf Club & Loxahatchee Slough", category: "Nature & Recreation", description: "Nested beside thousands of acres of preserved wetlands and scenic nature trails." }
        ],
        thingsToDo: [
            { title: "Championship Golf & Spa Retreats", spot: "PGA National & Sandhill Crane", description: "Play world-class courses or unwind in mineral pools and resort spas." },
            { title: "Gardens GreenMarket on Sunday Mornings", spot: "City Hall Municipal Campus", description: "Year-round open-air market featuring local honey, orchids, fresh produce, and live acoustic music." },
            { title: "Al Fresco Chef Dining along PGA Boulevard", spot: "Downtown PBG & Mainstreet at Midtown", description: "Steakhouses, coastal seafood, and craft cocktail lounges." },
            { title: "Paddle & Hike the Loxahatchee Slough", spot: "PGA Blvd West Corridor", description: "Quiet pine flatwoods and cypress marshes ideal for birding and trail biking." }
        ],
        keyCorridors: ["PGA Boulevard", "Northlake Boulevard", "Military Trail", "Donald Ross Road", "Prosperity Farms Road", "I-95 & Turnpike"],
        topIndustries: ["Golf & Country Club Management", "Wealth Advisory & Private Banking", "Specialty Healthcare & Dentistry", "Luxury Interior Design", "Biotech & Aerospace"]
    },
    "wellington": {
        localCopy: [
            "Recognized globally as the Winter Equestrian Capital of the World, Wellington draws Olympic riders, polo patrons, and affluent families from across the globe to Wellington International and the National Polo Center each season, while maintaining one of Florida's top-rated year-round family communities.",
            "From luxury equestrian estates and seasonal trainer compounds in Palm Beach Point and Grand Prix Village to family residences in Olympia and medical offices along State Road 7, South Florida Cleaning Concepts provides specialized post-season turnover, recurring estate housekeeping, and commercial sanitization throughout Wellington."
        ],
        landmarks: [
            { name: "Wellington International Equestrian Venue", category: "Global Equestrian Landmark", description: "Host of the 13-week Winter Equestrian Festival (WEF) attracting competitors from over 40 nations." },
            { name: "National Polo Center (NPC)", category: "Polo Championship Grounds", description: "Premier American polo destination famous for Sunday Champagne Brunch on the U.S. Polo Assn. Field One." },
            { name: "The Mall at Wellington Green", category: "Regional Shopping Hub", description: "Two-level shopping, dining, and medical office hub along State Road 7 / US-441." },
            { name: "Wellington Environmental Preserve", category: "Eco-Park & Bridle Trails", description: "365-acre rainwater storage preserve with a 6-story observation tower and miles of equestrian trails." }
        ],
        thingsToDo: [
            { title: "Saturday Night Lights Grand Prix Show Jumping", spot: "Wellington International", description: "World-class show jumping under the lights with live music, carousel rides, and ringside dining." },
            { title: "Sunday Polo Match & Fieldside Tailgates", spot: "National Polo Center on South Shore Blvd", description: "High-goal polo matches from January through April." },
            { title: "Concerts & Food Trucks at Wellington Amphitheater", spot: "Civic Center Drive", description: "Weekly lakeside food truck rallies, tribute concerts, and family movie nights." },
            { title: "Horseback Riding & Birding at Peaceful Waters", spot: "Village Park & Environmental Preserve", description: "Elevated boardwalks and over 60 miles of interconnected community bridle paths." }
        ],
        keyCorridors: ["State Road 7 (US-441)", "Forest Hill Boulevard", "Southern Boulevard", "Lake Worth Road", "South Shore Boulevard", "Pierson Road"],
        topIndustries: ["Equestrian Real Estate & Veterinary", "Custom Barn & Estate Builders", "Pediatric & Family Healthcare", "Private Aviation (Wellington Aero Club)", "Landscape & Pool Architecture"]
    }
};

const ADDITIONAL_GUIDES: Record<string, ServiceAreaGuide> = {
    "boynton-beach": {
        localCopy: [
            "As Palm Beach County's third-largest city, Boynton Beach bridges active waterfront living at the Boynton Harbor Marina with booming residential and retail corridors stretching west to Canyon Town Center and Valencia master-planned communities.",
            "From medical complexes and retail plazas along Boynton Beach Boulevard and Congress Avenue to coastal condominiums near Boynton Harbor Marina and master-planned residences in Canyon and Valencia, South Florida Cleaning Concepts delivers tailored office janitorial, medical clinic disinfection, and dependable residential maid services."
        ],
        landmarks: [
            { name: "Boynton Harbor Marina & Inlet Park", category: "Waterfront & Boating Hub", description: "Direct Atlantic Ocean inlet access with scuba charters, jet ski rentals, and dockside dining." },
            { name: "Green Cay Nature Center & Wetlands", category: "Eco-Sanctuary", description: "1.5 miles of elevated cypress boardwalks over 100 acres of restored wetlands on Hagen Ranch Road." },
            { name: "Arthur R. Marshall Loxahatchee National Wildlife Refuge", category: "Everglades Gateway", description: "145,000-acre northern Everglades preserve with canoe trails, cypress swamp boardwalk, and observation tower." },
            { name: "Renaissance Commons & Town Square", category: "Commercial & Cultural Hub", description: "Bustling Congress Avenue shopping and dining district paired with the newly revitalized Downtown Town Square." }
        ],
        thingsToDo: [
            { title: "Dockside Dining & Dive Charters at the Marina", spot: "Two Georges & Banana Boat", description: "Fresh seafood on the Intracoastal steps from drift-fishing and reef diving boats." },
            { title: "Boardwalk Wildlife Viewing at Green Cay", spot: "Hagen Ranch Road", description: "Spot roseate spoonbills, alligators, and painted buntings along scenic boardwalks." },
            { title: "Family Discovery at Schoolhouse Children's Museum", spot: "East Ocean Avenue", description: "Hands-on Florida pioneer history housed in a restored 1913 historic schoolhouse." },
            { title: "Sunset Concerts at Centennial Park Amphitheater", spot: "Downtown Boynton Beach", description: "Monthly Night Market, food trucks, and family festivals." }
        ],
        keyCorridors: ["Boynton Beach Boulevard", "Congress Avenue", "Federal Highway (US-1)", "Woolbright Road", "Jog Road", "Lyons Road"],
        topIndustries: ["Home Services & HVAC/Roofing", "Marine & Charter Recreation", "Senior & Active Adult Healthcare", "Retail & Restaurant Groups", "Medical & Dental Practices"]
    },
    "lake-worth-beach": {
        localCopy: [
            "Known for its vibrant historic cottages, thriving LGBTQ+ and artistic community, and walkable downtown along Lake Avenue and Lucerne Avenue, Lake Worth Beach brings authentic bohemian character to the Palm Beach coast.",
            "From creative studios and dining establishments along Lake and Lucerne Avenues to historic coastal cottages and residential properties near the Lake Worth Casino and Intracoastal, South Florida Cleaning Concepts provides dependable commercial janitorial care, Airbnb turnover cleaning, and deep residential rotation scrubbing."
        ],
        landmarks: [
            { name: "Lake Worth Beach Casino Building & Municipal Pier", category: "Oceanfront Landmark", description: "1920s Mediterranean Revival beachfront complex and fishing pier overlooking the Atlantic." },
            { name: "Benzaiten Center for Creative Arts", category: "Historic Arts Facility", description: "Housed in a historic 1924 FEC train depot featuring live glassblowing, bronze casting, and fine art galleries." },
            { name: "Lake Worth Playhouse", category: "Historic Theater", description: "1924 Oakley Theatre — the oldest building on the Art Deco register in Palm Beach County." },
            { name: "Snook Islands Natural Area", category: "Lagoon Boardwalk & Kayak Pier", description: "100-acre estuarine restoration along the Lake Worth Lagoon with fishing piers and kayak launches." }
        ],
        thingsToDo: [
            { title: "Annual Street Painting Festival & Gallery Walks", spot: "Lake Avenue & Lucerne Avenue", description: "Over 600 artists transform downtown asphalt into museum-grade chalk masterpieces each February." },
            { title: "Live Glassblowing Demos at Benzaiten Center", spot: "South F Street Historic Depot", description: "Watch master glassblowers or take hands-on weekend workshops." },
            { title: "Oceanfront Dining at Benny's on the Beach", spot: "Lake Worth Pier", description: "Iconic pier-top brunch and seafood boil overlooking surfers and sunrise waves." },
            { title: "Kayaking the Snook Islands Mangrove Trails", spot: "North Golfview Road", description: "Paddle alongside manatees and oyster reefs at Bryant Park." }
        ],
        keyCorridors: ["Lake Avenue", "Lucerne Avenue", "Dixie Highway", "Federal Highway", "Lake Worth Road", "10th Avenue North"],
        topIndustries: ["Creative Arts & Design Studios", "Craft Hospitality & Breweries", "Historic Home Restoration", "Specialty Retail & Boutiques", "Marine & Eco-Tourism"]
    },
    "palm-beach": {
        localCopy: [
            "The Town of Palm Beach is the crown jewel of American resort heritage—an exclusive 16-mile barrier island where Worth Avenue couture, Henry Flagler's Whitehall estate, and landmarked Mediterranean Revival mansions set the global standard for luxury.",
            "Serving ultra-luxury estates, family offices along Worth Avenue and Royal Poinciana Way, and private residences across Palm Beach Island, South Florida Cleaning Concepts delivers white-glove, discreet estate housekeeping, chandelier & marble detailing, and custom post-renovation cleaning."
        ],
        landmarks: [
            { name: "Worth Avenue & Historic Vias", category: "Global Luxury Shopping", description: "Iconic palm-lined avenue and romantic cobblestone vias housing haute couture, fine art, and bistros." },
            { name: "Henry Morrison Flagler Museum (Whitehall)", category: "National Historic Landmark", description: "75-room Gilded Age Beaux-Arts estate overlooking the Lake Worth Lagoon." },
            { name: "The Breakers Palm Beach", category: "Legendary Oceanfront Resort", description: "Italian Renaissance oceanfront palace founded in 1896." },
            { name: "The Royal Poinciana Plaza & Society of the Four Arts", category: "Cultural & Lifestyle Enclave", description: "Regency-style garden courtyards, botanical sculpture gardens, and fine dining." }
        ],
        thingsToDo: [
            { title: "Cycling or Strolling the Palm Beach Lake Trail", spot: "Intracoastal Waterway", description: "5.5-mile path past historic kapok trees, private docks, and Gilded Age estates." },
            { title: "Afternoon Tea in the Railcar Pavilion", spot: "Flagler Museum", description: "Gilded Age tea service beside Henry Flagler's private Railcar No. 91." },
            { title: "Via Courtyard Shopping & Dining on Worth Avenue", spot: "Via Mizner & Via Parigi", description: "Bougainvillea-draped courtyards with world-class galleries and Italian trattorias." },
            { title: "Botanical Strolls at Pan's Garden & Four Arts", spot: "Four Arts Plaza", description: "All-native Florida botanical garden and classical concert series." }
        ],
        keyCorridors: ["Worth Avenue", "Royal Poinciana Way", "South County Road", "North Ocean Boulevard (A1A)", "Cocoanut Row", "Bradley Place"],
        topIndustries: ["Family Offices & Private Banking", "Fine Art & Luxury Retail", "Estate Management & Security", "Ultra-Luxury Real Estate", "Concierge Medicine & Aviation"]
    },
    "royal-palm-beach": {
        localCopy: [
            "Centered around the 160-acre Royal Palm Beach Commons Park and the bustling Southern Boulevard and State Road 7 retail corridors, Royal Palm Beach is one of western Palm Beach County's most family-oriented and park-rich municipalities.",
            "From commercial offices and retail centers along Southern Boulevard and State Road 7 to family homes in Madison Green and Counterpoint Estates, South Florida Cleaning Concepts provides reliable office cleaning, pediatric and dental office sanitization, and recurring residential cleaning."
        ],
        landmarks: [
            { name: "Royal Palm Beach Commons Park", category: "Signature Community Park", description: "160-acre waterfront park featuring a wedding pavilion, splash pad, sporting complex, and amphitheater." },
            { name: "Veterans Park & Amphitheater", category: "Civic Landmark", description: "Memorial plaza hosting weekend green markets and community celebrations." },
            { name: "Royal Palm Beach Pines Natural Area", category: "Nature Preserve", description: "145-acre mesic flatwoods and wetland basin with wildlife observation platforms." },
            { name: "Southern Blvd & SR-7 Commercial Hub", category: "Retail Corridor", description: "Major western Palm Beach County shopping, healthcare, and dining crossroads." }
        ],
        thingsToDo: [
            { title: "Kayaking & Picnics at Commons Park", spot: "Royal Palm Beach Blvd", description: "3 miles of paved lakeside trails, volleyball courts, and kayak launches." },
            { title: "Green Market & Bazaar at Village Hall", spot: "Commons Park Lakeside", description: "Saturday lakeside market with artisan foods, plants, and fresh bakery goods." },
            { title: "Championship Golf at Madison Green", spot: "Crestwood Boulevard", description: "John Sanford-designed par-72 championship course woven through nature preserves." },
            { title: "Birding at Royal Palm Beach Pines", spot: "40th Street North", description: "Peaceful walking trails observing sandhill cranes and woodpeckers." }
        ],
        keyCorridors: ["Southern Boulevard", "Okeechobee Boulevard", "Royal Palm Beach Boulevard", "Crestwood Boulevard", "State Road 7 (US-441)"],
        topIndustries: ["Family Dental & Medical", "Roofing, Solar & Impact Windows", "Youth Sports & Education", "Veterinary & Pet Care", "Local Dining & Retail"]
    },
    "north-palm-beach": {
        localCopy: [
            "Designed as a premier boating and golf village where nearly half the homes sit along deepwater canals or the Intracoastal Waterway, North Palm Beach is the gateway to John D. MacArthur Beach State Park and the Jack Nicklaus Signature North Palm Beach Country Club.",
            "From marine offices and commercial plazas along US-1 and Northlake Boulevard to waterfront homes overlooking the Intracoastal and North Palm Beach Country Club, South Florida Cleaning Concepts delivers customized commercial janitorial care, move-in/move-out deep scrubs, and recurring coastal home maintenance."
        ],
        landmarks: [
            { name: "John D. MacArthur Beach State Park", category: "Barrier Island State Park", description: "Palm Beach County's only state park featuring a 1,600-foot estuary boardwalk and two miles of pristine beach." },
            { name: "North Palm Beach Country Club", category: "Municipal Nicklaus Golf & Club", description: "Jack Nicklaus Signature links-style course, Olympic pool, and Farmer's Table clubhouse." },
            { name: "Old Port Cove & Safe Harbor Marina", category: "Deepwater Yacht Basin", description: "Protected mega-yacht basin and waterfront promenade along US-1." },
            { name: "Anchorage Park & Marina", category: "Boating & Recreation Park", description: "Boat ramps, dry storage, kayak launch, and lighted tennis courts on the Intracoastal." }
        ],
        thingsToDo: [
            { title: "Kayak Munyon Island at MacArthur Beach", spot: "A1A / Jack Nicklaus Drive", description: "Paddle across the Lake Worth Lagoon estuary to historic Munyon Island." },
            { title: "Golf & Sunset Dining at the Country Club", spot: "US Highway 1", description: "Play undulating dunes and dine overlooking the 18th green." },
            { title: "Intracoastal Cruising to Peanut Island", spot: "Anchorage Park Boat Ramp", description: "Minutes by boat to the Lake Worth Inlet and Peanut Island sandbars." },
            { title: "Waterfront Dining along Crystal Cove Commons", spot: "US-1 Corridor", description: "Upscale coastal seafood, wine bars, and specialty boutiques." }
        ],
        keyCorridors: ["US Highway 1", "PGA Boulevard", "Northlake Boulevard", "Prosperity Farms Road", "Lighthouse Drive", "A1A / Ocean Blvd"],
        topIndustries: ["Yacht Brokerage & Marine Dock Building", "Wealth & Accounting Firms", "Custom Waterfront Construction", "Concierge Medicine", "Boutique Fitness & Golf"]
    },
    "riviera-beach": {
        localCopy: [
            "Home to the Port of Palm Beach, Singer Island's resort coastline, and the world-famous Blue Heron Bridge diving site at Phil Foster Park, Riviera Beach powers both international maritime logistics and luxury oceanfront tourism.",
            "From maritime logistics facilities, warehouses, and industrial complexes along Broadway and Blue Heron Boulevard to luxury oceanfront resort condominiums on Singer Island, South Florida Cleaning Concepts delivers heavy-duty commercial cleaning, day porter services, and vacation rental turnovers."
        ],
        landmarks: [
            { name: "Phil Foster Park & Underwater Snorkel Trail", category: "World-Renowned Dive Site", description: "800-foot artificial reef trail under the Blue Heron Bridge voted among the best shore dives in the world." },
            { name: "Peanut Island Park", category: "Historic Lagoon Island", description: "80-acre tropical island at the Lake Worth Inlet featuring snorkeling lagoons and the historic JFK Bunker site." },
            { name: "Port of Palm Beach & Riviera Beach Marina Village", category: "Maritime & Cruise Hub", description: "Fourth-busiest container port in Florida alongside the $30M waterfront Marina Event Center." },
            { name: "Singer Island Ocean Beach & Ocean Reef Park", category: "Coastal Resort Strip", description: "Seven miles of white-sand beaches, luxury oceanfront resorts, and dune boardwalks." }
        ],
        thingsToDo: [
            { title: "Shore Diving the Blue Heron Bridge Trail", spot: "Phil Foster Park", description: "Spot octopuses, seahorses, stingrays, and underwater sculptures at slack high tide." },
            { title: "Water Taxi & Snorkeling at Peanut Island", spot: "Riviera Beach Marina", description: "Ride the shuttle boat to crystal-clear snorkeling lagoons and picnic tiki huts." },
            { title: "parasailing & Paddleboarding at Sailfish Marina", spot: "Singer Island", description: "Famous Thursday Sunset Celebration art walk, water taxi, and offshore sportfishing charters." },
            { title: "Waterfront Splash Pad at Barracuda Bay", spot: "West Blue Heron Blvd", description: "Family aquatic complex with interactive water slides and lap pools." }
        ],
        keyCorridors: ["Blue Heron Boulevard", "Broadway (US-1)", "North Ocean Drive (Singer Island)", "Military Trail", "MLK Jr. Boulevard", "Australian Avenue"],
        topIndustries: ["Maritime Logistics & Freight", "Commercial Marine & Ship Repair", "Oceanfront Hospitality & Condos", "Industrial Manufacturing", "Dive & Charter Tourism"]
    },
    "broward-county": {
        localCopy: [
            "Stretching from Hillsboro Inlet and Pompano Beach through Fort Lauderdale's Las Olas Boulevard to Hollywood Beach and Weston, Broward County is a $150B+ metropolitan powerhouse known as the 'Yachting Capital of the World.'",
            "Serving Fort Lauderdale's downtown financial towers, Las Olas retail and hospitality, corporate campuses in Coral Springs and Pembroke Pines, and coastal luxury estates, South Florida Cleaning Concepts delivers commercial janitorial, terminal healthcare sanitization, same-day short-term rental turnovers, and post-construction cleanup across Broward County."
        ],
        landmarks: [
            { name: "Las Olas Boulevard & Riverwalk Fort Lauderdale", category: "Downtown Cultural & Dining Axis", description: "Waterfront arts district, luxury boutiques, galleries, and New River mega-yacht docks." },
            { name: "Fort Lauderdale Beach & Bonnet House Museum", category: "Historic Coastal Estate", description: "Iconic wave-wall beachfront promenade and 1920s 35-acre barrier island estate." },
            { name: "Hollywood Beach Broadwalk", category: "Oceanfront Promenade", description: "2.5-mile brick-paved beachfront promenade lined with cafés, bandshell concerts, and resorts." },
            { name: "Sawgrass Mills & Flamingo Gardens", category: "Retail & Botanical Landmark", description: "One of the largest outlet and luxury retail destinations in the U.S. alongside a 60-acre historic botanical sanctuary." }
        ],
        thingsToDo: [
            { title: "Water Taxi Cruise along the Venice of America", spot: "New River & Intracoastal", description: "Explore 300 miles of inland waterways, Millionaire's Row, and waterfront restaurants." },
            { title: "Airboat Eco-Tours at Everglades Holiday Park", spot: "West Broward / Griffin Road", description: "Glide across the River of Grass in the western Everglades ecosystem." },
            { title: "Art & Theatre at Broward Center for Performing Arts", spot: "Riverwalk Arts & Entertainment District", description: "Waterfront Broadway productions, NSU Art Museum, and jazz festivals." },
            { title: "Cycling the Hollywood Beach Broadwalk & Dania Pier", spot: "A1A Coastal Corridor", description: "Oceanfront biking, pier fishing, and beachfront dining." }
        ],
        keyCorridors: ["Las Olas Boulevard", "Federal Highway (US-1)", "I-95 & I-595", "Sunrise Boulevard", "Broward Boulevard", "University Drive"],
        topIndustries: ["Global Marine & Superyacht Industry", "Aviation, Logistics & Port Everglades", "Enterprise Tech & FinTech", "Medical Centers & Cosmetic Surgery", "Luxury Real Estate & Hospitality"]
    },
    "miami-dade-county": {
        localCopy: [
            "As the economic and cultural gateway between North America, Latin America, and Europe, Miami-Dade County commands global visibility across Brickell's financial skyscrapers, Wynwood's creative studios, Coral Gables' Mediterranean avenues, and Miami Beach's Art Deco shoreline.",
            "From Brickell's financial high-rises and Downtown Miami commercial towers to luxury condominiums in Miami Beach, corporate centers in Doral, and estates in Coral Gables and Key Biscayne, South Florida Cleaning Concepts delivers high-volume commercial janitorial, hospitality deep cleaning, and white-glove residential maid services across Miami-Dade County."
        ],
        landmarks: [
            { name: "Vizcaya Museum and Gardens", category: "National Historic Landmark", description: "1916 Italian Renaissance-style villa and formal waterfront gardens on Biscayne Bay in Coconut Grove." },
            { name: "Brickell City Centre & Miami Financial District", category: "Global Finance & Luxury Hub", description: "Architectural icon beneath the Climate Ribbon surrounded by international banks and rooftop dining." },
            { name: "Wynwood Walls & Miami Design District", category: "Global Art & Couture Quarter", description: "Open-air street art museum alongside flagship luxury fashion houses and contemporary museums." },
            { name: "Art Deco Historic District & Pérez Art Museum (PAMM)", category: "Architectural & Cultural Icons", description: "Ocean Drive pastel Art Deco masterpieces and Herzog & de Meuron's bayfront contemporary art museum." }
        ],
        thingsToDo: [
            { title: "Gallery Hopping in Wynwood & Design District", spot: "NW 2nd Ave & NE 40th Street", description: "World-renowned murals, Michelin-starred restaurants, and contemporary art installations." },
            { title: "Bayfront Strolls at Maurice A. Ferré Park", spot: "Biscayne Boulevard", description: "Visit PAMM and the Phillip and Patricia Frost Museum of Science planetarium and aquarium." },
            { title: "Historic Swim at the Venetian Pool & Miracle Mile", spot: "Coral Gables", description: "1924 coral rock spring-fed lagoon pool and Mediterranean shopping promenade." },
            { title: "Cape Florida Lighthouse & Key Biscayne Cycling", spot: "Bill Baggs Cape Florida State Park", description: "Climb South Florida's oldest standing structure (1825) overlooking Stiltsville and Biscayne Bay." }
        ],
        keyCorridors: ["Brickell Avenue", "Biscayne Boulevard (US-1)", "Calle Ocho (SW 8th St)", "Collins Avenue (A1A)", "Miracle Mile", "Palmetto Expressway (SR 826)"],
        topIndustries: ["International Banking & Crypto/FinTech", "Luxury Real Estate & Architecture", "Global Trade, Aviation & Cruise Lines", "Hospitality, Nightlife & Michelin Dining", "Multi-Lingual Legal & Medical Practices"]
    },
    "martin-county": {
        localCopy: [
            "Renowned as the 'Sailfish Capital of the World' and prized for its strict four-story building height limits and preserved natural coastline, Martin County encompasses historic Downtown Stuart, Hutchinson Island, Palm City, Hobe Sound, and Jupiter Island.",
            "From Downtown Stuart medical and legal offices to marine facilities along Kanner Highway, Jupiter Island, and Hobe Sound private luxury estates, South Florida Cleaning Concepts provides trusted commercial janitorial, estate caretaker cleaning, and post-construction cleanup across the Martin County corridor."
        ],
        landmarks: [
            { name: "Historic Downtown Stuart & Riverwalk Stage", category: "Waterfront Main Street", description: "Voted America's Happiest Seaside Town with boardwalks along the St. Lucie River." },
            { name: "Elliott Museum & House of Refuge at Gilbert's Bar", category: "Historic Barrier Island Icons", description: "1876 shipwreck life-saving station — the oldest surviving structure in Martin County — on Hutchinson Island." },
            { name: "Jonathan Dickinson State Park & Hobe Mountain", category: "Wild & Scenic Loxahatchee River", description: "11,500-acre preserve home to the historic Trapper Nelson camp and coastal sand pine scrub." },
            { name: "Banyan Street & Bridge Road Canopy", category: "Natural Heritage Corridors", description: "Famous ficus and banyan tree tunnels in Hobe Sound and Downtown Stuart." }
        ],
        thingsToDo: [
            { title: "Sunday Rock'n Riverwalk Concerts", spot: "Stuart Riverwalk Stage", description: "Free live music over the St. Lucie River beside Osceola Street cafés." },
            { title: "Boat Tour to Trapper Nelson's Zoo Camp", spot: "Jonathan Dickinson State Park", description: "Cruise or kayak up the Wild and Scenic Loxahatchee River." },
            { title: "Florida Oceanographic Coastal Center", spot: "Hutchinson Island", description: "57-acre marine nature center with stingray touch tanks and gamefish lagoon." },
            { title: "Offshore Sailfish Charter Fishing", spot: "St. Lucie Inlet & Pirate's Cove", description: "World-class billfishing minutes from where the Gulf Stream nears the coast." }
        ],
        keyCorridors: ["US Highway 1 (Federal Hwy)", "Monterey Road", "Kanner Highway (SR 76)", "SE Ocean Boulevard", "Bridge Road (Hobe Sound)", "Martin Downs Boulevard"],
        topIndustries: ["Custom Sportfishing Yachts & Marine", "Luxury Estate Management (Jupiter Island)", "Coastal Construction & Roofing", "Healthcare & Cleveland Clinic Providers", "Eco-Tourism & Hospitality"]
    },
    "st-lucie-county": {
        localCopy: [
            "Spanning fast-growing Port St. Lucie, Tradition's master-planned town center, and Historic Downtown Fort Pierce along the Indian River Lagoon, St. Lucie County is one of the fastest-expanding residential and logistics markets in Florida.",
            "From healthcare networks and research campuses in Tradition to commercial centers in St. Lucie West and coastal properties in Fort Pierce, South Florida Cleaning Concepts delivers hospital-grade medical cleaning, corporate office janitorial services, and residential move-in/move-out detailing across St. Lucie County."
        ],
        landmarks: [
            { name: "Clover Park & St. Lucie West", category: "Sports & Entertainment Hub", description: "Spring training home of the New York Mets and Minor League St. Lucie Mets." },
            { name: "National Navy UDT-SEAL Museum", category: "National Military Landmark", description: "Located on North Hutchinson Island on the original WWII Frogmen training grounds." },
            { name: "Tradition Square & Town Center", category: "Master-Planned Lifestyle Hub", description: "Lakeside town square featuring autonomous shuttles, public art, and regional medical centers." },
            { name: "Historic Sunrise Theatre & Fort Pierce Inlet State Park", category: "Cultural & Coastal Icons", description: "1923 Vaudeville theater near the Downtown Fort Pierce Farmers Market and turquoise inlet beaches." }
        ],
        thingsToDo: [
            { title: "Saturday Fort Pierce Downtown Farmers Market", spot: "Melody Lane Waterfront", description: "Over 70 vendors along the Indian River Lagoon beside the City Marina." },
            { title: "Botanical Strolls & Riverwalk at PSL Botanical Gardens", spot: "Westmoreland Boulevard", description: "21 acres of bamboo gardens, orchid rooms, and boardwalks on the North Fork St. Lucie River." },
            { title: "Horseback Riding on the Beach at Frederick Douglass Park", spot: "South Hutchinson Island", description: "One of the only beaches in Florida offering guided oceanfront horseback rides." },
            { title: "Manatee Observation & Smithsonian Marine Station", spot: "Seaway Drive, Fort Pierce", description: "Watch winter manatees at Moore's Creek and explore Indian River Lagoon reef aquariums." }
        ],
        keyCorridors: ["Port St. Lucie Boulevard", "Tradition Parkway", "Gatlin Boulevard", "St. Lucie West Boulevard", "US-1", "Okeechobee Road"],
        topIndustries: ["Residential Construction & Trades", "Healthcare & Hospital Networks", "Distribution & Logistics", "Marine & Charter Fishing", "Family Retail & Professional Services"]
    },
    "orange-county": {
        localCopy: [
            "Anchored by Downtown Orlando around Lake Eola, Winter Park's tree-lined Park Avenue, Lake Nona's Medical City, and the global tourism corridor along International Drive, Orange County is Central Florida's high-growth technology, healthcare, and hospitality engine.",
            "From corporate office towers in Downtown Orlando and medical research centers in Lake Nona to vacation rental portfolios near the attractions corridor and residences in Winter Park, South Florida Cleaning Concepts provides commercial janitorial, terminal healthcare disinfection, and high-throughput rental turnover cleaning across Orange County."
        ],
        landmarks: [
            { name: "Lake Eola Park & Walt Disney Amphitheater", category: "Downtown Orlando Icon", description: "Signature swan boats, illuminated fountain, and Sunday farmers market in the heart of the CBD." },
            { name: "Park Avenue & Rollins College (Winter Park)", category: "Historic Luxury & Cultural Avenue", description: "Cobblestone streets, Charles Hosmer Morse Museum of American Art, and Scenic Boat Tour canals." },
            { name: "Dr. Phillips Center for the Performing Arts", category: "Arts & Cultural Landmark", description: "World-class Steinmetz Hall and Broadway theater complex in Downtown Orlando." },
            { name: "Lake Nona Town Center & Medical City", category: "Innovation & Biotech Hub", description: "Smart-city campus housing research hospitals, USTA National Campus, and Boxi Park." }
        ],
        thingsToDo: [
            { title: "Winter Park Scenic Boat Tour through Chain of Lakes", spot: "East Morse Boulevard", description: "18-passenger pontoon cruise through historic Venetian canals and lakeside estates." },
            { title: "Botanical Walks at Harry P. Leu Gardens", spot: "North Forest Avenue", description: "50-acre landscaped grounds featuring 200-year-old live oaks and tropical camellias." },
            { title: "Michelin-Recognized Dining in Mills 50 & Restaurant Row", spot: "Sand Lake Road & Thornton Park", description: "Award-winning culinary corridors serving global cuisine." },
            { title: "Outdoor Music & Container Dining at Boxi Park", spot: "Lake Nona", description: "Open-air entertainment venue built from repurposed shipping containers." }
        ],
        keyCorridors: ["Orange Avenue", "Colonial Drive (SR 50)", "Sand Lake Road", "Park Avenue", "International Drive", "I-4 & SR 408"],
        topIndustries: ["Simulation, Defense & SaaS Tech", "Biotech & Healthcare (Lake Nona)", "Hospitality & Convention Services", "Commercial & Luxury Real Estate", "Legal & Financial Advisory"]
    },
    "okeechobee-county": {
        localCopy: [
            "Positioned at the northern rim of Lake Okeechobee—the largest freshwater lake in Florida and 'Speckled Perch and Bass Capital of the World'—Okeechobee County is the agricultural, ranching, and inland logistics crossroads linking South and Central Florida.",
            "From agricultural headquarters, industrial operations, and medical clinics along US-441 and SR-70 to lakeside commercial facilities, South Florida Cleaning Concepts delivers dependable commercial janitorial, heavy-duty quarry tile and concrete floor maintenance, and routine office janitorial."
        ],
        landmarks: [
            { name: "Lake Okeechobee Scenic Trail (LOST) & Lock 7", category: "Freshwater & Eco Landmark", description: "110-mile paved trail atop the Herbert Hoover Dike overlooking Florida's 730-square-mile inland sea." },
            { name: "Flagler Park in Historic Downtown Okeechobee", category: "Civic Main Street Park", description: "Shaded park blocks spanning Park Street with historical monuments and festival grounds." },
            { name: "Okeechobee Battlefield Historic State Park", category: "Historic Heritage Site", description: "Preserves the 1837 Seminole War battlefield and hosts annual historical reenactments." },
            { name: "Kissimmee Prairie Preserve State Park", category: "International Dark Sky Park", description: "54,000-acre dry prairie north of Okeechobee recognized for unmatched stargazing." }
        ],
        thingsToDo: [
            { title: "Trophy Largemouth Bass & Crappie Fishing", spot: "Scott Driver Park & Garrard's Bait & Tackle", description: "Guided bass boat and airboat trips across Lake Okeechobee's grass beds." },
            { title: "Speckled Perch Festival & Rodeo Weekend", spot: "Flagler Park & Cattlemen's Arena", description: "Okeechobee's longest-running heritage parade, fish fry, and PRCA rodeo." },
            { title: "Cycling the Lake Okeechobee Scenic Trail", spot: "Clifford E. 'Sonny' Williamson Park", description: "Panoramic lake views and eagle/osprey sightings from the dike trail." },
            { title: "Stargazing at Kissimmee Prairie Preserve", spot: "NW 40th Avenue", description: "Florida's first International Dark Sky Park with endangered grasshopper sparrows." }
        ],
        keyCorridors: ["US Highway 441 / Parrott Avenue", "State Road 70 (Park Street)", "State Road 78", "US Highway 98", "SW 16th Avenue"],
        topIndustries: ["Agribusiness, Dairy & Cattle Ranching", "Freshwater Marine & Bass Guides", "Heavy Equipment & Diesel Logistics", "Roofing, Fencing & Land Clearing", "Regional Healthcare & Retail"]
    }
};

Object.assign(SERVICE_AREA_GUIDES, ADDITIONAL_GUIDES);

const COMMUNITY_AND_COASTAL_GUIDES: Record<string, ServiceAreaGuide> = {
    "greenacres": {
        localCopy: [
            "Strategically positioned in central Palm Beach County along Jog Road, Lake Worth Road, and Forest Hill Boulevard, Greenacres is a thriving, family-focused municipality home to Samuel J. Ferreri Community Park and minutes from Okeeheelee Park.",
            "From medical clinics and professional plazas along Jog Road and Lake Worth Road to residential neighborhoods across Greenacres, South Florida Cleaning Concepts provides reliable office janitorial, bilingual customer support, and thorough residential rotation deep cleaning."
        ],
        landmarks: [
            { name: "Samuel J. Ferreri Community Park", category: "Civic & Festival Park", description: "Central Greenacres park hosting Fiesta de Pueblo, Holiday in the Park, and youth athletics." },
            { name: "Okeeheelee Park & Nature Center", category: "Regional Recreation Hub", description: "1,700-acre park just west of Greenacres with championship golf, BMX track, waterski lakes, and nature trails." },
            { name: "Greenacres Freedom Park", category: "Sports & Community Complex", description: "Lighted athletic fields, lakeside walking paths, and memorial plazas on Swain Boulevard." },
            { name: "Lake Worth Road & Jog Road Commercial Plaza District", category: "Central Retail Axis", description: "Bustling commercial crossroads connecting central Palm Beach County commuters." }
        ],
        thingsToDo: [
            { title: "Cable Waterskiing & Golf at Okeeheelee Park", spot: "Forest Hill Boulevard", description: "27 holes of championship golf, Shark Wake Park, and miles of paved bike trails." },
            { title: "Annual Fiesta de Pueblo Cultural Festival", spot: "Samuel J. Ferreri Community Park", description: "Vibrant celebration of Latin American heritage, music, food, and local businesses." },
            { title: "Nature Trail Walks at Pinehurst Mountain Bike Trail", spot: "Okeeheelee South", description: "Winding wooded trails and birdwatching boardwalks." },
            { title: "International Dining along Lake Worth Road", spot: "Jog Road to Military Trail", description: "Authentic Latin, Caribbean, and Mediterranean family restaurants." }
        ],
        keyCorridors: ["Jog Road", "Lake Worth Road", "Forest Hill Boulevard", "10th Avenue North", "Military Trail", "Haverhill Road"],
        topIndustries: ["Family Medical & Dental Clinics", "HVAC, Plumbing & Roofing Trades", "Tax, Accounting & Insurance", "Auto Repair & Dealership Services", "Multi-Cultural Dining & Retail"]
    },
    "lantana": {
        localCopy: [
            "As one of the oldest coastal towns in Palm Beach County with direct oceanfront access at Lantana Municipal Beach and a lively walkable downtown along East Ocean Avenue, Lantana blends Old Florida fishing village charm with Intracoastal luxury on Hypoluxo Island.",
            "From waterfront restaurants and marine services along East Ocean Avenue to residential properties on Hypoluxo Island and along Dixie Highway, South Florida Cleaning Concepts provides commercial kitchen degreasing, vacation rental turnover, and recurring home maintenance."
        ],
        landmarks: [
            { name: "Lantana Municipal Beach & Pavilion", category: "Oceanfront Park", description: "8-acre public beachfront park on A1A featuring dune boardwalks and oceanfront dining at Dune Deck Café." },
            { name: "Historic Old Key Lime House", category: "Historic Waterfront Landmark", description: "Florida's oldest waterfront restaurant (1889) overlooking the Intracoastal Waterway on East Ocean Avenue." },
            { name: "Lantana Nature Preserve", category: "Coastal Hammock Sanctuary", description: "Pristine subtropical hammock trail adjacent to the Carlisle and Intracoastal." },
            { name: "Lantana Bicentennial Park & Boat Ramp", category: "Lagoon Waterfront Park", description: "Scenic Lake Worth Lagoon park and marina launch along Ocean Avenue." }
        ],
        thingsToDo: [
            { title: "Sunset Live Music on the Intracoastal", spot: "East Ocean Avenue Waterfront", description: "Dockside dining, tiki bars, and award-winning key lime pie by the bridge." },
            { title: "Sunrise Beach Breakfast at Lantana Beach", spot: "South Ocean Boulevard (A1A)", description: "Al fresco oceanfront breakfast steps from the Atlantic surf." },
            { title: "Kayaking around Hypoluxo Island", spot: "Lantana Boat Ramp", description: "Paddle past historic waterfront estates and manatee habitats." },
            { title: "Shaded Hammock Walks at Lantana Nature Preserve", spot: "East Ocean Avenue", description: "Observe native gumbo limbo trees and migrating warblers." }
        ],
        keyCorridors: ["East Ocean Avenue", "Dixie Highway (US-1)", "Lantana Road", "Hypoluxo Road", "South Ocean Blvd (A1A)", "I-95"],
        topIndustries: ["Waterfront Dining & Hospitality", "Marine Services & Boat Sales", "Coastal Real Estate & Remodeling", "Healthcare & Senior Living", "Commercial Trades"]
    },
    "palm-springs": {
        localCopy: [
            "Centrally located between Lake Worth Beach and West Palm Beach along Congress Avenue, Forest Hill Boulevard, and 10th Avenue North, the Village of Palm Springs is a high-density residential and commercial hub with strong community roots.",
            "From medical clinics, dental practices, and legal suites along Congress Avenue and Forest Hill Boulevard to central Palm Springs neighborhoods, South Florida Cleaning Concepts delivers terminal medical sanitization, daily office trash removal and floor care, and reliable residential housekeeping."
        ],
        landmarks: [
            { name: "Village of Palm Springs Park & Splash Pad", category: "Civic Center Complex", description: "Central village green, athletic courts, library, and aquatic splash park on Cypress Lane." },
            { name: "Lake Clarke & Chain of Lakes Waterways", category: "Freshwater Canal System", description: "Scenic freshwater boating canals linking Palm Springs and Lake Clarke Shores." },
            { name: "Congress Avenue Commercial Corridor", category: "Business & Medical Axis", description: "High-traffic retail, medical, and professional services spine through the heart of the village." },
            { name: "Sago Palm Park", category: "Neighborhood Eco-Park", description: "Shaded walking trails and butterfly garden in central Palm Springs." }
        ],
        thingsToDo: [
            { title: "Family Afternoons at Village Splash Pad", spot: "226 Cypress Lane", description: "Interactive water features, shaded pavilions, and weekend village events." },
            { title: "Freshwater Kayaking & Bass Fishing", spot: "Keller Canal & Lake Clarke Access", description: "Calm inland waterways ideal for morning paddling." },
            { title: "Latin Bakeries & Cafés on Congress Avenue", spot: "Congress Ave & Forest Hill Blvd", description: "Authentic Cuban espresso, pastelitos, and international cuisine." },
            { title: "Ice Skating & Hockey Nearby at Palm Beach Skate Zone", spot: "Lake Worth Road Corridor", description: "Twin-rink ice skating and figure skating facility minutes away." }
        ],
        keyCorridors: ["Congress Avenue", "Forest Hill Boulevard", "10th Avenue North", "Lake Worth Road", "Military Trail", "Kirk Road"],
        topIndustries: ["Medical & Urgent Care Clinics", "Auto & Commercial Services", "Home Remodeling & HVAC", "Immigration & Family Law", "Local Retail & Groceries"]
    },
    "lake-park": {
        localCopy: [
            "With its historic 1920s Kelsey City heritage, deepwater Lake Park Harbor Marina, and thriving Park Avenue Arts & Brewery District, the Town of Lake Park is one of northern Palm Beach County's most exciting revitalized coastal towns.",
            "From marine artisan workshops and craft breweries along Park Avenue to industrial facilities on Northlake Boulevard and Silver Beach Road, South Florida Cleaning Concepts provides commercial restaurant and taproom cleaning, industrial shop detailing, and move-in/move-out turnover."
        ],
        landmarks: [
            { name: "Lake Park Harbor Marina", category: "Deepwater Intracoastal Marina", description: "Direct access to the Lake Worth Inlet with wet slips, boat ramps, and waterfront pavilions." },
            { name: "Kelsey Park on the Intracoastal", category: "Waterfront Heritage Park", description: "Palm-lined waterfront park framed by historic 1923 Olmsted Brothers design heritage." },
            { name: "Park Avenue Downtown Arts & Brewery District", category: "Creative Main Street", description: "Home to Kelsey Theater, coastal craft breweries, vintage roasters, and art studios." },
            { name: "Historic Lake Park Town Hall (1927)", category: "Mediterranean Revival Icon", description: "Restored landmark featuring its signature clock tower and civic auditorium." }
        ],
        thingsToDo: [
            { title: "Sunset Brews & Live Music on Park Avenue", spot: "Downtown Lake Park", description: "Monthly Sunset Celebration at the marina and craft beer tastings on Park Avenue." },
            { title: "Boating & Picnics at Kelsey Park", spot: "Lake Shore Drive", description: "Watch yachts pass along the Intracoastal Waterway beside tennis courts and playgrounds." },
            { title: "Live Concerts at The Kelsey Theater", spot: "700 Park Avenue", description: "Intimate live music, indie film screenings, and comedy nights." },
            { title: "Kayaking to Munyon Island", spot: "Lake Park Harbor Marina Launch", description: "Short paddle across the lagoon to John D. MacArthur Beach State Park estuaries." }
        ],
        keyCorridors: ["Park Avenue", "Federal Highway (US-1)", "Northlake Boulevard", "10th Street", "Silver Beach Road", "Congress Avenue"],
        topIndustries: ["Marine Service & Boat Outfitters", "Craft Hospitality & Roasteries", "Specialty Construction & Cabinetry", "Industrial & Warehouse Logistics", "Creative Studios"]
    },
    "tequesta": {
        localCopy: [
            "Nestled where the North Fork and Northwest Fork of the Loxahatchee River converge at the northern tip of Palm Beach County, the Village of Tequesta offers refined small-town living, boutique art galleries, and direct access to Coral Cove Park.",
            "From boutique offices and medical practices along Tequesta Drive and US-1 to luxury waterfront estates in Tequesta Country Club, South Florida Cleaning Concepts delivers discrete, white-glove estate housekeeping, specialized post-construction cleanup, and commercial office janitorial."
        ],
        landmarks: [
            { name: "Coral Cove Park on Jupiter Island", category: "Limestone Reef Beach", description: "Dramatic Anastasia limestone rock formations, tide pools, and snorkeling reefs just across the bridge." },
            { name: "Lighthouse ArtCenter Gallery & School of Art", category: "Cultural Institution", description: "Northern Palm Beach County's oldest visual arts museum and studio in Gallery Square North." },
            { name: "Constitution Park & Baumgee's Treehouse", category: "Community Park", description: "Elevated canopy treehouse, disc golf course, and walking trails on Dover Road." },
            { name: "Loxahatchee River & Pointe waterfront", category: "Waterfront Confluence", description: "Scenic riverfront overlooking the Jupiter Inlet Lighthouse." }
        ],
        thingsToDo: [
            { title: "Snorkeling Limestone Ledges at Coral Cove Park", spot: "Beach Road", description: "Explore natural rock outcrops, sea turtles, and calm Intracoastal family swimming areas." },
            { title: "Fine Art Exhibitions at Lighthouse ArtCenter", spot: "Tequesta Drive", description: "Nationally recognized exhibitions, ceramics studios, and plein air painting festivals." },
            { title: "Specialty Coffee & Boutique Shopping", spot: "Tequesta Drive & Gallery Square", description: "Curated coastal home decor, independent surf shops, and local cafés." },
            { title: "Pontoon & Paddleboard Cruises up the Loxahatchee", spot: "Juno Park / River Access", description: "Cruise past waterfront estates toward Jonathan Dickinson State Park." }
        ],
        keyCorridors: ["US Highway 1", "Tequesta Drive", "County Line Road", "Seabrook Road", "Old Dixie Highway"],
        topIndustries: ["Luxury Interior Design & Retail", "Concierge Medical & Wellness", "Custom Waterfront Builders", "Fine Art & Jewelry", "Marine & Yacht Management"]
    },
    "juno-beach": {
        localCopy: [
            "Bordered by the Atlantic Ocean on the east and over 40% preserved conservation lands on the west, Juno Beach is world-famous for the Loggerhead Marinelife Center, the 990-foot Juno Beach Pier, and the corporate headquarters of NextEra Energy / FPL.",
            "From corporate offices along US-1 and Donald Ross Road to oceanfront condominiums on Ocean Drive, South Florida Cleaning Concepts provides executive suite janitorial services, vacation rental turnovers, and coastal estate maintenance."
        ],
        landmarks: [
            { name: "Loggerhead Marinelife Center", category: "Global Sea Turtle Hospital", description: "World-renowned sea turtle research, rehabilitation, and ocean conservation campus at Loggerhead Park." },
            { name: "Juno Beach Pier", category: "Oceanfront Landmark", description: "990-foot saltwater fishing and sightseeing pier extending into the Atlantic Ocean." },
            { name: "Juno Dunes Natural Area", category: "569-Acre Scrub Preserve", description: "Ocean-to-Intracoastal conservation tract featuring the highest natural sand dune in Palm Beach County." },
            { name: "Pelican Lake in Town Center", category: "Scenic Civic Landmark", description: "Picturesque walking path with gazebos in the heart of Juno Beach." }
        ],
        thingsToDo: [
            { title: "Meet Rescued Sea Turtles at Loggerhead Center", spot: "14200 US Highway 1", description: "Tour outdoor sea turtle hospital tanks and guided summer turtle walks." },
            { title: "Sunrise Photography & Fishing on Juno Pier", spot: "Ocean Drive (A1A)", description: "Rent tackle at the pier house and watch surfers and pelicans at dawn." },
            { title: "Hike to the Observation Tower at Juno Dunes", spot: "US-1 Trailhead", description: "Panoramic views from the Atlantic Ocean to the Intracoastal Waterway." },
            { title: "Dog-Friendly Beach Walks at Jupiter/Juno Off-Leash", spot: "Marcinski Road North", description: "One of Florida's only dedicated dog-friendly ocean beaches just north of the pier." }
        ],
        keyCorridors: ["Ocean Drive (A1A)", "US Highway 1", "Donald Ross Road", "Marcinski Road", "Universe Boulevard"],
        topIndustries: ["Clean Energy & Corporate Executive Services", "Coastal Real Estate & Vacation Rentals", "Hospitality & Oceanfront Dining", "Wealth Management", "Eco-Tourism & Wellness"]
    },
    "westlake": {
        localCopy: [
            "Incorporated in 2016 as Palm Beach County's newest and fastest-growing municipality, the City of Westlake is transforming thousands of acres along Seminole Pratt Whitney Road into a vibrant master-planned hub anchored by the Westlake Adventure Park and Wellington Regional Medical Center's ER campus.",
            "As Westlake expands with thousands of new residences and commercial developments along Seminole Pratt Whitney Road, South Florida Cleaning Concepts delivers comprehensive post-construction cleanup, initial move-in deep scrubbing, and recurring residential cleaning for growing families."
        ],
        landmarks: [
            { name: "Westlake Adventure Park & Lagoon Pool", category: "Master-Planned Amenity Hub", description: "15-acre recreation complex with resort lagoon pool, tower slide, BMX pump park, and concert lawn." },
            { name: "Shoppes of Westlake Landings", category: "Commercial Town Center", description: "Rapidly expanding retail, dining, and medical corridor on Seminole Pratt Whitney Road." },
            { name: "J.W. Corbett Wildlife Management Area Gateway", category: "Natural Border Preserve", description: "60,000-acre pine flatwoods and cypress preserve just north of the city." },
            { name: "Cresswind Palm Beach Clubhouse", category: "Active Adult Landmark", description: "Premier Kolter Homes active-adult resort center." }
        ],
        thingsToDo: [
            { title: "BMX Pump Park & Resort Lagoon Pool", spot: "Kingfisher Boulevard", description: "Family water slides, splash pad, bocce courts, and food truck pavilions." },
            { title: "4thFest & Concert Lawn Events", spot: "Westlake Adventure Park", description: "City-wide concerts, fireworks, and seasonal farmers markets." },
            { title: "Golf Cart Trail Cruising Across Neighborhoods", spot: "Town Center Parkway", description: "Dedicated multi-use paths linking residential enclaves directly to shopping and dining." },
            { title: "Wildlife Viewing at Corbett & Loxahatchee Slough", spot: "Seminole Pratt Whitney North", description: "Hiking, horseback riding, and birding in untouched Florida flatwoods." }
        ],
        keyCorridors: ["Seminole Pratt Whitney Road", "Town Center Parkway", "Persimmon Boulevard", "60th Street North", "Southern Boulevard"],
        topIndustries: ["Custom Pool, Patio & Landscape Design", "Home Automation & Impact Glass", "Family Medical, Dental & Veterinary", "Real Estate & Mortgage Services", "New Retail & Restaurants"]
    }
};

Object.assign(SERVICE_AREA_GUIDES, COMMUNITY_AND_COASTAL_GUIDES);

export function getServiceAreaGuide(area: ServiceAreaItem): ServiceAreaGuide {
    const direct = SERVICE_AREA_GUIDES[area.slug];
    if (direct) return direct;

    const coastalSlugs = new Set([
        "highland-beach", "hypoluxo", "manalapan", "ocean-ridge",
        "south-palm-beach", "palm-beach-shores", "gulf-stream",
        "briny-breezes", "jupiter-inlet-colony"
    ]);
    const westernSlugs = new Set([
        "loxahatchee", "the-acreage", "avenir", "arden",
        "palm-beach-gardens-west", "golden-lakes"
    ]);
    const golfClubSlugs = new Set([
        "atlantis", "golf", "century-village", "kings-point", "lake-clarke-shores"
    ]);

    const primaryNeighborhood = area.neighborhoods[0] || area.name;
    const secondaryNeighborhood = area.neighborhoods[1] || "Surrounding Corridors";
    const thirdNeighborhood = area.neighborhoods[2] || "Waterfront & Residential Enclaves";

    if (coastalSlugs.has(area.slug)) {
        return {
            localCopy: [
                `Positioned along Palm Beach County's prized barrier island and Intracoastal coastline, ${area.name} is an exclusive coastal enclave where oceanfront estates, private yacht slips, and A1A residential communities set an uncompromising standard for quality. Residents across ${area.neighborhoods.join(", ")} rely on trusted specialists who understand coastal architecture, marine environments, and white-glove service delivery.`,
                `${area.marketInsight} South Florida Cleaning Concepts delivers tailored estate housekeeping, rotation deep cleaning, and discrete, bonded turnover services tailored for discerning ${area.name} property owners and seasonal residents.`
            ],
            landmarks: [
                { name: `${area.name} Oceanfront & A1A Scenic Corridor`, category: "Coastal Landmark", description: `Canopied sea-grape dunes, pristine Atlantic beachfront, and landmark oceanfront estates through ${primaryNeighborhood}.` },
                { name: `${primaryNeighborhood} Intracoastal Waterway Basin`, category: "Deepwater Yacht & Lagoon View", description: `Protected Lake Worth Lagoon and Intracoastal shoreline featuring deepwater docks and manatee sanctuaries.` },
                { name: `Historic Coastal Town Hall & Preserve Access`, category: "Civic & Conservation Icon", description: `Dedicated barrier-island municipal center and protected dune walkovers serving ${area.name} residents.` },
                { name: `Nearby Inlet & Barrier Island Beach Parks`, category: "Recreation Landmark", description: `Direct coastal access to Boynton Inlet, Lake Worth Inlet, and neighboring hammock preserves.` }
            ],
            thingsToDo: [
                { title: `Sunrise Cycling along State Road A1A`, spot: `${area.name} Ocean Boulevard`, description: `One of South Florida's most scenic coastal road-cycling and morning jogging routes.` },
                { title: `Intracoastal Yachting & Sunset Cruises`, spot: `${secondaryNeighborhood} Waterway`, description: `Private boating and paddleboarding along calm lagoon waters to nearby sandbars and waterfront dining.` },
                { title: `Sea Turtle Nesting & Coastal Dune Walks`, spot: `${area.name} Shoreline`, description: `Seasonal loggerhead and leatherback sea turtle conservation walks and nearshore reef snorkeling.` },
                { title: `Resort & Oceanfront Club Dining`, spot: `A1A & Neighboring Plaza Corridors`, description: `Five-star coastal cuisine, afternoon tea, and ocean-view terraces minutes from home.` }
            ],
            keyCorridors: ["State Road A1A (Ocean Boulevard)", "Intracoastal Waterway", "US Highway 1 (Federal Hwy)", primaryNeighborhood, secondaryNeighborhood],
            topIndustries: ["Marine & Yacht Management", "Custom Coastal Estate Building", "Private Wealth & Family Offices", "Concierge Healthcare & Wellness", "Luxury Interior & Landscape Design"]
        };
    }

    if (westernSlugs.has(area.slug)) {
        return {
            localCopy: [
                `Set amidst expansive acreage, preserved wetlands, and master-planned agrihoods in western Palm Beach County, ${area.name} offers space, privacy, and modern resort amenities across ${area.neighborhoods.join(", ")}. From equestrian properties and custom estate lots to resort clubhouses and working community farms, ${area.name} represents the fastest-growing residential frontier in the region.`,
                `${area.marketInsight} South Florida Cleaning Concepts delivers specialized post-construction cleanup, acreage estate detailing, and recurring maid services keeping homes and commercial facilities throughout ${area.name} perpetually immaculate.`
            ],
            landmarks: [
                { name: `${area.name} Town Center & Amenity Clubhouse`, category: "Community Hub", description: `Resort-style pools, community barn/pavilion, and gathering greens anchoring ${primaryNeighborhood}.` },
                { name: `Loxahatchee Slough & Corbett Conservation Trails`, category: "Eco-Preserve Landmark", description: `Thousands of acres of adjacent pine flatwoods, equestrian bridle trails, and cypress marshes.` },
                { name: `${secondaryNeighborhood} Equestrian & Acreage Estates`, category: "Residential & Equestrian District", description: `Multi-acre homesteads, private stables, and custom architectural estates.` },
                { name: `Western Corridor Community Park & Amphitheater`, category: "Recreation Complex", description: `Lighted athletic fields, equestrian rings, and weekend farmers market grounds.` }
            ],
            thingsToDo: [
                { title: `Equestrian Trail Riding & Greenbelt Cycling`, spot: `${primaryNeighborhood} Trail Network`, description: `Miles of dedicated bridle paths, multi-use greenways, and canal-bank trails.` },
                { title: `Farm-to-Table Markets & Barn Socials`, spot: `${area.name} Community Hub`, description: `Seasonal u-pick harvests, artisan markets, and acoustic sunset gatherings.` },
                { title: `Kayaking & Birding in Western Preserves`, spot: `${thirdNeighborhood} Conservation Area`, description: `Observe sandhill cranes, ospreys, and native orchids along quiet freshwater sloughs.` },
                { title: `Resort Pool & Racquet Club Weekends`, spot: `${area.name} Amenity Campus`, description: `Championship pickleball, tennis, fitness studios, and lakeside cabanas.` }
            ],
            keyCorridors: ["Southern Boulevard (SR 80)", "Northlake Boulevard", "Seminole Pratt Whitney Road", "Okeechobee Boulevard", "lion Country / Western Trail Axis"],
            topIndustries: ["Custom Home, Pool & Barn Builders", "Solar, Well Water & Land Services", "Equestrian & Veterinary Care", "Family Medical & Orthodontics", "Landscape & Outdoor Living"]
        };
    }

    if (golfClubSlugs.has(area.slug)) {
        return {
            localCopy: [
                `Built around championship fairways, tranquil lakes, and gated clubhouse living, ${area.name} is one of Palm Beach County's premier golf, country club, and active-lifestyle communities. Spanning ${area.neighborhoods.join(", ")}, local residents prioritize trusted, high-touch medical specialists, financial advisors, and licensed home improvement professionals.`,
                `${area.marketInsight} South Florida Cleaning Concepts provides white-glove recurring housekeeping, HEPA allergen filtration vacuuming, and specialized move-in/move-out cleaning tailored to the highest standards of ${area.name} homeowners and club community executives.`
            ],
            landmarks: [
                { name: `${area.name} Championship Golf & Country Club`, category: "Signature Golf Landmark", description: `Manicured 18-to-27-hole fairways, pro shops, and clubhouse dining anchoring ${primaryNeighborhood}.` },
                { name: `${secondaryNeighborhood} Waterfront & Civic Park`, category: "Community Park", description: `Shaded walking paths, tennis/pickleball courts, and lakeside pavilions.` },
                { name: `Regional Medical & Professional Plaza`, category: "Healthcare & Commercial Hub", description: `Premier specialty medical offices and financial centers serving ${area.name}.` },
                { name: `Performing Arts Clubhouse & Recreation Theatre`, category: "Cultural Venue", description: `Live touring concerts, lecture series, and social clubs for year-round and seasonal residents.` }
            ],
            thingsToDo: [
                { title: `Morning Tee Times & Golf Cart Cruising`, spot: `${primaryNeighborhood} Fairways`, description: `Year-round championship golf and golf-cart-friendly neighborhood avenues.` },
                { title: `Pickleball, Tennis & Aquatics Club`, spot: `${area.name} Racquet Center`, description: `Competitive leagues, heated lap pools, and wellness clinics.` },
                { title: `Clubhouse Fine Dining & Sunset Terraces`, spot: `${secondaryNeighborhood} Overlook`, description: `Al fresco dining overlooking manicured greens and waterfront fountains.` },
                { title: `Lakeside Birding & Botanical Walks`, spot: `${thirdNeighborhood} Greenway`, description: `Peaceful morning walks beneath royal palms and flowering banyan trees.` }
            ],
            keyCorridors: ["Congress Avenue", "Military Trail", "Jog Road", "Lantana Road", "Atlantic Avenue / Glades Axis"],
            topIndustries: ["Concierge Medicine & Ophthalmology", "Estate Planning & Wealth Management", "Luxury Kitchen, Bath & Impact Remodeling", "Private Country Club Hospitality", "Home Care & Physical Therapy"]
        };
    }

    return {
        localCopy: [
            `Located in the heart of Palm Beach County's dynamic residential and commercial corridor, ${area.name} connects vibrant neighborhoods including ${area.neighborhoods.join(", ")} with immediate access to South Florida's major commuter arteries and parks. Homeowners and commercial enterprises here drive steady, high-intent search demand for responsive local professionals.`,
            `${area.marketInsight} South Florida Cleaning Concepts delivers customized office janitorial care, terminal medical sanitization, and reliable residential rotation cleaning that keeps ${area.name} commercial spaces and residences pristine.`
        ],
        landmarks: [
            { name: `${primaryNeighborhood} Community Center & Park`, category: "Neighborhood Landmark", description: `Shaded green spaces, walking paths, and athletic facilities serving ${area.name} families.` },
            { name: `${secondaryNeighborhood} Commercial & Retail Corridor`, category: "Business Hub", description: `High-visibility shopping plazas, local cafés, and service offices.` },
            { name: `Nearby Palm Beach County Regional Preserve & Waterways`, category: "Natural & Recreation Landmark", description: `Connected canal greenways, nature centers, and bike trails bordering ${area.name}.` },
            { name: `${thirdNeighborhood} Historic & Civic District`, category: "Community Enclave", description: `Established residential streets and local heritage architecture.` }
        ],
        thingsToDo: [
            { title: `Greenway Cycling & Morning Park Walks`, spot: `${primaryNeighborhood} Trails`, description: `Scenic palm-lined paths connecting to county-wide parks and waterways.` },
            { title: `Local Cafés & Family Dining`, spot: `${secondaryNeighborhood} Plaza`, description: `Independent bakeries, Latin and coastal restaurants, and weekend brunches.` },
            { title: `Golf, Tennis & Aquatic Recreation`, spot: `Adjacent County Regional Parks`, description: `Public championship golf courses, racquet centers, and splash pads minutes away.` },
            { title: `Weekend GreenMarkets & Cultural Outings`, spot: `Central Palm Beach Corridor`, description: `Quick access to waterfront farmers markets, museums, and live outdoor concerts.` }
        ],
        keyCorridors: ["Military Trail", "Congress Avenue", "US Highway 1 / Dixie Highway", "Southern Boulevard", primaryNeighborhood],
        topIndustries: ["Home Services (Roofing, HVAC, Electrical)", "Family Healthcare & Dental", "Legal & Financial Services", "Automotive & Commercial Trades", "Real Estate & Property Management"]
    };
}

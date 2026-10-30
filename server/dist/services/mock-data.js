/**
 * LocalMuse Ops - Curated Demo Datasets & Mock Fixtures
 *
 * NOTE ON DATA PROVENANCE & HONESTY:
 * All records, affinities, and trend indices contained in this file are
 * curated illustrative mock fixtures designed exclusively for demonstration,
 * testing, and UI evaluation when Qloo credentials are unavailable.
 * They do NOT represent live Qloo API queries or verified empirical measurements.
 */
// ---------------------------------------------------------------------------
// 1. SCENARIO 1: Location Insights - Specialty Coffee in Austin, Texas
// ---------------------------------------------------------------------------
export const MOCK_AUSTIN_COFFEE_INSIGHTS = {
    target_location: "Austin, Texas",
    business_type: "Specialty Coffee & Roastery",
    cultural_overview: "Austin's specialty coffee landscape is driven by third-wave roasters, pet-friendly outdoor patios, and creative hybrid workspaces blending artisanal single-origin espresso with remote tech and creative lifestyles.",
    top_cultural_anchors: [
        {
            id: "place-atx-001",
            name: "Flat Track Coffee",
            category: "Specialty Café & Moto-Roastery",
            neighborhood: "East Austin (Cesar Chavez)",
            illustrative_affinity_score: 96,
            cultural_tags: [
                "urn:tag:culinary:specialty_roaster",
                "urn:tag:lifestyle:moto_culture",
                "urn:tag:atmosphere:industrial_patio"
            ],
            vibe_keywords: ["Eastside Creative", "Bold Single-Origin", "Artisan Roaster"],
            description: "Pioneering East Austin coffeehouse and custom motorcycle garage with high creative worker affinity."
        },
        {
            id: "place-atx-002",
            name: "Houndstooth Coffee",
            category: "Third-Wave Coffee Bar",
            neighborhood: "Downtown & North Lamar",
            illustrative_affinity_score: 93,
            cultural_tags: [
                "urn:tag:culinary:third_wave",
                "urn:tag:lifestyle:design_forward",
                "urn:tag:lifestyle:business_casual"
            ],
            vibe_keywords: ["Precision Brews", "Minimalist Architecture", "Downtown Focus"],
            description: "Architecturally refined espresso bars serving meticulous pour-overs with high young professional overlap."
        },
        {
            id: "place-atx-003",
            name: "Fleet Coffee",
            category: "Craft Micro-Café",
            neighborhood: "East Austin (Webberville)",
            illustrative_affinity_score: 89,
            cultural_tags: [
                "urn:tag:culinary:experimental_tonics",
                "urn:tag:lifestyle:indie_music",
                "urn:tag:atmosphere:walkup_window"
            ],
            vibe_keywords: ["Experimental Espresso", "Compact Bar", "Neighborhood Staple"],
            description: "Intimate converted gas-station space famed for seasonal espresso cocktails and indie community appeal."
        },
        {
            id: "place-atx-004",
            name: "Radio Coffee & Beer",
            category: "Café, Beer Garden & Food Truck Park",
            neighborhood: "South Lamar (78704)",
            illustrative_affinity_score: 95,
            cultural_tags: [
                "urn:tag:lifestyle:community_gathering",
                "urn:tag:music:bluegrass_acoustic",
                "urn:tag:atmosphere:shaded_grove"
            ],
            vibe_keywords: ["All-Day Hub", "Live Music", "Food Truck Synergy"],
            description: "Quintessential South Austin community compound hosting morning espresso, Veracruz All Natural tacos, and evening bluegrass."
        },
        {
            id: "place-atx-005",
            name: "Figure 8 Coffee Purveyors",
            category: "Neighborhood Third-Wave Café",
            neighborhood: "East Austin (Chicon)",
            illustrative_affinity_score: 88,
            cultural_tags: [
                "urn:tag:lifestyle:vinyl_records",
                "urn:tag:culinary:artisan_pastry",
                "urn:tag:atmosphere:analog_cozy"
            ],
            vibe_keywords: ["Vinyl Aesthetic", "Unpretentious Baristas", "Natural Light"],
            description: "Low-key neighborhood staple featuring rotating guest roasters, vintage turntables, and local artwork."
        }
    ],
    defining_concept_tags: [
        { urn: "urn:tag:culinary:single_origin", label: "Single-Origin Pour Over", prevalence: "Very High" },
        { urn: "urn:tag:atmosphere:dog_friendly_patio", label: "Canine-Friendly Outdoor Seating", prevalence: "Dominant" },
        { urn: "urn:tag:lifestyle:remote_creative_hub", label: "Freelancer & Remote Work Haven", prevalence: "High" },
        { urn: "urn:tag:music:indie_electronic", label: "Indie Rock & Ambient Electronics", prevalence: "Elevated" },
        { urn: "urn:tag:culinary:plant_based_milks", label: "Housemade Oat & Nut Milks", prevalence: "Standard" }
    ],
    demographic_breakdown: {
        primary_age_bracket: "24–38 years old",
        target_segments: [
            "Remote Tech & Startup Professionals",
            "Creative Agency Freelancers & Designers",
            "Local Culinary & Specialty Beverage Enthusiasts"
        ],
        lifestyle_interests: [
            "Independent Roasters & Bean Subscriptions",
            "Boutique Activewear & Outdoor Recreation",
            "Sustainable Architecture & Mid-Century Modern Design"
        ]
    }
};
// ---------------------------------------------------------------------------
// 2. SCENARIO 2: Audience Comparison - Austin vs Nashville
// ---------------------------------------------------------------------------
export const MOCK_AUSTIN_VS_NASHVILLE_COMPARISON = {
    market_a: {
        name: "Austin, TX (Creative Tech & Hill Country Hub)",
        cultural_anchor_signals: ["ACL Music Fest", "South Congress Artisan Shops", "Barton Springs", "Eastside Roasters"],
        dominant_lifestyle_themes: ["Casual Tech", "Active Wellness", "Outdoor Escapism", "Third-Wave Coffee"]
    },
    market_b: {
        name: "Nashville, TN (Music City & Heritage Craft Hub)",
        cultural_anchor_signals: ["The Ryman Auditorium", "East Nashville Vintage", "12 South Boutiques", "Germantown Dining"],
        dominant_lifestyle_themes: ["Singer-Songwriter Culture", "Heritage Denim", "Hospitality Craft", "Bourbon & Espresso"]
    },
    shared_affinities: [
        {
            category: "Independent Music & Nightlife",
            concept: "Live Venue Patronage & Vinyl Record Collecting",
            illustrative_index: 94,
            description: "Both Austin and Nashville audiences index dramatically above national averages for live performance attendance and vinyl curation."
        },
        {
            category: "Craft Beverage Dedication",
            concept: "Third-Wave Roasteries & Artisanal Microbreweries",
            illustrative_index: 91,
            description: "Heavy daytime reliance on independent local coffeehouses transitioning into neighborhood micro-bars in the late afternoon."
        },
        {
            category: "Culinary Identity",
            concept: "Artisan Smokehouse / BBQ & Elevated Comfort Food",
            illustrative_index: 88,
            description: "Deep loyalty to regional specialty culinary traditions executed with artisanal culinary techniques."
        },
        {
            category: "Retail Lifestyle",
            concept: "Locally-Owned Boutique Brands over Mass Retail",
            illustrative_index: 86,
            description: "Strong civic preference for hyper-local makers, independent print shops, and homegrown apparel creators."
        }
    ],
    differentiating_affinities: {
        market_a_exclusive: [
            {
                trait: "Indie Electronic, Psych-Rock & Synthpop",
                affinity_divergence: "+38% relative to Nashville",
                context: "Austin listeners exhibit much higher overlap with modern electronic, indie psych-rock, and ambient work playlists."
            },
            {
                trait: "Casual Tech Apparel & Sustainable Activewear",
                affinity_divergence: "+42% relative to Nashville",
                context: "Higher brand index for technical apparel, commuter cycling gear, and casual footwear (e.g., On Running, Vuori)."
            },
            {
                trait: "Breakfast Taco Ritual & Tex-Mex Coffee Pairings",
                affinity_divergence: "+54% relative to Nashville",
                context: "Daily morning coffee runs in Austin are structurally linked with breakfast taco food trucks."
            }
        ],
        market_b_exclusive: [
            {
                trait: "Americana, Neo-Traditional Country & Roots Rock",
                affinity_divergence: "+51% relative to Austin",
                context: "Nashville crowds maintain an unparalleled cultural resonance with singer-songwriter listening rooms and roots music."
            },
            {
                trait: "Heritage Leather, Vintage Denim & Tailored Craft",
                affinity_divergence: "+39% relative to Austin",
                context: "Strong affinity for bespoke American heritage labels, dry denim, and leather boot craft (e.g., Imogene + Willie)."
            },
            {
                trait: "Boutique Hospitality & Speakeasy Cocktail Culture",
                affinity_divergence: "+33% relative to Austin",
                context: "Higher preference for historic brick architecture, hotel lobby lounges, and craft cocktail parlors."
            }
        ]
    },
    operational_takeaway: "Brands expanding from Austin to Nashville or vice-versa can rely on a shared appreciation for craft beverages and live music. However, brand tone should shift from Austin's laid-back, sun-drenched tech minimalism to Nashville's richer, heritage-crafted storytelling and hospitality warmth."
};
// ---------------------------------------------------------------------------
// 3. SCENARIO 3: Local Trends - Specialty Coffee & Café Culture
// ---------------------------------------------------------------------------
export const MOCK_AUSTIN_COFFEE_TRENDS = {
    location: "Austin, Texas",
    category: "Specialty Coffee & Modern Café Culture",
    historical_timeline: [
        { period: "2025-Q1", illustrative_momentum_index: 68, sample_volume_indicator: "Stable baseline" },
        { period: "2025-Q2", illustrative_momentum_index: 74, sample_volume_indicator: "Summer iced format jump" },
        { period: "2025-Q3", illustrative_momentum_index: 81, sample_volume_indicator: "Back-to-work campus surge" },
        { period: "2025-Q4", illustrative_momentum_index: 85, sample_volume_indicator: "Holiday single-origin sales" },
        { period: "2026-Q1", illustrative_momentum_index: 92, sample_volume_indicator: "Functional tonics spike" },
        { period: "2026-Q2", illustrative_momentum_index: 96, sample_volume_indicator: "Peak cold-brew season" }
    ],
    emerging_cultural_shifts: [
        {
            shift_name: "Botanical Tonics & Adaptogenic Cold Brews",
            momentum_growth: "+38% YoY",
            description: "Infusions of sparkling cascara, citrus blossom water, and reishi/ashwagandha cold brews as afternoon pick-me-ups replacing standard espresso.",
            pioneering_local_spots: ["Fleet Coffee", "Civil Goat Coffee", "Desnudo Coffee"]
        },
        {
            shift_name: "Day-to-Night Hybrid Venues (Espresso to Natural Wine)",
            momentum_growth: "+45% YoY",
            description: "Cafés seamlessly converting into low-intervention natural wine and tinned-fish listening bars after 4:00 PM to capture after-work socializing.",
            pioneering_local_spots: ["Radio East", "Better Half Craft", "Vintage Bookstore & Wine Bar"]
        },
        {
            shift_name: "Micro-Batch Neighborhood Roaster Pop-ups",
            momentum_growth: "+29% YoY",
            description: "Single-origin roasters collaborating with local bakeries and ceramics studios for weekend morning drops featuring limited-run varietals.",
            pioneering_local_spots: ["Flat Track Roasters", "Figure 8 Coffee Purveyors", "Talent Coffee"]
        }
    ],
    neighborhood_heatmaps: [
        {
            neighborhood: "East Austin (78702)",
            affinity_density: "Peak",
            primary_patron_profile: "Designers, tech remote workers, creative startup founders"
        },
        {
            neighborhood: "South Congress & Bouldin (78704)",
            affinity_density: "High",
            primary_patron_profile: "Creative professionals, weekend travelers, wellness enthusiasts"
        },
        {
            neighborhood: "Mueller & Cherrywood (78722 / 78723)",
            affinity_density: "Growing",
            primary_patron_profile: "Young families, academic researchers, sustainability advocates"
        }
    ]
};
// ---------------------------------------------------------------------------
// 4. SCENARIO 4: Business Recommendations - Weekday Footfall for an Independent Café
// ---------------------------------------------------------------------------
export const MOCK_CAFE_WEEKDAY_FOOTFALL_RECOMMENDATIONS = {
    business_name: "Solstice Craft Coffee Lab",
    business_context: "Independent 35-seat specialty café located in an active mixed-use neighborhood",
    strategic_goal: "Activate weekday footfall between 11:00 AM and 4:00 PM while upholding craft coffee credibility",
    ranked_opportunities: [
        {
            id: "rec-wf-001",
            rank: 1,
            title: "Midday 'Focus & Flow' Co-Working Pass with Dedicated Ergonomic Seating",
            type: "Programming",
            illustrative_fit_score: 95,
            target_segment: "Remote knowledge workers & independent consultants",
            operational_effort: "Low",
            strategic_rationale: "Addresses the 11 AM - 2 PM weekday plateau by packaging high-speed verified WiFi, unlimited batch brew refills, and a guaranteed power-station booth during off-peak hours.",
            implementation_milestones: [
                "Designate 8-10 perimeter tables as reserved co-working zones from 10:30 AM to 3:30 PM",
                "Introduce a $14 'Focus Pass' including 1 pour-over/batch brew, 1 pastry, and 3 hours of reserved table time",
                "Implement polite laptop-friendly signage that preserves communal lounge space for casual walk-ins"
            ]
        },
        {
            id: "rec-wf-002",
            rank: 2,
            title: "Artisanal Sourdough & Specialty Tostada Afternoon Lunch Drop",
            type: "Partnership",
            illustrative_fit_score: 91,
            target_segment: "Local neighborhood residents & midday office workers",
            operational_effort: "Medium",
            strategic_rationale: "Solves the lack of savoury midday food options that currently drives patrons away to nearby fast-casual restaurants at lunch.",
            implementation_milestones: [
                "Partner with a nearby micro-bakery for a 11:30 AM daily drop of 2 savoury foccacias and grain bowls",
                "Requires zero kitchen build-out or cooking equipment—served with house specialty iced teas",
                "Promote lunch combos on Instagram Stories and neighborhood Slack channels at 10:45 AM"
            ]
        },
        {
            id: "rec-wf-003",
            rank: 3,
            title: "Cascara Tonic & Afternoon Botanical Spritz Hour (2 PM - 4 PM)",
            type: "Product",
            illustrative_fit_score: 87,
            target_segment: "Afternoon health-conscious creatives & post-lunch caffeine shifters",
            operational_effort: "Low",
            strategic_rationale: "Offers refreshing, lower-caffeine botanical coffee-leaf tonics during the 2–4 PM afternoon slump when patrons avoid heavy espresso.",
            implementation_milestones: [
                "Curate a 3-drink signature spritz menu: Cascara Blood Orange, Nitro Lavender Matcha, and Sparkling Cold Brew Yuzu",
                "Offer a $1 discount between 2:00 PM and 4:00 PM branded as 'The Botanical Siesta'",
                "Provide aesthetic glassware for table service to encourage social sharing"
            ]
        },
        {
            id: "rec-wf-004",
            rank: 4,
            title: "Bi-Weekly Acoustic Lo-Fi & Ambient Vinyl Listening Sessions",
            type: "Atmosphere",
            illustrative_fit_score: 82,
            target_segment: "Creative freelancers, audio enthusiasts & students",
            operational_effort: "Medium",
            strategic_rationale: "Replaces generic background playlists with curated, low-decibel analog music sessions that attract focused workers seeking creative stimulation.",
            implementation_milestones: [
                "Install a visible vintage turntable setup behind the espresso bar",
                "Invite local vinyl collectors or baristas to spin low-tempo ambient/jazz records on Tuesday and Thursday afternoons",
                "Partner with a local independent record shop for a rotating 'Record of the Week' display"
            ]
        },
        {
            id: "rec-wf-005",
            rank: 5,
            title: "Hyper-Local 'Neighborhood Roaster Tasting Flights' on Wednesday Afternoons",
            type: "Programming",
            illustrative_fit_score: 79,
            target_segment: "Coffee connoisseurs and home-brewing enthusiasts",
            operational_effort: "Low",
            strategic_rationale: "Transforms Wednesday afternoon lulls into mini sensory experiences for coffee enthusiasts without slowing down standard bar flow.",
            implementation_milestones: [
                "Offer a 3-cup comparative flight comparing roast profiles from 3 regional roasters",
                "Include a printed tasting notes card with origin stories and flavor wheels",
                "Pair with retail whole-bean bag discounts for attendees"
            ]
        }
    ],
    projected_impact_summary: "Implementing the top 2 ranked initiatives (Co-Working Pass + Midday Savoury Drop) provides an estimated 25–35% increase in weekday midday dwell time and raises average patron check size from $6.20 to $11.50 without disrupting peak morning coffee operations."
};

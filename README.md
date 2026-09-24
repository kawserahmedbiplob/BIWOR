# BIWORSOURCING — Professional Apparel Sourcing Website

Full professional business website for a Bangladesh garment buying house / apparel sourcing agent.

Inspired by nextapparels.com structure and content depth, with a complete admin dashboard.

## Features

### Public Website (full content)
- Hero with trust badges
- About + 5 capability cards
- Bangladesh sourcing story
- 4 Operating Principles
- 6 Services
- 5-Stage Process
- Who We Work With (6 segments)
- Lead Times table
- Products catalogue (with images)
- Factory Certifications table
- Factory Gallery (with images)
- Why Source With Us
- Contact + WhatsApp button
- SEO optimized

### Admin Dashboard (`/admin`)
| Tab | Capabilities |
|-----|-------------|
| Overview | Stats + quick actions |
| Products | Add/Edit/Delete + **image upload** |
| Gallery | Factory photos + **image upload** |
| Content | Edit all homepage text |
| Logo & Brand | Upload logo + favicon |
| SEO | Meta title, description, keywords, OG |

**Password:** `biwor2024`

## Run

```bash
npm install
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin  

## Structure

```
data/           products.json, gallery.json, settings.json
public/uploads/ logo, products/, gallery/
src/app/admin/  full dashboard
src/app/api/    auth, products, gallery, settings, upload
```

Built for BIWORSOURCING.

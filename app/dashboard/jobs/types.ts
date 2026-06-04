export type Job = {
  // Core identifiers
  id: string
  platform: string | null
  platform_url: string | null
  official_url: string | null

  // Job details
  title: string
  company: string
  location: string | null
  location_details: Record<string, any> | null
  url: string
  description: string | null
  posted_date: string | null
  valid_through: string | null
  applicant_count: number | null
  is_remote: boolean | null

  // Job classification
  job_type: string | null
  job_level: string | null
  job_function: string | null
  listing_type: string | null
  skills: string | null
  work_from_home: string | null
  vacancy_count: number | null
  experience_range: string | null
  easy_apply: boolean | null

  // Salary
  salary: string
  salary_period: string | null
  salary_minimum: number | null
  salary_maximum: number | null
  salary_currency: string | null

  // Company
  company_name: string | null
  company_type: string | null
  company_founded: number | null
  company_industry: string | null
  company_url: string | null
  company_website: string | null
  company_logo: string | null
  company_addresses: string | null
  company_revenue: string | null
  company_description: string | null
  company_rating: number | null
  employee_count: string | null
  review_count: number | null

  // Contact
  emails: string[]
  phones: string[]
  social_links: Record<string, string>

  // AI fields
  fitScore: number
  reasoning: string | null

  // Legacy compat
  deadline: string | null
  postedAt: string | null
}

# E-Commerce Website

This repository is a prototype of an e-commerce application.
It was built as a validation test regarding whether or not
an in-house e-commerce solution for Today Beauty Supply would best meet
business requirements, or if outsourcing would be required.
We eventually arrived at outsourcing, deciding on Shopify given
both it's built-in functionality as well as it's high level of extensibility.
It was also my first attempt at building production software
and I gained alot from it.

### Did I Use AI?

I did use the assistance of AI, specifically LLMs, for
debugging and ideation. There was a point
where I did consider and actually incorporated the use of
a code-specialized LLM, (i.e., Codex).

I decided on not moving along with it after the first pull
request due to me wanting to build actual experience and
understanding. This would be tremendously harder to do
with code generation, as the code produced is well beyond
the scope of which I've written before (or even read and
understood). I also found it a bit too convenient for my
liking.
I'm not a "vibe coder" and I didn't decide to choose
Computer Science as one of my passions to "vibe" my way
though software engineering. Thus I decided to struggle
and build the code myself. So I committed to using AI as a
debugging assistant, verifier/corrector of my intuition,
and a tutor/reference when working with a technology
new to me or one with poor documentation.

### Tech Stack

1. Database: Supabase
2. Frontend: React.js/Next.js
3. Languages: Typescript and PostgreSQL
4. UI/UX: shadcn components
5. Styling: Tailwind
6. Payment API: Stripe (planned; hasn't been implemented)

I decided to keep the stack as barebones as possible.
Supabase does a tremendous job at being a complete
backend. After doing an intensive, 2 week long deep dive
into the PSQL Database Management System and PostgreSQL,
I was able to leverage Postgres' flexibility
to a much higher degree after studying those basics,
rather then having to rely on the useful,
but often non sufficient supabase queries.
I was able to create views, indexes, and use psql
to interact with the database directly instead of
relying on supabase's GUI and AI assistant. I wrote my own
database procedures and used them though supabase's
rpc implementation.

For the frontend, I chose Next.js due to
my experience with React and the added benefit of SSR of
products for SEO reasons. I used shadcn/ui components
throughout the entire project because I truly dislike
debugging UI and why reinvent the wheel? I also had Codex generate
most of the UI and styling, as my main goal is experience building
backend systems, and being more of a generalist, full-stack engineer.

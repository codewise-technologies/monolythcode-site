import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero, usePageMeta } from '../components/blocks'

export default function NotFound() {
  usePageMeta('Page not found', 'The page you were looking for does not exist.')
  return (
    <PageHero
      eyebrow="Error 404"
      title="This page does not exist."
      lede="The link may be out of date, or the address may have a typo. These pages will get you back on track."
      glyph={[
        { x: 0, y: 0, z: 0, w: 4, d: 4, h: 0.9 },
        { x: 1.6, y: 0, z: 1.35, w: 4, d: 4, h: 0.9 },
        { x: 0, y: 0, z: 2.7, w: 4, d: 4, h: 0.9, accent: true },
      ]}
    >
      <Link to="/" className="btn btn-primary">Go to the home page <ArrowRight aria-hidden="true" /></Link>
      <Link to="/services" className="btn btn-ghost">Browse services</Link>
      <Link to="/contact" className="btn btn-ghost">Contact us</Link>
    </PageHero>
  )
}

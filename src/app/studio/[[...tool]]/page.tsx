/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

"use client"

import { NextStudio } from "next-sanity/studio"
import config from "../../../../sanity.config"
import type { FC } from "react"

/**
 * Studio page component that renders the Sanity Studio
 * @returns The Sanity Studio component
 */
const StudioPage: FC = () => {
  return <NextStudio config={config} />
}

export default StudioPage


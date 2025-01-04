import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'

const projectId = process.env.VITE_SANITY_PROJECT_ID

export default defineConfig({
  basePath: '/studio',
  projectId: "3zx1ytic",
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schema.types,
  },
})
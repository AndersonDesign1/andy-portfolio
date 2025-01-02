import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

export default defineConfig({
  projectId: 'your-project-id',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    types: [
      {
        name: 'post',
        type: 'document',
        title: 'Blog Post',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Title'
          },
          {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
              source: 'title',
              maxLength: 96
            }
          },
          {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }]
          },
          {
            name: 'excerpt',
            type: 'text',
            title: 'Excerpt',
            description: 'A short description of the blog post'
          },
          {
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: {
              hotspot: true
            }
          },
          {
            name: 'date',
            title: 'Date',
            type: 'datetime'
          }
        ]
      }
    ]
  }
})


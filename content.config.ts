import { defineCollection, z } from '@nuxt/content'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
const orientationEnum = z.enum(['vertical', 'horizontal'])

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const createFeatureItemSchema = () => createBaseSchema().extend({
  icon: z.string().nonempty().editor({ input: 'icon' })
})

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional()
})

const createImageSchema = () => z.object({
  src: z.string().nonempty().editor({ input: 'media' }),
  alt: z.string().optional(),
  loading: z.enum(['lazy', 'eager']).optional(),
  srcset: z.string().optional()
})

export const collections = {
  index: defineCollection({
    source: '0.index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        links: z.array(createLinkSchema()),
        images: z.array(createImageSchema()).optional()
      }),
      about: createBaseSchema().optional(),
      experience: createBaseSchema().extend({
        items: z.array(z.object({
          date: z.string(),
          position: z.string(),
          company: z.object({
            name: z.string(),
            url: z.string(),
            logo: z.string().editor({ input: 'icon' }),
            color: z.string().optional()
          })
        }))
      }).optional(),
      projects: createBaseSchema().extend({
        items: z.array(z.object({
          title: z.string(),
          description: z.string(),
          url: z.string()
        }))
      }).optional(),
      blog: createBaseSchema().optional()
    })
  }),

  blog: defineCollection({
    source: '3.blog.yml',
    type: 'page'
  }),
  posts: defineCollection({
    source: '3.blog/**/*',
    type: 'page',
    schema: z.object({
      image: z.object({ src: z.string().nonempty().editor({ input: 'media' }) }),
      authors: z.array(
        z.object({
          name: z.string().nonempty(),
          to: z.string().nonempty(),
          avatar: z.object({ src: z.string().nonempty().editor({ input: 'media' }) })
        })
      ),
      date: z.date(),
      badge: z.object({ label: z.string().nonempty() })
    })
  }),

  projects: defineCollection({
    source: 'projects/*.yml',
    type: 'data',
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      image: z.string().nonempty().editor({ input: 'media' }),
      url: z.string().nonempty(),
      tags: z.array(z.string()),
      date: z.string()
    })
  }),
  projectsPage: defineCollection({
    source: '5.projects.yml',
    type: 'page',
    schema: z.object({
      links: z.array(createLinkSchema())
    })
  }),
  about: defineCollection({
    source: '6.about.yml',
    type: 'page',
    schema: z.object({
      content: z.string(),
      images: z.array(createImageSchema())
    })
  })
}

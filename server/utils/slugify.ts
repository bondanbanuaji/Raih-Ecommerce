import slugify from 'slugify'

/**
 * Generate a URL-friendly slug from a string
 */
export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
}

/**
 * Generate a unique slug by appending a number if needed
 */
export const generateUniqueSlug = async (
  text: string,
  checkExistence: (slug: string) => Promise<boolean>,
  excludeId?: number
): Promise<string> => {
  let baseSlug = generateSlug(text)
  let slug = baseSlug
  let counter = 1

  // Check if slug already exists
  while (await checkExistence(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

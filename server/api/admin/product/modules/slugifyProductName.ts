import slugify from 'slugify'

export const generateProductSlug = (name: string): string => {
  return slugify(name, {
    replacement: '-',  // replace spaces with replacement character
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,       // convert to lower case
    strict: true,      // strip special characters except replacement
    locale: 'en',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars
  })
}

/** Shape shared by the Firebase-backed email template store and editor. */
export type EmailTemplateSeed = {
  id: string
  name: string
  subject: string
  body: string
  imageUrl?: string
  imageAlt?: string
}

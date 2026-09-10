export type EmailTemplateSeed = {
  id: string
  name: string
  subject: string
  body: string
}

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateSeed[] = [
  {
    id: "introducing-client-portal",
    name: "Introducing our new client portal",
    subject: "Introducing Our New Client Portal",
    body: `Dear Customer,

We’re pleased to introduce our new Falcon Energy client portal, designed to make working with us easier.

Through the portal, you’ll be able to:

- View project updates and progress
- Access important documents, files, and media
- Review assigned tasks
- Contact our team
- Learn more about our services
- View billing information and invoices when available

The portal will provide you with a convenient, central place to stay informed and manage your projects with us.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "project-progress-update",
    name: "Project progress update",
    subject: "Your Project Progress Update",
    body: `Dear [Customer Name],

Here’s a quick update on your project. We’re making steady progress and have completed the latest planned milestone.

You can view the current progress, project details, and any related files in your client portal.

We’ll share another update as the next milestone is completed. If you have any questions, please reply to this email.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "document-ready",
    name: "Document ready to review",
    subject: "A Document Is Ready for Your Review",
    body: `Dear [Customer Name],

A new document is ready for you to review in the Falcon Energy client portal.

Please sign in when convenient and open the Files section to view it. If anything is unclear or you need a change, let our team know.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "task-assigned",
    name: "Task assigned",
    subject: "A New Task Has Been Assigned to You",
    body: `Dear [Customer Name],

We’ve added a new task for you in the Falcon Energy client portal.

You can review the task details, due date, and any attached files in the Tasks section. Please let us know if you need clarification or additional information.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "invoice-available",
    name: "Invoice available",
    subject: "Your Falcon Energy Invoice Is Available",
    body: `Dear [Customer Name],

Your latest Falcon Energy invoice is now available in the client portal.

Please sign in to review the invoice details, amount due, and payment information in the Billing section.

If you have any questions about this invoice, please contact our team.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "estimate-for-approval",
    name: "Estimate ready for approval",
    subject: "Your Estimate Is Ready for Review",
    body: `Dear [Customer Name],

We’ve prepared an estimate for your review in the Falcon Energy client portal.

Please open the estimate to review the proposed work, pricing, and next steps. Once you’re ready, you can respond to our team with any questions or approval.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "contract-ready",
    name: "Contract ready for review",
    subject: "Your Contract Is Ready for Review",
    body: `Dear [Customer Name],

Your Falcon Energy contract is ready for review in the client portal.

Please take a moment to read through the agreement and contact us if you’d like to discuss any part of it. We’ll be happy to help with the next steps.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "project-kickoff",
    name: "Project kickoff",
    subject: "Welcome to Your Falcon Energy Project",
    body: `Dear [Customer Name],

We’re looking forward to working with you. Your project workspace is now available in the Falcon Energy client portal.

You can use it to follow progress, review documents, see assigned tasks, and stay in touch with our team throughout the project.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "portal-tip",
    name: "Client portal tip",
    subject: "A Quick Tip for Using Your Client Portal",
    body: `Dear [Customer Name],

As a reminder, your Falcon Energy client portal keeps your project information in one place.

Check the Overview for recent activity, Projects for progress, Files for shared documents, and Billing for invoices when available.

If you need help finding anything, reply to this email and our team will assist you.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "service-update",
    name: "Service update",
    subject: "An Update from Falcon Energy",
    body: `Dear [Customer Name],

We’re continuing to improve the way we support our customers and manage project work.

Your client portal gives you a clearer view of project activity, shared files, tasks, and billing information as it becomes available.

Thank you for working with Falcon Energy. Please reach out if there’s anything we can do to improve your experience.

Best regards,
Falcon Energy Team`,
  },
  {
    id: "feedback-request",
    name: "Feedback request",
    subject: "We’d Appreciate Your Feedback",
    body: `Dear [Customer Name],

We’d appreciate your feedback on your experience working with Falcon Energy.

Please reply with anything that has worked well, anything that could be clearer, or any suggestions for improving our service and client portal.

Thank you for your time.

Best regards,
Falcon Energy Team`,
  },
]

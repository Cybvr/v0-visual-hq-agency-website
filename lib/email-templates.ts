export type EmailTemplateSeed = {
  id: string
  name: string
  subject: string
  body: string
  imageUrl?: string
  imageAlt?: string
}

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateSeed[] = [
  {
    id: "introducing-ngai",
    name: "Introducing Ngai",
    subject: "Meet Ngai, Your New AI Teammate",
    body: `Dear [Customer Name],

Meet Ngai, your new AI teammate inside VisualCNS.

You can ask Ngai to:

- Find information about your projects, tasks, files, and billing documents
- Mark tasks complete or reopen them
- Accept estimates shared by our team
- Send feedback or questions directly to your agency

Open your client portal and select Ask Ngai to get started.

Best regards,
VisualCNS Team`,
    imageUrl: "/ngai-feature-announcement.svg",
    imageAlt: "Ngai AI assistant connecting workspace information to actions",
  },
  {
    id: "introducing-client-portal",
    name: "Introducing our new client portal",
    subject: "Introducing Our New Client Portal",
    body: `Dear Customer,

We’re pleased to introduce our new VisualCNS client portal, designed to make working with us easier.

Through the portal, you’ll be able to:

- View project updates and progress
- Access important documents, files, and media
- Review assigned tasks
- Contact our team
- Learn more about our services
- View billing information and invoices when available

The portal will provide you with a convenient, central place to stay informed and manage your projects with us.

Best regards,
VisualCNS Team`,
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
VisualCNS Team`,
  },
  {
    id: "document-ready",
    name: "Document ready to review",
    subject: "A Document Is Ready for Your Review",
    body: `Dear [Customer Name],

A new document is ready for you to review in the VisualCNS client portal.

Please sign in when convenient and open the Files section to view it. If anything is unclear or you need a change, let our team know.

Best regards,
VisualCNS Team`,
  },
  {
    id: "task-assigned",
    name: "Task assigned",
    subject: "A New Task Has Been Assigned to You",
    body: `Dear [Customer Name],

We’ve added a new task for you in the VisualCNS client portal.

You can review the task details, due date, and any attached files in the Tasks section. Please let us know if you need clarification or additional information.

Best regards,
VisualCNS Team`,
  },
  {
    id: "invoice-available",
    name: "Invoice available",
    subject: "Your VisualCNS Invoice Is Available",
    body: `Dear [Customer Name],

Your latest VisualCNS invoice is now available in the client portal.

Please sign in to review the invoice details, amount due, and payment information in the Billing section.

If you have any questions about this invoice, please contact our team.

Best regards,
VisualCNS Team`,
  },
  {
    id: "estimate-for-approval",
    name: "Estimate ready for approval",
    subject: "Your Estimate Is Ready for Review",
    body: `Dear [Customer Name],

We’ve prepared an estimate for your review in the VisualCNS client portal.

Please open the estimate to review the proposed work, pricing, and next steps. Once you’re ready, you can respond to our team with any questions or approval.

Best regards,
VisualCNS Team`,
  },
  {
    id: "contract-ready",
    name: "Contract ready for review",
    subject: "Your Contract Is Ready for Review",
    body: `Dear [Customer Name],

Your VisualCNS contract is ready for review in the client portal.

Please take a moment to read through the agreement and contact us if you’d like to discuss any part of it. We’ll be happy to help with the next steps.

Best regards,
VisualCNS Team`,
  },
  {
    id: "project-kickoff",
    name: "Project kickoff",
    subject: "Welcome to Your VisualCNS Project",
    body: `Dear [Customer Name],

We’re looking forward to working with you. Your project workspace is now available in the VisualCNS client portal.

You can use it to follow progress, review documents, see assigned tasks, and stay in touch with our team throughout the project.

Best regards,
VisualCNS Team`,
  },
  {
    id: "portal-tip",
    name: "Client portal tip",
    subject: "A Quick Tip for Using Your Client Portal",
    body: `Dear [Customer Name],

As a reminder, your VisualCNS client portal keeps your project information in one place.

Check the Overview for recent activity, Projects for progress, Files for shared documents, and Billing for invoices when available.

If you need help finding anything, reply to this email and our team will assist you.

Best regards,
VisualCNS Team`,
  },
  {
    id: "service-update",
    name: "Service update",
    subject: "An Update from VisualCNS",
    body: `Dear [Customer Name],

We’re continuing to improve the way we support our customers and manage project work.

Your client portal gives you a clearer view of project activity, shared files, tasks, and billing information as it becomes available.

Thank you for working with VisualCNS. Please reach out if there’s anything we can do to improve your experience.

Best regards,
VisualCNS Team`,
  },
  {
    id: "feedback-request",
    name: "Feedback request",
    subject: "We’d Appreciate Your Feedback",
    body: `Dear [Customer Name],

We’d appreciate your feedback on your experience working with VisualCNS.

Please reply with anything that has worked well, anything that could be clearer, or any suggestions for improving our service and client portal.

Thank you for your time.

Best regards,
VisualCNS Team`,
  },
]

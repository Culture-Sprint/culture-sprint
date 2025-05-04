
// Form save types and interfaces
export interface FormIdentifierData {
  projectId: string;
  formId: string;
}

export interface PublicLinkData {
  publicLink: string | null;
  formId: string | null;
}

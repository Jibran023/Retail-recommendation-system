/**
 * Category interface for product categorization
 */

export interface Category {
  id: string;
  name: string;
  icon?: string; // MUI icon name (optional)
  description?: string;
}

interface Checklist {
  user_id: string | null;
  status: string;
  id: string;
  sid: string;
  score: number;
  classification: number;
  model_id: string;
  property_id: string;
  created_by: string | null;
  person_id: string | null;
  finished_at: Date | null;
  created_at: Date;
  updated_at: Date;
  property: Property;
  organization?: any;
  user?: any;
  checklistItems: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  created_at: Date;
  updated_at: Date;
  checklist_id: string;
  item_id: string;
  score: number | null;
  observation: string | null;
  image: string | null;
  is_inspected: boolean;
  item: {
    name: string;
  };
}

interface Property {
  type: string;
  id: string;
  person_id: string | null;
  created_at: Date;
  updated_at: Date;
  name: string;
  address: string | null;
  organization_id: string;
  location: string | null;
  organization?: any;
  person?: Person;
}

interface Person {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  role: string | null;
  email: string | null;
  organization_id: string;
  phone: string | null;
}

declare module "*.png";

import type { Metadata } from 'next';
import PolicyPageLayout from '@/components/shared/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Wenxige Tea',
};

export default function TermsAndConditionsPage() {
  return <PolicyPageLayout titleKey="termsAndConditions" />;
}

import type { Metadata } from 'next';
import PolicyPageLayout from '@/components/shared/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Terms of Use — Wenxige Tea',
};

export default function TermsOfUsePage() {
  return <PolicyPageLayout title="Terms of Use" />;
}

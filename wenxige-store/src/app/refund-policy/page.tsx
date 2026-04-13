import type { Metadata } from 'next';
import PolicyPageLayout from '@/components/shared/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Refund Policy — Wenxige Tea',
};

export default function RefundPolicyPage() {
  return <PolicyPageLayout title="Refund Policy" />;
}

import type { Metadata } from 'next';
import PolicyPageLayout from '@/components/shared/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy — Wenxige Tea',
};

export default function ShippingPolicyPage() {
  return <PolicyPageLayout title="Shipping Policy" />;
}

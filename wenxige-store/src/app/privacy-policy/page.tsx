import type { Metadata } from 'next';
import PolicyPageLayout from '@/components/shared/PolicyPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Wenxige Tea',
};

export default function PrivacyPolicyPage() {
  return <PolicyPageLayout title="Privacy Policy" />;
}

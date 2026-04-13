'use client';

import Link from 'next/link';
import { Typography, Button, Card } from 'antd';
import {
  CloseCircleFilled,
  ReloadOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;

export default function CheckoutFailedPage() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '60px 24px 100px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <CloseCircleFilled
          style={{ fontSize: 80, color: '#ff4d4f', marginBottom: 24 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Title level={2} style={{ color: '#1A1A1A', marginBottom: 8 }}>
          {t.checkoutFailed.title}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
          {t.checkoutFailed.description}
        </Paragraph>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card
          style={{
            borderRadius: 16,
            textAlign: 'left',
            marginBottom: 32,
            border: '1px solid #ffccc7',
            background: '#fff2f0',
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            {t.checkoutFailed.commonReasons}
          </Text>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#666' }}>
            <li><Text type="secondary">{t.checkoutFailed.insufficientFunds}</Text></li>
            <li><Text type="secondary">{t.checkoutFailed.incorrectCard}</Text></li>
            <li><Text type="secondary">{t.checkoutFailed.declined}</Text></li>
            <li><Text type="secondary">{t.checkoutFailed.networkIssue}</Text></li>
          </ul>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Link href="/checkout">
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            icon={<ReloadOutlined />}
          >
            {t.checkoutFailed.tryAgain}
          </Button>
        </Link>
        <Link href="/contact">
          <Button shape="round" size="large" block icon={<CustomerServiceOutlined />}>
            {t.checkoutFailed.contactSupport}
          </Button>
        </Link>
        <Link href="/">
          <Button type="text" block icon={<HomeOutlined />}>
            {t.checkoutFailed.backToHome}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

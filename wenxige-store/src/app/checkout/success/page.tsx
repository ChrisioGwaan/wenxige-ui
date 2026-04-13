'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Typography, Button, Card, Divider } from 'antd';
import {
  CheckCircleFilled,
  ShoppingOutlined,
  HomeOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useCart } from '@/components/cart/CartContext';

const { Title, Text, Paragraph } = Typography;

export default function CheckoutSuccessPage() {
  const { clearCart, totalPrice, items } = useCart();
  const [orderNumber] = useState(() => `WXG-${Date.now().toString(36).toUpperCase()}`);
  const [cleared, setCleared] = useState(false);
  const itemCount = items.length;

  useEffect(() => {
    if (!cleared && itemCount > 0) {
      setCleared(true);
      clearCart();
    }
  }, [cleared, itemCount, clearCart]);

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
        <CheckCircleFilled
          style={{ fontSize: 80, color: '#52c41a', marginBottom: 24 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
          Payment Successful!
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
          Thank you for your order. We&apos;ll start preparing your tea right away.
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
            border: '1px solid rgba(45,80,22,0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text type="secondary">Order Number</Text>
            <Text strong copyable style={{ color: '#2D5016' }}>{orderNumber}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text type="secondary">Status</Text>
            <Text strong style={{ color: '#52c41a' }}>Confirmed</Text>
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 0 }}>
            A confirmation email has been sent to your email address. You can track
            your package anytime using the order number above.
          </Paragraph>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Link href="/track-order">
          <Button
            type="primary"
            shape="round"
            size="large"
            block
            icon={<FileSearchOutlined />}
          >
            Track My Order
          </Button>
        </Link>
        <Link href="/products">
          <Button shape="round" size="large" block icon={<ShoppingOutlined />}>
            Continue Shopping
          </Button>
        </Link>
        <Link href="/">
          <Button type="text" block icon={<HomeOutlined />}>
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

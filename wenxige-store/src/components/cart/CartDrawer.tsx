'use client';

import { Drawer, Button, Typography, InputNumber, Empty, Divider, Space } from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useCart } from './CartContext';
import { teaEmojis } from '@/data/products';
import { useTranslation } from '@/i18n';

const { Text, Title } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { t } = useTranslation();

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>
            🛒 {t.cart.title} {totalItems > 0 && `(${totalItems})`}
          </span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      size="default"
      closeIcon={<CloseOutlined />}
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' },
      }}
    >
      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Empty
            image={<span style={{ fontSize: 64 }}>🍃</span>}
            description={
              <Space orientation="vertical" size={8} style={{ textAlign: 'center' }}>
                <Text>{t.cart.empty}</Text>
                <Link href="/products" onClick={onClose}>
                  <Button type="primary" shape="round" icon={<ShoppingOutlined />}>
                    {t.cart.browseTeas}
                  </Button>
                </Link>
              </Space>
            }
          />
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
            {items.map((item) => {
              const emoji = teaEmojis[item.product.category] ?? '🍵';
              return (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '14px 0',
                    borderBottom: '1px solid #f5f5f5',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, rgba(45,80,22,0.08) 0%, rgba(196,163,90,0.08) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      flexShrink: 0,
                    }}
                  >
                    {emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', marginBottom: 2 }} ellipsis>
                      {item.product.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.product.nameZh} · {item.product.weight}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <InputNumber
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(val) => updateQuantity(item.product.id, val ?? 1)}
                        size="small"
                        style={{ width: 64 }}
                      />
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(item.product.id)}
                      />
                    </div>
                  </div>
                  <Text strong style={{ color: '#2D5016', whiteSpace: 'nowrap' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text type="secondary">{t.cart.subtotal} ({totalItems} {t.cart.items})</Text>
              <Title level={5} style={{ margin: 0, color: '#2D5016' }}>
                ${totalPrice.toFixed(2)}
              </Title>
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
              {t.cart.shippingNote}
            </Text>
            <Divider style={{ margin: '8px 0' }} />
            <Link href="/checkout" onClick={onClose}>
              <Button type="primary" block shape="round" size="large" style={{ marginBottom: 8 }}>
                {t.cart.proceedToCheckout}
              </Button>
            </Link>
            <Button
              type="text"
              block
              size="small"
              danger
              onClick={clearCart}
            >
              {t.cart.clearCart}
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}

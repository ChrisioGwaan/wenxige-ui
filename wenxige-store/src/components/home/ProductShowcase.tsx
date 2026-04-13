'use client';

import { Row, Col, Typography, Card, Tag, Button } from 'antd';
import { ArrowRightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { products, teaEmojis } from '@/data/products';
import { useCart } from '@/components/cart/CartContext';

const { Title, Paragraph, Text } = Typography;

const featured = products.slice(0, 4);

export default function ProductShowcase() {
  const { addItem, isInCart } = useCart();

  return (
    <section style={{ padding: '100px 48px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 48,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  color: '#C4A35A',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Featured Collection
              </div>
              <Title level={2} style={{ margin: 0, color: '#1A1A1A' }}>
                Our Finest Selections
              </Title>
            </div>
            <Link href="/products">
              <Button type="link" style={{ fontSize: 15, fontWeight: 500 }}>
                View All Products <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        <Row gutter={[24, 24]}>
          {featured.map((product, index) => {
            const inCart = isInCart(product.id);
            return (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <AnimatedSection delay={index * 0.1}>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      className="product-card"
                      hoverable
                      style={{ borderRadius: 16, overflow: 'hidden', height: '100%' }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div
                        style={{
                          height: 200,
                          background: `linear-gradient(135deg, rgba(45,80,22,0.08) 0%, rgba(196,163,90,0.08) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <span style={{ fontSize: 64 }}>{teaEmojis[product.category] || '🍵'}</span>
                        {product.tags[0] && (
                          <Tag
                            color="green"
                            style={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              borderRadius: 12,
                              fontWeight: 500,
                            }}
                          >
                            {product.tags[0]}
                          </Tag>
                        )}
                      </div>
                      <div style={{ padding: '20px 16px' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {product.nameZh} · {product.origin}
                        </Text>
                        <Title level={5} style={{ margin: '4px 0 8px' }}>
                          {product.name}
                        </Title>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <Text strong style={{ fontSize: 18, color: '#2D5016' }}>
                              ${product.price}
                            </Text>
                            {product.originalPrice && (
                              <Text
                                delete
                                type="secondary"
                                style={{ fontSize: 13, marginLeft: 8 }}
                              >
                                ${product.originalPrice}
                              </Text>
                            )}
                          </div>
                          <Button
                            type={inCart ? 'default' : 'primary'}
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addItem(product);
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </AnimatedSection>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
}

'use client';

import { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Typography,
  Card,
  Tag,
  Button,
  Input,
  Segmented,
  Select,
  Empty,
  Breadcrumb,
} from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { products, categories, teaEmojis, type Product } from '@/data/products';
import { useCart } from '@/components/cart/CartContext';
import { useTranslation } from '@/i18n';

const { Title, Text, Paragraph } = Typography;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name';

const sortProducts = (items: Product[], sort: SortOption): Product[] => {
  const sorted = [...items];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const { addItem, isInCart } = useCart();
  const { t, language } = useTranslation();

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameZh.includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q),
      );
    }
    return sortProducts(result, sortBy);
  }, [search, activeCategory, sortBy]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
      <AnimatedSection>
        <Breadcrumb
          items={[
            { title: <Link href="/"><HomeOutlined /> {t.common.home}</Link> },
            { title: t.common.products },
          ]}
          style={{ marginBottom: 24 }}
        />
        <Title level={2} style={{ color: '#2D5016', marginBottom: 8 }}>
          {t.productsPage.title}
        </Title>
        <Paragraph style={{ color: '#6B7280', fontSize: 16, marginBottom: 32 }}>
          {t.productsPage.description}
        </Paragraph>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 32,
            alignItems: 'center',
          }}
        >
          <Input
            placeholder={t.productsPage.searchPlaceholder}
            prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300, borderRadius: 8 }}
            allowClear
          />
          <Select
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            style={{ minWidth: 160 }}
            prefix={<FilterOutlined />}
            options={[
              { value: 'default', label: t.productsPage.sortDefault },
              { value: 'price-asc', label: t.productsPage.sortPriceAsc },
              { value: 'price-desc', label: t.productsPage.sortPriceDesc },
              { value: 'rating', label: t.productsPage.sortHighestRated },
              { value: 'name', label: t.productsPage.sortNameAZ },
            ]}
          />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <Segmented
          value={activeCategory}
          onChange={(val) => setActiveCategory(val as string)}
          options={categories.map((c) => ({ label: t.categories[c.key as keyof typeof t.categories], value: c.key }))}
          style={{ marginBottom: 40 }}
          size="large"
        />
      </AnimatedSection>

      {filtered.length === 0 ? (
        <AnimatedSection>
          <Empty
            description={t.productsPage.noResults}
            style={{ padding: '60px 0' }}
          />
        </AnimatedSection>
      ) : (
        <Row gutter={[24, 24]}>
          {filtered.map((product, index) => {
            const inCart = isInCart(product.id);
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <AnimatedSection delay={index * 0.05}>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      className="product-card"
                      hoverable
                      style={{
                        borderRadius: 16,
                        overflow: 'hidden',
                        height: '100%',
                        opacity: product.inStock ? 1 : 0.7,
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div
                        style={{
                          height: 180,
                          background: `linear-gradient(135deg, rgba(45,80,22,0.06) 0%, rgba(196,163,90,0.06) 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <span style={{ fontSize: 56 }}>
                          {teaEmojis[product.category] || '🍵'}
                        </span>
                        <div
                          style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            display: 'flex',
                            gap: 4,
                            flexWrap: 'wrap',
                          }}
                        >
                          {product.tags.map((tag) => (
                            <Tag
                              key={tag}
                              color="green"
                              style={{ borderRadius: 12, fontWeight: 500, fontSize: 11 }}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                        {!product.inStock && (
                          <Tag
                            color="default"
                            style={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              borderRadius: 12,
                            }}
                          >
                            {t.productsPage.outOfStock}
                          </Tag>
                        )}
                      </div>
                      <div style={{ padding: '16px' }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {language === 'en' ? product.nameZh : product.name} · {product.origin}
                        </Text>
                        <Title level={5} style={{ margin: '4px 0 4px', fontSize: 15 }}>
                          {language === 'en' ? product.name : product.nameZh}
                        </Title>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ color: '#6B7280', fontSize: 13, marginBottom: 8 }}
                        >
                          {product.description}
                        </Paragraph>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <Text strong style={{ fontSize: 17, color: '#2D5016' }}>
                              ${product.price}
                            </Text>
                            {product.originalPrice && (
                              <Text
                                delete
                                type="secondary"
                                style={{ fontSize: 12, marginLeft: 6 }}
                              >
                                ${product.originalPrice}
                              </Text>
                            )}
                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                              / {product.weight}
                            </Text>
                          </div>
                          <Button
                            type={inCart ? 'default' : 'primary'}
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                            size="small"
                            disabled={!product.inStock}
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
      )}

      <AnimatedSection delay={0.2}>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Paragraph type="secondary">
            {t.productsPage.showing} {filtered.length} {t.productsPage.of} {products.length} {t.productsPage.teas}
          </Paragraph>
        </div>
      </AnimatedSection>
    </div>
  );
}

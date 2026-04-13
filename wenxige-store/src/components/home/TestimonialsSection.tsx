'use client';

import { Row, Col, Typography, Card, Rate, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AnimatedSection from '@/components/shared/AnimatedSection';

const { Title, Paragraph, Text } = Typography;

const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    rating: 5,
    text: 'The Dragon Well tea is absolutely exquisite. The flavor is clean, sweet, and unlike anything I\'ve found locally. Wenxige has become my go-to tea source.',
    avatar: 'S',
    color: '#2D5016',
  },
  {
    name: 'James Chen',
    location: 'London, UK',
    rating: 5,
    text: 'As a long-time tea enthusiast, I can confidently say the quality here rivals what I\'ve tasted in China. The packaging is beautiful and the tea arrives incredibly fresh.',
    avatar: 'J',
    color: '#C4A35A',
  },
  {
    name: 'Yuki Tanaka',
    location: 'Tokyo, Japan',
    rating: 5,
    text: 'Ordered the Tie Guan Yin and was blown away. The aroma fills the entire room. The shipping was fast and the tea was carefully packed. Will order again!',
    avatar: 'Y',
    color: '#6B7280',
  },
];

export default function TestimonialsSection() {
  return (
    <section style={{ padding: '100px 48px', background: '#FDFBF7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
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
              Testimonials
            </div>
            <Title level={2} style={{ marginBottom: 16, color: '#1A1A1A' }}>
              What Our Customers Say
            </Title>
            <Paragraph
              style={{ fontSize: 16, color: '#6B7280', maxWidth: 500, margin: '0 auto' }}
            >
              Join thousands of tea lovers who trust Wenxige for their daily cup of serenity.
            </Paragraph>
          </div>
        </AnimatedSection>

        <Row gutter={[32, 32]}>
          {testimonials.map((item, index) => (
            <Col xs={24} md={8} key={item.name}>
              <AnimatedSection delay={index * 0.12}>
                <Card
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: 32 } }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${item.color}, transparent)`,
                    }}
                  />
                  <Rate disabled defaultValue={item.rating} style={{ fontSize: 14, marginBottom: 20 }} />
                  <Paragraph
                    style={{
                      fontSize: 15,
                      color: '#374151',
                      lineHeight: 1.8,
                      marginBottom: 24,
                      minHeight: 100,
                    }}
                  >
                    &ldquo;{item.text}&rdquo;
                  </Paragraph>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                      style={{ background: item.color }}
                      icon={<UserOutlined />}
                      size={40}
                    >
                      {item.avatar}
                    </Avatar>
                    <div>
                      <Text strong style={{ display: 'block' }}>
                        {item.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {item.location}
                      </Text>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

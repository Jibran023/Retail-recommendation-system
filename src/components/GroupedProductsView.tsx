/**
 * GroupedProductsView Component
 *
 * Groups already-fetched products by base_product_name
 * Safe client-side grouping using existing data
 */

import { Box, Card, CardContent, Typography, Chip, Stack, Avatar, IconButton, Collapse, Grid } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Star as StarIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { Product, ProductPrice } from '../types/Product.types';

interface GroupedProductsViewProps {
  products: Product[];
}

interface ProductGroup {
  base_product_name: string;
  brand_name: string;
  category: string;
  products: Product[];
  cheapestPrice: number;
  priceRange: string;
  image_url: string;
}

export function GroupedProductsView({ products }: GroupedProductsViewProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Group products by base_product_name
  const groupedProducts = products.reduce((groups: Record<string, Product[]>, product) => {
    if (!product.base_product_name) {
      // Products without base_product_name go into their own group
      groups[product.id] = [product];
    } else {
      const key = product.base_product_name;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(product);
    }
    return groups;
  }, {});

  // Convert to array and add metadata
  const productGroups: ProductGroup[] = Object.values(groupedProducts).map((groupProducts) => {
    const allPrices = groupProducts.flatMap((p: Product) => p.prices || []);
    const availablePrices = allPrices.filter((p: ProductPrice) => p.available);
    const cheapestPrice = availablePrices.length > 0 ? Math.min(...availablePrices.map((p) => p.price)) : null;
    const prices = allPrices.map((p) => p.price).filter((p) => p);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    return {
      base_product_name: groupProducts[0].base_product_name || groupProducts[0].name,
      brand_name: groupProducts[0].brand_name || '',
      category: groupProducts[0].category,
      products: groupProducts,
      cheapestPrice: cheapestPrice || 0,
      priceRange: minPrice && maxPrice ? `PKR ${(minPrice / 100).toFixed(0)} - ${(maxPrice / 100).toFixed(0)}` : 'N/A',
      image_url: groupProducts[0].image_url || '',
    };
  });

  // Sort by variant count (most variants first)
  productGroups.sort((a, b) => b.products.length - a.products.length);

  const formatPrice = (priceCents: number) => `PKR ${(priceCents / 100).toFixed(0)}`;
  const getStoreDisplayName = (storeId: string) => {
    return storeId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (productGroups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No products to display
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {productGroups.map((group) => {
        const isExpanded = expandedCard === group.base_product_name;
        const hasMultipleVariants = group.products.length > 1;

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={group.base_product_name}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
                ...(isExpanded && {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                  zIndex: 10,
                }),
              }}
            >
              {/* Best Price Badge */}
              {group.cheapestPrice > 0 && (
                <Chip
                  label={`From ${formatPrice(group.cheapestPrice)}`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: 'success.main',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    zIndex: 2,
                  }}
                />
              )}

              {/* Product Image or Placeholder */}
              <Box
                sx={{
                  height: 120,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                {group.image_url ? (
                  <Box
                    component="img"
                    src={group.image_url}
                    alt={group.base_product_name}
                    sx={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Typography variant="h6" color="text.disabled">
                    {group.base_product_name.charAt(0)}
                  </Typography>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Brand Badge */}
                {group.brand_name && (
                  <Chip
                    label={group.brand_name}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}

                {/* Product Name */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                    minHeight: 34,
                  }}
                >
                  {group.base_product_name}
                </Typography>

                {/* Variant Count & Category */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${group.products.length} ${group.products.length === 1 ? 'variant' : 'variants'}`}
                    size="small"
                    sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'info.50' }}
                  />
                  <Chip label={group.category} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                </Box>

                {/* Expand Button */}
                <IconButton
                  onClick={() => setExpandedCard(isExpanded ? null : group.base_product_name)}
                  sx={{
                    width: '100%',
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="button" sx={{ flexGrow: 1, fontSize: '0.85rem' }}>
                    {isExpanded ? 'Hide' : 'View'} {group.products.length} {group.products.length === 1 ? 'variant' : 'variants'}
                  </Typography>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </CardContent>

              {/* Expanded Variants */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, pt: 0, borderTop: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                  <Stack spacing={1}>
                    {group.products.map((product) => {
                      const prices = product.prices || [];
                      const cheapestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null;

                      return (
                        <Box
                          key={product.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          {/* Size Badge */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Chip label={product.size_display || 'N/A'} size="small" sx={{ height: 22, fontSize: '0.7rem' }} />
                            {cheapestPrice && (
                              <Typography variant="body2" fontWeight="bold" color="success.main">
                                {formatPrice(cheapestPrice)}
                              </Typography>
                            )}
                          </Box>

                          {/* Store Prices */}
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                            {prices.map((price) => {
                              const isCheapest = price.price === cheapestPrice;
                              return (
                                <Box
                                  key={`${product.id}-${price.storeId}`}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: isCheapest ? 'success.50' : 'action.hover',
                                    border: isCheapest ? 1 : 0,
                                    borderColor: 'success.main',
                                  }}
                                >
                                  {isCheapest && <StarIcon sx={{ fontSize: 12, color: 'success.main' }} />}
                                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                    {getStoreDisplayName(price.storeId)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                    {formatPrice(price.price)}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Stack>

                          {/* Product Name */}
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.5, display: 'block' }}>
                            {product.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Collapse>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

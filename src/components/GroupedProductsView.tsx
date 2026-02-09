/**
 * GroupedProductsView Component
 *
 * Groups already-fetched products by base_product_name
 * Safe client-side grouping using existing data
 */

import { Box, Card, CardContent, Typography, Chip, IconButton, useTheme, alpha, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Close as CloseIcon, Star as StarIcon, ShoppingCart } from '@mui/icons-material';
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
  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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
    // Filter out invalid prices (Rs.0)
    const validPrices = allPrices.filter((p: ProductPrice) => p.price > 0);
    const availablePrices = validPrices.filter((p: ProductPrice) => p.available);
    const cheapestPrice = availablePrices.length > 0 ? Math.min(...availablePrices.map((p) => p.price)) : null;
    const prices = validPrices.map((p) => p.price).filter((p) => p);
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
    <>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2.5,
      }}
    >
      {productGroups.map((group) => {
        const isExpanded = expandedCard === group.base_product_name;

        return (
          <>
          <Box key={group.base_product_name} sx={{ position: 'relative' }}>
            <Card
              sx={{
                height: 380,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: 'primary.main',
                },
                ...(isExpanded && {
                  boxShadow: theme.shadows[8],
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
                    bgcolor: alpha(theme.palette.success.main, 0.95),
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
                  height: 140,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                {group.image_url && !imageErrors.has(group.image_url) ? (
                  <Box
                    component="img"
                    src={group.image_url}
                    alt={group.base_product_name}
                    onError={() => {
                      setImageErrors(prev => new Set(prev).add(group.image_url));
                    }}
                    sx={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <ShoppingCart
                      sx={{
                        fontSize: 64,
                        color: alpha(theme.palette.primary.main, 0.3),
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.disabled',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                      }}
                    >
                      No Image
                    </Typography>
                  </Box>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, pb: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Brand Badge */}
                {group.brand_name && (
                  <Chip
                    label={group.brand_name}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 1, height: 20, fontSize: '0.7rem', borderColor: alpha(theme.palette.primary.main, 0.3) }}
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
                    sx={{ height: 20, fontSize: '0.65rem', bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.dark' }}
                  />
                  <Chip label={group.category} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: alpha(theme.palette.secondary.main, 0.1) }} />
                </Box>

                {/* Expand Button */}
                <IconButton
                  onClick={() => {
                    setExpandedCard(isExpanded ? null : group.base_product_name);
                  }}
                  sx={{
                    width: '100%',
                    height: 36,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    transition: 'all 0.2s',
                    mt: 'auto',
                  }}
                >
                  <Typography variant="button" sx={{ flexGrow: 1, fontSize: '0.85rem' }}>
                    {isExpanded ? 'Hide' : 'View'} {group.products.length} {group.products.length === 1 ? 'variant' : 'variants'}
                  </Typography>
                  <ExpandMoreIcon />
                </IconButton>
                </CardContent>
            </Card>
          </Box>

          {/* Variants Dialog */}
          <Dialog
            open={isExpanded}
            onClose={() => setExpandedCard(null)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: theme.shadows[12],
              }
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {group.base_product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {group.products.length} {group.products.length === 1 ? 'Variant' : 'Variants'} Available
                </Typography>
              </Box>
              <IconButton
                onClick={() => setExpandedCard(null)}
                sx={{
                  bgcolor: alpha(theme.palette.action.hover, 0.5),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.action.hover, 0.8),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {group.products.map((product) => {
                  const prices = product.prices || [];
                  const cheapestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : null;

                  return (
                    <Box
                      key={product.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      {/* Size Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Chip
                          label={product.size_display || 'N/A'}
                          size="medium"
                          sx={{
                            height: 28,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        />
                        {cheapestPrice && (
                          <Typography variant="h6" fontWeight="bold" color="success.main">
                            {formatPrice(cheapestPrice)}
                          </Typography>
                        )}
                      </Box>

                      {/* Product Name */}
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1.5,
                          color: 'text.secondary',
                          fontSize: '0.85rem',
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Store Prices */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {prices.map((price) => {
                          const isCheapest = price.price === cheapestPrice;
                          return (
                            <Box
                              key={`${product.id}-${price.storeId}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                px: 1.5,
                                py: 1,
                                borderRadius: 1.5,
                                bgcolor: isCheapest
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.action.hover, 0.3),
                                border: isCheapest ? 1.5 : 0,
                                borderColor: isCheapest ? 'success.main' : 'transparent',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isCheapest && <StarIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                                  {getStoreDisplayName(price.storeId)}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: isCheapest ? 700 : 600, fontSize: '0.95rem' }}>
                                {formatPrice(price.price)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </DialogContent>
          </Dialog>
          </>
        );
      })}
    </Box>
    </>
  );
}

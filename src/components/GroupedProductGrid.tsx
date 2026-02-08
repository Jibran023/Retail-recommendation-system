/**
 * Grouped Product Grid Component
 *
 * Displays products grouped by base name in an interactive grid
 * - Compact cards showing product image, name, and price range
 * - Expandable to show all variants with store prices
 * - Best value highlighting
 * - Smooth animations and transitions
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Grid,
  Stack,
  Avatar,
  useTheme,
  alpha,
  Popper,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Store as StoreIcon,
  LocalOffer as LocalOfferIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';
import { supabase } from '../services/supabaseClient';

interface Product {
  id: string;
  name: string;
  base_product_name: string;
  brand_name: string;
  size_value: number;
  size_unit: string;
  size_display: string;
  category: string;
  image_url: string;
  prices: Array<{
    store_id: string;
    price_cents: number;
    availability: boolean;
  }>;
}

interface GroupedProductsProps {
  category?: string;
  searchQuery?: string;
  limit?: number;
}

interface ProductGroup {
  base_product_name: string;
  brand_name: string;
  category: string;
  products: Product[];
  cheapestPrice: number;
  cheapestStore: string;
  priceRange: string;
  image_url: string;
  variantCount: number;
  availableStores: string[];
}

export function GroupedProductGrid({ category, searchQuery, limit = 50 }: GroupedProductsProps) {
  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch products on mount and when dependencies change
  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            prices (
              store_id,
              price_cents,
              availability
            )
          `)
          .not('base_product_name', 'is', null)
          .limit(limit);

        if (category) {
          query = query.eq('category', category);
        }

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (!data) return;

        // Group products by base_product_name
        const grouped: Record<string, Product[]> = {};
        data.forEach((product: Product) => {
          const key = product.base_product_name;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(product);
        });

        // Convert to product groups with metadata
        const productGroups: ProductGroup[] = Object.entries(grouped).map(([baseName, products]) => {
          const allPrices = products.flatMap(p => p.prices || []);
          const availablePrices = allPrices.filter(p => p.availability);
          const cheapestPrice = availablePrices.length > 0
            ? Math.min(...availablePrices.map(p => p.price_cents))
            : null;

          const cheapestPriceObj = availablePrices.find(p => p.price_cents === cheapestPrice);
          const prices = allPrices.map(p => p.price_cents).filter(p => p);
          const minPrice = prices.length > 0 ? Math.min(...prices) : null;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

          const stores = [...new Set(allPrices.map(p => p.store_id))];

          return {
            base_product_name: baseName,
            brand_name: products[0].brand_name || '',
            category: products[0].category,
            products: products.sort((a, b) => (a.size_value || 0) - (b.size_value || 0)),
            cheapestPrice: cheapestPrice || 0,
            cheapestStore: cheapestPriceObj?.store_id || '',
            priceRange: minPrice && maxPrice
              ? `PKR ${(minPrice / 100).toFixed(0)} - ${(maxPrice / 100).toFixed(0)}`
              : 'N/A',
            image_url: products[0].image_url || '',
            variantCount: products.length,
            availableStores: stores,
          };
        });

        // Sort by variant count (most variants first)
        productGroups.sort((a, b) => b.variantCount - a.variantCount);

        setGroups(productGroups);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, searchQuery, limit]);

  const formatPrice = (priceCents: number) => {
    return `PKR ${(priceCents / 100).toFixed(0)}`;
  };

  const getStoreDisplayName = (storeId: string) => {
    return storeId
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStoreColor = (storeId: string) => {
    const colors: Record<string, string> = {
      'imtiaz': theme.palette.error.main,
      'bin-hashim': theme.palette.success.main,
      'al-jadeed': theme.palette.info.main,
    };
    return colors[storeId] || theme.palette.primary.main;
  };

  if (loading) {
    return (
      <Grid container spacing={2.5}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Card>
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (groups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {groups.map((group) => {
        const isExpanded = expandedCard === group.base_product_name;

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={group.base_product_name}>
            <Box
              sx={{
                position: 'relative',
              }}
            >
              <Card
                sx={{
                  height: 420,
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
                {/* Best Value Badge */}
                {group.cheapestPrice > 0 && (
                  <Chip
                    icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
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
                      boxShadow: theme.shadows[2],
                    }}
                  />
                )}

                {/* Product Image */}
                {group.image_url && !imageErrors.has(group.image_url) ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={group.image_url}
                    alt={group.base_product_name}
                    onError={() => {
                      setImageErrors(prev => new Set(prev).add(group.image_url));
                    }}
                    sx={{
                      objectFit: 'contain',
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, pb: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Brand Badge */}
                  {group.brand_name && (
                    <Chip
                      label={group.brand_name}
                      size="small"
                      variant="outlined"
                      sx={{
                        mb: 1,
                        height: 20,
                        fontSize: '0.7rem',
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      }}
                    />
                  )}

                  {/* Product Name */}
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
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
                      label={`${group.variantCount} sizes`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.dark',
                      }}
                    />
                    <Chip
                      label={group.category}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      }}
                    />
                  </Box>

                  {/* Available Stores */}
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 'auto' }}>
                    {group.availableStores.map((storeId) => (
                      <Avatar
                        key={storeId}
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '0.65rem',
                          bgcolor: getStoreColor(storeId),
                        }}
                      >
                        {storeId.charAt(0).toUpperCase()}
                      </Avatar>
                    ))}
                  </Box>

                  {/* Expand Button */}
                  <IconButton
                    onClick={(e) => {
                      if (isExpanded) {
                        setExpandedCard(null);
                        setAnchorEl(null);
                      } else {
                        setExpandedCard(group.base_product_name);
                        setAnchorEl(e.currentTarget);
                      }
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
                    }}
                  >
                    <Typography variant="button" sx={{ flexGrow: 1, fontSize: '0.85rem' }}>
                      {isExpanded ? 'Hide' : 'View'} {group.variantCount} variants
                    </Typography>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </CardContent>
              </Card>

              {/* Expanded Variants - Popper */}
              <Popper
                open={isExpanded}
                anchorEl={anchorEl}
                placement="bottom-start"
                transition
                modifiers={[
                  {
                    name: 'flip',
                    enabled: true,
                    options: {
                      altBoundary: true,
                      tether: true,
                    },
                  },
                ]}
                sx={{
                  zIndex: 1300,
                  width: 320,
                  maxWidth: 'calc(100vw - 32px)',
                }}
              >
                <ClickAwayListener onClickAway={() => { setExpandedCard(null); setAnchorEl(null); }}>
                  <Paper
                    elevation={8}
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      borderRadius: 2,
                      maxHeight: 400,
                      overflowY: 'auto',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: theme.shadows[8],
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        {group.variantCount} Variants Available
                      </Typography>
                      <Stack spacing={1.5}>
                        {group.products.map((product) => {
                          const prices = product.prices || [];
                          const cheapestPrice = prices.length > 0
                            ? Math.min(...prices.map(p => p.price_cents))
                            : null;

                          return (
                            <Box
                              key={product.id}
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  boxShadow: theme.shadows[2],
                                },
                              }}
                            >
                              {/* Size Badge */}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Chip
                                  label={product.size_display || 'N/A'}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  }}
                                />
                                {cheapestPrice && (
                                  <Typography variant="body2" fontWeight="bold" color="success.main">
                                    {formatPrice(cheapestPrice)}
                                  </Typography>
                                )}
                              </Box>

                              {/* Store Prices */}
                              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                {prices.map((price) => {
                                  const isCheapest = price.price_cents === cheapestPrice;
                                  return (
                                    <Box
                                      key={`${product.id}-${price.store_id}`}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        bgcolor: isCheapest
                                          ? alpha(theme.palette.success.main, 0.1)
                                          : alpha(theme.palette.action.hover, 0.5),
                                        border: isCheapest ? 1 : 0,
                                        borderColor: isCheapest ? 'success.main' : 'transparent',
                                      }}
                                    >
                                      {isCheapest && <StarIcon sx={{ fontSize: 12, color: 'success.main' }} />}
                                      <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                                        {getStoreDisplayName(price.store_id)}
                                      </Typography>
                                      <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: isCheapest ? 700 : 600 }}>
                                        {formatPrice(price.price_cents)}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </Stack>

                              {/* Product Name (smaller) */}
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.65rem',
                                  color: 'text.secondary',
                                  mt: 0.5,
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {product.name}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

/**
 * ProductGroup Component
 *
 * Displays all variants of a product grouped by base product name
 * Shows size comparison and prices across different sizes/stores
 */

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Box, Typography, Card, CardContent, Chip, Stack, Grid } from '@mui/material';

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

interface ProductGroupProps {
  baseProductName: string;
  category?: string;
  maxSize?: number; // Optional filter for max size
}

export function ProductGroup({ baseProductName, category, maxSize }: ProductGroupProps) {
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVariants() {
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
        .eq('base_product_name', baseProductName)
        .order('size_value');

      if (category) {
        query = query.eq('category', category);
      }

      if (maxSize) {
        query = query.lte('size_value', maxSize);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching variants:', error);
      } else {
        setVariants(data || []);
      }
      setLoading(false);
    }

    fetchVariants();
  }, [baseProductName, category, maxSize]);

  if (loading) {
    return <Typography>Loading variants...</Typography>;
  }

  if (variants.length === 0) {
    return <Typography>No variants found for {baseProductName}</Typography>;
  }

  // Get unique stores across all variants
  const stores = Array.from(
    new Set(
      variants.flatMap(v => v.prices?.map(p => p.store_id) || [])
    )
  );

  // Format price for display
  const formatPrice = (priceCents: number) => {
    return `PKR ${(priceCents / 100).toFixed(0)}`;
  };

  // Get price for a specific store
  const getPriceForStore = (product: Product, storeId: string) => {
    const price = product.prices?.find(p => p.store_id === storeId);
    return price ? formatPrice(price.price_cents) : '-';
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {baseProductName}
        </Typography>
        {variants[0].brand_name && (
          <Chip
            label={variants[0].brand_name}
            size="small"
            color="primary"
            sx={{ mr: 1 }}
          />
        )}
        <Chip
          label={variants[0].category}
          size="small"
          variant="outlined"
        />
        <Chip
          label={`${variants.length} variants`}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Variants Grid */}
      <Grid container spacing={2}>
        {variants.map((variant) => (
          <Grid key={variant.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                {/* Size Badge */}
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={variant.size_display || 'N/A'}
                    color="secondary"
                    size="small"
                  />
                </Box>

                {/* Product Name */}
                <Typography variant="subtitle2" gutterBottom>
                  {variant.name}
                </Typography>

                {/* Prices by Store */}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {stores.map(storeId => (
                    <Box
                      key={storeId}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.5,
                        px: 1,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {storeId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {getPriceForStore(variant, storeId)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/**
 * ProductGroupList Component
 *
 * Displays multiple product groups, useful for category pages
 */
interface ProductGroupListProps {
  category?: string;
  limit?: number;
}

export function ProductGroupList({ category, limit = 20 }: ProductGroupListProps) {
  const [groups, setGroups] = useState<Array<{ base_product_name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      let query = supabase
        .from('products')
        .select('base_product_name')
        .not('base_product_name', 'is', null);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching groups:', error);
      } else if (data) {
        // Count occurrences of each base product
        const counts: Record<string, number> = {};
        data.forEach((item: { base_product_name: string }) => {
          const name = item.base_product_name;
          counts[name] = (counts[name] || 0) + 1;
        });

        // Convert to array and sort by count
        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ base_product_name: name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);

        setGroups(sorted);
      }
      setLoading(false);
    }

    fetchGroups();
  }, [category, limit]);

  if (loading) {
    return <Typography>Loading product groups...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {category || 'All'} Products (Grouped)
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Found {groups.length} product groups
      </Typography>

      {groups.map(group => (
        <ProductGroup
          key={group.base_product_name}
          baseProductName={group.base_product_name}
          category={category}
        />
      ))}
    </Box>
  );
}

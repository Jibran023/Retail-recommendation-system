/**
 * Simple Grouped Product Grid - For Testing
 */

import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Skeleton, Alert } from '@mui/material';
import { supabase } from '../services/supabaseClient';

export function GroupedProductGridSimple({ category }: { category?: string }) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Fetching products for category:', category);

        let query = supabase
          .from('products')
          .select('*')
          .not('base_product_name', 'is', null)
          .limit(20);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (!data) return;

        console.log('Fetched products:', data.length);

        // Group products
        const grouped: Record<string, any[]> = {};
        data.forEach((product: any) => {
          const key = product.base_product_name;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(product);
        });

        const productGroups = Object.entries(grouped).map(([name, products]) => ({
          base_product_name: name,
          products,
          count: products.length,
        }));

        setGroups(productGroups);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {category || 'All Products'} - {groups.length} groups
      </Typography>

      <Grid container spacing={2}>
        {groups.map((group) => (
          <Grid item xs={12} sm={6} md={4} key={group.base_product_name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{group.base_product_name}</Typography>
                <Chip label={`${group.count} variants`} size="small" />
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Sizes: {group.products.map((p: any) => p.size_display || 'N/A').join(', ')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

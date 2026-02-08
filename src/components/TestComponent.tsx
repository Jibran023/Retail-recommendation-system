/**
 * Test component to check if rendering works
 */

import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

export function TestComponent() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Component - If you can see this, React is working!
      </Typography>

      <Grid container spacing={2}>
        {[
          { name: '7UP', variants: 6, sizes: '250ml, 500ml, 1L, 1.5L, 2.25L, 3L' },
          { name: 'PEPSI', variants: 6, sizes: '250ml, 500ml, 1L, 1.5L, 2.25L, 3L' },
          { name: 'MOUNTAIN DEW', variants: 6, sizes: '250ml, 500ml, 1L, 1.5L' },
          { name: 'VITAL TEA', variants: 12, sizes: '85g, 170g, 430g, 900g' },
        ].map((product) => (
          <Grid key={product.name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.variants} variants
                </Typography>
                <Typography variant="caption" display="block">
                  Sizes: {product.sizes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
        <Typography variant="body1">
          ✅ Test component rendered successfully!
        </Typography>
        <Typography variant="body2">
          If you can see this, the basic React setup is working.
          Now we need to check the Supabase connection.
        </Typography>
      </Box>
    </Box>
  );
}

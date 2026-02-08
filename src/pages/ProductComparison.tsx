/**
 * Product Comparison Page
 *
 * Demonstrates product grouping by base product name
 * Shows all variants with prices across different stores
 */

import { ProductGroup } from '../components/ProductGroup';
import { ProductGroupList } from '../components/ProductGroup';
import { Box, Typography, Container, Tabs, Tab, Paper } from '@mui/material';
import { useState } from 'react';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProductComparison() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Comparison
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Compare prices across different sizes and stores. Products are grouped by their base name.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Beverages" />
          <Tab label="Tea & Coffee" />
          <Tab label="Snacks & Confectionary" />
          <Tab label="All Products" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ProductGroupList category="Beverages" limit={15} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ProductGroupList category="Tea & Coffee" limit={15} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProductGroupList category="Snacks & Confectionary" limit={15} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <ProductGroupList limit={15} />
        </TabPanel>
      </Paper>

      {/* Featured Examples */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Featured Product Groups
        </Typography>

        <Box sx={{ mb: 4 }}>
          <ProductGroup baseProductName="7UP" />
        </Box>

        <Box sx={{ mb: 4 }}>
          <ProductGroup baseProductName="PEPSI" />
        </Box>

        <Box sx={{ mb: 4 }}>
          <ProductGroup baseProductName="TAPAL DANEDAR TEA" />
        </Box>

        <Box sx={{ mb: 4 }}>
          <ProductGroup baseProductName="VITAL TEA" />
        </Box>
      </Box>
    </Container>
  );
}

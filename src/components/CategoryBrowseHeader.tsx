/**
 * Category Browse Header
 *
 * Beautiful header for category browsing with stats and info
 */

import { Box, Typography, Chip, Stack, useTheme, alpha } from '@mui/material';
import {
  LocalOffer as LocalOfferIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

interface CategoryBrowseHeaderProps {
  categoryName: string;
  productCount?: number;
  variantCount?: number;
  storeCount?: number;
}

export function CategoryBrowseHeader({
  categoryName,
  productCount = 0,
  variantCount = 0,
  storeCount = 2,
}: CategoryBrowseHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {categoryName}
      </Typography>

      {/* Subtitle */}
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compare prices across {storeCount} stores • Products grouped by name
      </Typography>

      {/* Stats */}
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InventoryIcon sx={{ color: 'success.main', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {productCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Products
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalOfferIcon sx={{ color: 'info.main', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {variantCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Variants
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StoreIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {storeCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Stores
            </Typography>
          </Box>
        </Box>
      </Stack>

      {/* Info Tip */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: alpha(theme.palette.info.main, 0.08),
          border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Tip:</strong> Products are grouped by their base name. Click on any product card to expand and see all available sizes with prices from different stores!
        </Typography>
      </Box>
    </Box>
  );
}

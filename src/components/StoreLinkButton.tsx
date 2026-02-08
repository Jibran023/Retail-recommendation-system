import { Button } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { getStoreInfo } from '../constants/stores';
import type { ProductPrice } from '../types/Product.types';

/**
 * StoreLinkButton component for clicking through to store websites
 *
 * Features:
 * - Opens store website in new tab (security: noopener noreferrer)
 * - Disabled when store URL is not available
 * - Meets 44x44px touch target requirement (WCAG AA)
 * - Works on both mobile and desktop
 * - Shows product name in accessibility label
 */
interface StoreLinkButtonProps {
  price: ProductPrice;
  productName: string;
}

export function StoreLinkButton({ price, productName }: StoreLinkButtonProps) {
  const storeInfo = getStoreInfo(price.storeName);
  const storeUrl = storeInfo?.websiteUrl;

  // If no store URL is available, don't render the button
  if (!storeUrl) {
    return null;
  }

  // For MVP: We don't have individual product URLs, so we'll link to the store's main website
  // Phase 2: Add individual product URLs to ProductPrice type
  const handleClick = () => {
    window.open(storeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleClick}
      startIcon={<OpenInNew fontSize="small" />}
      aria-label={`View ${productName} on ${price.storeName} website`}
      sx={{
        width: '100%',
        mt: 1,
        textTransform: 'none',
        // Ensure minimum touch target size (WCAG AA)
        minHeight: 44,
        minWidth: 44,
      }}
    >
      View on {price.storeName} Website
    </Button>
  );
}

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import { Close, Place, Phone, Business } from '@mui/icons-material';
import { getStoreInfo } from '../constants/stores';
import type { ProductPrice } from '../types/Product.types';

/**
 * StoreModal component for displaying detailed store information
 *
 * Features:
 * - Modal with store details (name, area, address, phone)
 * - Keyboard accessible (ESC to close, focus trap)
 * - Works on mobile and desktop
 * - Close button (X) in top-right
 * - Clicking outside closes modal
 * - Content scrollable if needed
 * - Screen reader compatible
 * - Responsive (90% mobile, 500px desktop)
 *
 * Usage:
 * <StoreModal price={price} trigger={<ClickableStoreName />} />
 */
interface StoreModalProps {
  price: ProductPrice;
  trigger: React.ReactNode;
}

export function StoreModal({ price, trigger }: StoreModalProps) {
  const [open, setOpen] = useState(false);
  const storeInfo = getStoreInfo(price.storeName);

  // If no store info is available, just return the trigger without modal functionality
  if (!storeInfo) {
    return <>{trigger}</>;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Wrap trigger with click handler
  const triggerWithClick = (
    <Box
      onClick={handleOpen}
      sx={{ cursor: 'pointer', display: 'inline-block' }}
      role="button"
      tabIndex={0}
      aria-label={`View ${storeInfo.name} information`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      {trigger}
    </Box>
  );

  return (
    <>
      {triggerWithClick}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="store-modal-title"
        aria-describedby="store-modal-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '500px' },
            maxHeight: '80vh',
          },
        }}
      >
        {/* Header with title and close button */}
        <DialogTitle
          id="store-modal-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business color="primary" />
            <Typography variant="h6" component="div">
              Store Information
            </Typography>
          </Box>
          <IconButton
            aria-label="Close modal"
            onClick={handleClose}
            sx={{
              // Ensure minimum touch target size (WCAG AA)
              width: 44,
              height: 44,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        {/* Content with store details */}
        <DialogContent id="store-modal-description">
          <Box sx={{ mt: 2 }}>
            {/* Store name */}
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {storeInfo.name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Area */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Place sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Area
                </Typography>
                <Typography variant="body1">
                  {storeInfo.area}, {storeInfo.city}
                </Typography>
              </Box>
            </Box>

            {/* Address */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Place sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1">
                  {storeInfo.address}
                </Typography>
              </Box>
            </Box>

            {/* Phone */}
            {storeInfo.phone && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Phone sx={{ color: 'text.secondary', mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {storeInfo.phone}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Coordinates (for debugging/info) */}
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`${storeInfo.latitude.toFixed(4)}°, ${storeInfo.longitude.toFixed(4)}°`}
                size="small"
                variant="outlined"
                color="info"
              />
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        {/* Footer with close button */}
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            autoFocus
            sx={{
              // Ensure minimum touch target size (WCAG AA)
              minHeight: 44,
              minWidth: 44,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

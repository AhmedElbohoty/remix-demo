import {useMediaQuery, useTheme, Box, Button, Paper, Stack, Typography} from '@mui/material';
import {DeleteOutline, EditOutlined} from '@mui/icons-material';

import {AppButton} from '~/global/components/app-button';

import ProductImg1 from '~/assets/product_1.jpg';
import ProductImg2 from '~/assets/product_2.jpg';
import {ApiProduct} from '~/api-client/types';

const STYLES = {
  card: {
    p: 2,
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    position: 'relative',
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 1,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 1,
  },
  activeIndicator: {
    position: 'absolute',
    right: '-10px',
    top: '-10px',
    display: 'inline-block',
    width: 32,
    height: 32,
    bgcolor: 'success.main',
    borderRadius: '50%',
    ml: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 8,
  },
  cardDescription: {
    mb: 2,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    borderColor: 'primary.main',
    borderStyle: 'solid',
    borderWidth: 1,
    bgcolor: 'primary.main',
    color: 'white',
    borderRadius: 1,
    textTransform: 'none',
    px: 3,
  },
  deleteButton: {
    boxSizing: 'border-box',
    bgcolor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'primary.main',
    color: 'primary.main',
    borderRadius: 1,
    textTransform: 'none',
    px: 3,
  },
  cardTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    position: 'relative',
    paddingRight: '20px',
  },
};

type ProductTableRowProps = {row: ApiProduct; doDeleteItem: (item: ApiProduct) => void};

export const ProductCard = ({row, doDeleteItem}: ProductTableRowProps) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down(360));

  return (
    <Paper sx={STYLES.card}>
      <Stack spacing={2}>
        <Box sx={{position: 'relative'}}>
          <Box
            component="img"
            src={[ProductImg1, ProductImg2][Math.floor(Math.random() * 2)]} // Choose random image
            sx={STYLES.cardImage}
            alt={row.title.en || row.title.ar}
          />
          {row.isActive && <Box component="span" sx={STYLES.activeIndicator} />}
        </Box>

        <Box>
          <Box sx={STYLES.cardHeader}>
            <Box>
              <Typography variant="h6" component="div" sx={STYLES.cardTitle}>
                {row.title.en || row.title.ar}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={STYLES.cardDescription}>
                {row.description?.en || row.description?.ar || 'No description available'}
              </Typography>
            </Box>
            <Typography variant="h6" color="primary" component="div">
              ${Number(row.price).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={STYLES.cardActions}>
            <Button variant="contained" sx={STYLES.deleteButton} onClick={() => doDeleteItem(row)}>
              {isSmall ? <DeleteOutline /> : 'Delete Product'}
            </Button>

            <AppButton to={`/products/${row.productId}`} variant="contained" sx={STYLES.editButton}>
              {isSmall ? <EditOutlined /> : 'Edit Product'}
            </AppButton>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
};

import {useTranslation} from 'react-i18next';
import {useSnackbar, type VariantType} from 'notistack';
import {formatRelative} from 'date-fns';

import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {DeleteOutline} from '@mui/icons-material';

import {useMutationCategoriesDelete} from '~/services/categories';

import {AppButton} from '~/global/components/app-button';

import {ApiCategory} from '~/api-client/types';

//
//

export const CategoriesTable = ({data}: {data: ApiCategory[]; isLoading: boolean}) => {
  const {t} = useTranslation();
  const {enqueueSnackbar} = useSnackbar();
  const deleteItem = useMutationCategoriesDelete();

  //

  const doDeleteItem = (item: ApiCategory) => {
    if (!window.confirm(t('common:deleteConfirm', {item: item.title.en || item.title.ar}))) return;

    deleteItem.mutate(
      {id: item.categoryId},
      {
        onSuccess: async result => {
          result?.meta?.message &&
            enqueueSnackbar(result?.meta?.message, {variant: 'success' as VariantType});
        },
        onError: err => {
          enqueueSnackbar(err?.message || 'unknown error', {variant: 'error' as VariantType});
        },
      },
    );
  };

  //
  //

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Box>{t('common:title')}</Box>
              <Typography variant="caption" color="textDisabled">
                {t('common:id')}
              </Typography>
            </TableCell>
            <TableCell align="right" width={190}>
              <Box>{t('common:createdAt')}</Box>
              <Typography variant="caption" color="textDisabled">
                {t('common:updatedAt')}
              </Typography>
            </TableCell>
            <TableCell align="right" width={160}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(row => (
            <CategoryTableRow key={row.categoryId} row={row} doDeleteItem={doDeleteItem} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

//
//

type CategoryTableRowProps = {row: ApiCategory; doDeleteItem: (item: ApiCategory) => void};

const CategoryTableRow: React.FC<CategoryTableRowProps> = ({
  row,
  doDeleteItem,
}: CategoryTableRowProps) => {
  const {t} = useTranslation();

  return (
    <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
      <TableCell component="th" scope="row">
        <Box>{row.title.en || row.title.ar}</Box>
        <Typography variant="caption" color="textDisabled">
          {row.categoryId}
        </Typography>
        {row.isActive ? (
          <Typography variant="caption" color="success" ml={1}>
            {t('common:active')}
          </Typography>
        ) : null}
      </TableCell>
      <TableCell align="right">
        <Box>{formatRelative(new Date(row.createdAt), new Date())}</Box>
        <Typography variant="caption" color="textDisabled">
          {row.updatedAt && row.updatedAt !== row.createdAt
            ? formatRelative(new Date(row.updatedAt), new Date())
            : '---'}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Stack spacing={1} direction="row">
          <Button variant="text" onClick={() => doDeleteItem(row)}>
            <DeleteOutline />
          </Button>
          <AppButton to={`/categories/${row.categoryId}`} variant="contained">
            {t('common:edit')}
          </AppButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

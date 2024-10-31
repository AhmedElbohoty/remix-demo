import React from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from '@remix-run/react';

import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Container,
  Menu,
  Tooltip,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {Logout} from '@mui/icons-material';

import {useQueryProfile} from '~/services/auth';

import {useLanguageChanger} from '~/global/hooks/use-language-changer';
import {useI18nNavigate} from '~/global/hooks/use-i18n-navigate';
import {useMatchLocation} from '~/global/hooks/use-match-location';

import {ApiUser} from '~/api-client/types';
import {apiProfileGetResponse} from '~/api-client';

import {AppButton} from '../app-button';

//
//

export const HeaderNavbar = () => {
  return (
    <AppBar
      position="fixed"
      component="nav"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: '#ffffff99',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 1rem 0.5rem rgba(0 0 0 / 0.015)',
      }}
    >
      <Container maxWidth="md" disableGutters>
        <Toolbar>
          <HeaderNavbarLinks />
          <Box flexGrow={1} />
          <HeaderNavbarLocale />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const HeaderNavbarLinks = () => {
  const {t} = useTranslation(['auth']);
  const matchLocation = useMatchLocation();
  const {data, isFetching} = useQueryProfile({enabled: !!window.localStorage.getItem('_at')});

  if (isFetching) return null;

  const profile = (data as apiProfileGetResponse | undefined)?.result as unknown as ApiUser;

  if (profile?.userId) return <HeaderNavbarProfile profile={profile} />;

  return (
    <>
      <AppButton
        sx={{py: 1}}
        size="large"
        disableRipple
        color={matchLocation('/') ? 'primary' : 'inherit'}
        to="/"
      >
        {t('common:home')}
      </AppButton>
      <Typography mx={1}></Typography>
      <AppButton
        sx={{py: 1}}
        size="large"
        disableRipple
        color={matchLocation('/sign-up') ? 'primary' : 'inherit'}
        to="/sign-up"
      >
        {t('auth:signUp.title')}
      </AppButton>
      <Typography mx={1}></Typography>
      <AppButton
        sx={{py: 1}}
        size="large"
        disableRipple
        color={matchLocation('/sign-in') ? 'primary' : 'inherit'}
        to="/sign-in"
      >
        {t('auth:signIn.title')}
      </AppButton>
    </>
  );
};

const HeaderNavbarProfile = ({profile}: {profile: ApiUser}) => {
  const {t} = useTranslation();
  const navigate = useI18nNavigate();
  const matchLocation = useMatchLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  //

  const doLogout = () => {
    window.localStorage.clear();
    window.location.pathname = '/';
  };

  //
  //

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="medium"
          sx={{ml: 2}}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar alt={profile.name} sx={{bgcolor: 'primary.main'}} />
        </IconButton>
      </Tooltip>
      <Menu
        elevation={0}
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 12px rgba(0,0,0,0.1))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={doLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <AppButton
        sx={{py: 1}}
        size="large"
        disableRipple
        color={matchLocation('/') ? 'primary' : 'inherit'}
        to="/"
      >
        {t('common:home')}
      </AppButton>
      <Typography mx={1}></Typography>
      <AppButton
        sx={{py: 1}}
        size="large"
        disableRipple
        color={matchLocation('/products') ? 'primary' : 'inherit'}
        to="/products"
      >
        {t('common:products')}
      </AppButton>
      <Typography mx={1}></Typography>
      <AppButton
        sx={{py: 1}}
        size="large"
        disableRipple
        color={matchLocation('/categories') ? 'primary' : 'inherit'}
        to="/categories"
      >
        {t('common:categories')}
      </AppButton>
    </>
  );
};

const HeaderNavbarLocale = () => {
  const locale = useLanguageChanger();

  if (locale.current === 'en')
    return (
      <Link
        to={locale.getLanguageURL('ar')}
        color="inherit"
        style={{color: 'inherit', textDecoration: 'none', fontSize: '1.6rem'}}
      >
        🇸🇦
      </Link>
    );

  return (
    <Link
      to={locale.getLanguageURL('en')}
      color="inherit"
      style={{color: 'inherit', textDecoration: 'none', fontSize: '1.6rem'}}
    >
      🇺🇸
    </Link>
  );
};
